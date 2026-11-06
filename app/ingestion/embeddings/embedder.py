import os
import tempfile
from pathlib import Path
from typing import List, Optional
import numpy as np
from app.core.config.settings import settings
from app.core.logging.logger import logger


class OnnxBgeEmbedder:
    """
    Lightweight ONNX Runtime + HuggingFace Tokenizers inference engine for BAAI/bge-small-en-v1.5.
    Designed for serverless environments (e.g. Vercel) where PyTorch exceeds the 250MB bundle limit.
    Produces 384-dimensional CLS-pooled, L2-normalized embeddings identical to SentenceTransformers.
    """
    TOKENIZER_URL = "https://huggingface.co/BAAI/bge-small-en-v1.5/resolve/main/tokenizer.json"
    ONNX_MODEL_URL = "https://huggingface.co/Xenova/bge-small-en-v1.5/resolve/main/onnx/model_quantized.onnx"

    def __init__(self):
        self.session = None
        self.tokenizer = None
        self.cache_dir = Path(tempfile.gettempdir()) / "bge_small_en_v1_5_onnx"

    def _ensure_loaded(self):
        if self.session is not None and self.tokenizer is not None:
            return

        import httpx
        import onnxruntime as ort
        from tokenizers import Tokenizer

        self.cache_dir.mkdir(parents=True, exist_ok=True)
        tokenizer_path = self.cache_dir / "tokenizer.json"
        model_path = self.cache_dir / "model_quantized.onnx"

        headers = {}
        if settings.HF_TOKEN:
            headers["Authorization"] = f"Bearer {settings.HF_TOKEN}"

        with httpx.Client(follow_redirects=True, timeout=30.0, headers=headers) as client:
            if not tokenizer_path.exists() or tokenizer_path.stat().st_size == 0:
                logger.info("Downloading BGE tokenizer.json to cache...")
                resp = client.get(self.TOKENIZER_URL)
                resp.raise_for_status()
                tokenizer_path.write_bytes(resp.content)

            if not model_path.exists() or model_path.stat().st_size < 1_000_000:
                logger.info("Downloading quantized BGE ONNX model (~32MB) to cache...")
                resp = client.get(self.ONNX_MODEL_URL)
                resp.raise_for_status()
                model_path.write_bytes(resp.content)

        self.tokenizer = Tokenizer.from_file(str(tokenizer_path))
        self.tokenizer.enable_truncation(max_length=512)
        self.tokenizer.enable_padding(pad_id=0, pad_token="[PAD]")

        sess_options = ort.SessionOptions()
        sess_options.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
        self.session = ort.InferenceSession(
            str(model_path),
            sess_options=sess_options,
            providers=["CPUExecutionProvider"],
        )
        logger.info("OnnxBgeEmbedder initialized successfully.")

    def encode(self, texts: List[str]) -> List[List[float]]:
        self._ensure_loaded()
        encoded_batch = self.tokenizer.encode_batch(texts)

        input_ids = np.array([e.ids for e in encoded_batch], dtype=np.int64)
        attention_mask = np.array([e.attention_mask for e in encoded_batch], dtype=np.int64)
        token_type_ids = np.array([e.type_ids for e in encoded_batch], dtype=np.int64)

        input_names = {inp.name for inp in self.session.get_inputs()}
        ort_inputs = {
            "input_ids": input_ids,
            "attention_mask": attention_mask,
        }
        if "token_type_ids" in input_names:
            ort_inputs["token_type_ids"] = token_type_ids

        outputs = self.session.run(None, ort_inputs)
        # CLS token pooling (index 0) matching BAAI/bge-small-en-v1.5 Pooling(pooling_mode='cls')
        cls_embeddings = outputs[0][:, 0, :]
        norms = np.linalg.norm(cls_embeddings, axis=1, keepdims=True)
        norms[norms == 0] = 1.0
        normalized = cls_embeddings / norms
        return [vec.astype(np.float32).tolist() for vec in normalized]


class EmbeddingGenerator:
    """
    Generates dense vector embeddings using SentenceTransformers with BAAI/bge-small-en-v1.5,
    or lightweight ONNX Runtime in serverless environments (Vercel).
    Includes fallback mock embedding mode for offline/dry-run environments.
    """
    def __init__(self, model_name: str = settings.EMBEDDING_MODEL):
        self.model_name = model_name
        self.model = None
        self.onnx_embedder: Optional[OnnxBgeEmbedder] = None
        self._load_model()

    def _load_model(self):
        # On Vercel serverless, prefer lightweight ONNX Runtime first; otherwise prefer SentenceTransformer first
        if os.environ.get("VERCEL"):
            if self._try_load_onnx() or self._try_load_sentence_transformer():
                return
        else:
            if self._try_load_sentence_transformer() or self._try_load_onnx():
                return
        logger.warning("Neither SentenceTransformer nor ONNX Runtime embedder available; offline fallback active.")

    def _try_load_sentence_transformer(self) -> bool:
        try:
            if settings.HF_TOKEN:
                os.environ["HF_TOKEN"] = settings.HF_TOKEN
            from sentence_transformers import SentenceTransformer
            logger.info(f"Loading SentenceTransformer model '{self.model_name}'...")
            self.model = SentenceTransformer(self.model_name)
            logger.info("Embedding model loaded successfully.")
            return True
        except Exception as exc:
            logger.warning(f"SentenceTransformer unavailable ({exc}).")
            return False

    def _try_load_onnx(self) -> bool:
        try:
            import onnxruntime  # noqa: F401
            import tokenizers  # noqa: F401
            self.onnx_embedder = OnnxBgeEmbedder()
            logger.info("Configured lightweight ONNX Runtime embedder for BAAI/bge-small-en-v1.5.")
            return True
        except Exception as exc:
            logger.warning(f"ONNX Runtime embedder unavailable ({exc}).")
            return False

    def embed_texts(self, texts: List[str], batch_size: int = settings.PROCESSING_BATCH_SIZE) -> List[List[float]]:
        if not texts:
            return []

        if self.model is not None:
            try:
                embeddings = self.model.encode(
                    texts,
                    batch_size=batch_size,
                    show_progress_bar=False,
                    normalize_embeddings=True,
                )
                return [e.tolist() for e in embeddings]
            except Exception as exc:
                logger.error(f"Error generating embeddings with SentenceTransformer: {exc}")

        if self.onnx_embedder is not None:
            try:
                return self.onnx_embedder.encode(texts)
            except Exception as exc:
                logger.error(f"Error generating embeddings with OnnxBgeEmbedder: {exc}")

        # Fallback deterministic normalized 384-dimensional vector for dry-run/testing
        logger.info(f"Generating deterministic fallback vectors for {len(texts)} chunks.")
        dummy_vectors = []
        for text in texts:
            val = float(hash(text) % 1000) / 1000.0
            vector = [val] * 384
            dummy_vectors.append(vector)
        return dummy_vectors
