import json
import math
import numpy as np
from pathlib import Path
from dataclasses import dataclass
from typing import List, Dict, Any, Optional
from app.core.config.settings import settings
from app.core.logging.logger import logger
from app.retrieval.query_embedder.query_embedder import QueryEmbedder

@dataclass
class RetrievedChunk:
    chunk_id: str
    score: float
    clean_text: str
    metadata: Dict[str, Any]

class LocalVectorRetriever:
    """
    High-performance vector retriever utilizing vectorized NumPy matrix dot-products
    over pre-computed 5,772 document embeddings from /processed/embeddings/.
    """
    def __init__(self, processed_dir: Optional[Path] = None):
        # Resolve processed_dir from settings if not explicitly provided, with project-root fallback for serverless
        default_dir = Path(getattr(settings, "PROCESSED_DIR", "processed"))
        if not default_dir.exists():
            repo_root_candidate = Path(__file__).resolve().parents[3] / "processed"
            if repo_root_candidate.exists():
                default_dir = repo_root_candidate
        self.processed_dir = processed_dir or default_dir
        self.embeddings_dir = self.processed_dir / "embeddings"
        self.embedder = QueryEmbedder()
        self.local_cache: List[Dict[str, Any]] = []
        self.embedding_matrix: Optional[np.ndarray] = None
        self._load_local_index()

    def _load_local_index(self):
        """
        Loads pre-computed vector payload from processed/embeddings/index.npz and chunks.json,
        falling back to legacy *_embeddings.json if not present.
        """
        logger.info(f"LocalVectorRetriever initializing...")
        logger.info(f"Resolved processed_dir: {self.processed_dir.absolute()}")
        logger.info(f"Resolved embeddings_dir: {self.embeddings_dir.absolute()}")

        if not self.embeddings_dir.exists():
            logger.error(f"Embeddings directory does not exist: {self.embeddings_dir.absolute()}")
            return

        self.local_cache.clear()
        npz_file = self.embeddings_dir / "index.npz"
        chunks_file = self.embeddings_dir / "chunks.json"

        # Fast path: load optimized binary index and compact metadata
        if npz_file.exists() and chunks_file.exists():
            try:
                logger.info(f"Loading optimized index from '{npz_file.name}' and metadata from '{chunks_file.name}'...")
                with np.load(npz_file) as data:
                    self.embedding_matrix = data["matrix"]
                with open(chunks_file, "r", encoding="utf-8") as f:
                    self.local_cache = json.load(f)
                logger.info(
                    f"SUCCESS: Loaded {len(self.local_cache)} vector documents into NumPy matrix index "
                    f"shape {self.embedding_matrix.shape} (RAM optimized)."
                )
                return
            except Exception as exc:
                logger.error(f"Error loading optimized index artifacts: {exc}. Falling back to JSON files...")

        # Fallback path: load from legacy *_embeddings.json
        json_files = list(self.embeddings_dir.glob("*_embeddings.json"))
        logger.info(f"Found {len(json_files)} embedding JSON file(s) in {self.embeddings_dir}")

        for json_file in json_files:
            try:
                with open(json_file, "r", encoding="utf-8") as f:
                    docs = json.load(f)
                    if isinstance(docs, list):
                        self.local_cache.extend(docs)
                        logger.info(f"Loaded {len(docs)} vectors from '{json_file.name}'")
                    else:
                        logger.warning(f"File '{json_file.name}' does not contain a list, skipping.")
            except json.JSONDecodeError as exc:
                logger.error(f"JSON decode error in '{json_file.name}': {exc}")
            except Exception as exc:
                logger.error(f"Error loading vector artifact '{json_file.name}': {exc}")

        if self.local_cache:
            raw_embeddings = [doc.get("embedding", [0.0] * 384) for doc in self.local_cache]
            # Pre-normalize rows to L2 unit length
            matrix = np.array(raw_embeddings, dtype=np.float32)
            norms = np.linalg.norm(matrix, axis=1, keepdims=True)
            norms[norms == 0] = 1.0
            self.embedding_matrix = matrix / norms
            logger.info(
                f"SUCCESS: Loaded {len(self.local_cache)} vector documents into NumPy matrix index "
                f"shape {self.embedding_matrix.shape}."
            )
        else:
            logger.error(
                "CRITICAL: No vectors loaded from embeddings directory. "
                "Retriever will return empty results for all queries."
            )

    def retrieve(
        self,
        query: str,
        top_k: int = settings.RETRIEVAL_TOP_K,
        filters: Optional[Dict[str, Any]] = None,
    ) -> List[RetrievedChunk]:
        """
        Retrieves top_k relevant document chunks for the user query using NumPy vectorized matrix dot-product.
        """
        if not query or not query.strip():
            return []

        logger.info(f"Retrieving top {top_k} chunks for query: '{query[:60]}...'")

        # Early exit if index is empty
        if self.embedding_matrix is None or len(self.local_cache) == 0:
            logger.warning("Retrieve called but embedding_matrix is None or local_cache is empty. Returning [].")
            return []

        query_vector = np.array(self.embedder.embed_query(query), dtype=np.float32)

        # Normalize query vector
        q_norm = np.linalg.norm(query_vector)
        if q_norm > 0:
            query_vector = query_vector / q_norm
        #------------------------------------------------------------------
        # NumPy vectorized matrix dot-product (<2ms latency)
        all_scores = np.dot(self.embedding_matrix, query_vector)

        candidate_indices = range(len(self.local_cache))

        # Apply metadata filters if present
        if filters:
            filtered_indices = []
            for idx in candidate_indices:
                meta = self.local_cache[idx].get("metadata", {})
                match = True
                for k, v in filters.items():
                    if k in meta and str(meta[k]).lower() != str(v).lower():
                        match = False
                        break
                if match:
                    filtered_indices.append(idx)
            candidate_indices = filtered_indices

        if not candidate_indices:
            logger.info("All chunks filtered out by metadata filters.")
            return []

        # Sort candidate indices by score descending
        sorted_indices = sorted(candidate_indices, key=lambda idx: float(all_scores[idx]), reverse=True)[:top_k]

        retrieved_chunks = [
            RetrievedChunk(
                chunk_id=self.local_cache[idx].get("id", ""),
                score=round(float(all_scores[idx]), 4),
                clean_text=self.local_cache[idx].get("clean_text", ""),
                metadata=self.local_cache[idx].get("metadata", {}),
            )
            for idx in sorted_indices
        ]

        top_score = retrieved_chunks[0].score if retrieved_chunks else 0.0
        logger.info(f"Retrieval complete. Found {len(retrieved_chunks)} chunks (top score: {top_score}).")
        return retrieved_chunks


# Alias QdrantRetriever to LocalVectorRetriever for backward compatibility across existing Phase 4-5 imports.
QdrantRetriever = LocalVectorRetriever