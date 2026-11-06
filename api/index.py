import os
import sys
from pathlib import Path

# Ensure repository root is on sys.path for serverless function imports
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

os.environ.setdefault("VERCEL", "1")

from app.main import app  # noqa: E402, F401

