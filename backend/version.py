"""Deployed git SHA — stamped by CI to DEPLOYED_SHA at the deploy root.

/health returns this so ops tooling can prove source==deployed==running and
catch "deployed but never restarted".
"""

import subprocess
from pathlib import Path

_SHA_FILE = Path(__file__).resolve().parent.parent / "DEPLOYED_SHA"


def deployed_sha() -> str:
    """Return the deployed git SHA, or 'unknown' if unavailable."""
    try:
        sha = _SHA_FILE.read_text().strip()
        if sha:
            return sha
    except OSError:
        pass
    try:
        out = subprocess.run(
            ["git", "rev-parse", "HEAD"],
            cwd=_SHA_FILE.parent,
            capture_output=True,
            text=True,
            timeout=2,
        ).stdout.strip()
        return out or "unknown"
    except Exception:
        return "unknown"
