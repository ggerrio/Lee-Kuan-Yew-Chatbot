import os
import sys
from pathlib import Path
from loguru import logger
from app.core.config.settings import settings

def setup_logging():
    """
    Configures Loguru logging format and handlers.
    """
    # Remove default standard logger handlers
    logger.remove()

    # Console stdout handler
    logger.add(
        sys.stdout,
        level=settings.LOG_LEVEL.upper(),
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
        colorize=True,
        backtrace=settings.DEBUG,
        diagnose=settings.DEBUG,
    )

    # File logger handler (use /tmp/logs on serverless read-only filesystems like Vercel)
    try:
        log_dir = Path("/tmp/logs") if os.environ.get("VERCEL") else Path("logs")
        log_dir.mkdir(parents=True, exist_ok=True)
        logger.add(
            str(log_dir / "app.log"),
            rotation="10 MB",
            retention="7 days",
            level="INFO",
            format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {name}:{function}:{line} - {message}",
            compression="zip",
            enqueue=False if os.environ.get("VERCEL") else True,
        )
    except Exception:
        # Read-only filesystem fallback: stdout logging is already active
        pass

    return logger

# Initialize default loguru logger
setup_logging()
