import sys
import time
from enum import Enum

# Terminal formatting codes
class Color(str, Enum):
    RESET = "\033[0m"
    BOLD = "\033[1m"
    RED = "\033[91m"
    YELLOW = "\033[93m"
    GREEN = "\033[92m"
    GRAY = "\033[90m"
    BG_RED = "\033[41m"
    BG_YELLOW = "\033[43m"
    BG_GREEN = "\033[42m"
    BG_GRAY = "\033[100m"


class BannerType(Enum):
    INFO = ("INFO", Color.BG_GRAY, Color.GRAY)
    WARNING = ("WARNING", Color.BG_YELLOW, Color.YELLOW)
    ERROR = ("ERROR", Color.BG_RED, Color.RED)
    SUCCESS = ("SUCCESS", Color.BG_GREEN, Color.GREEN)
    LOADING = ("LOADING", Color.BG_GRAY, Color.GRAY)
    DEBUG = ("DEBUG", Color.BG_YELLOW, Color.YELLOW)

def banner(message: str, type: BannerType = BannerType.INFO):
    """Print a colored banner message based on type."""
    tag, bg_color, fg_color = type.value
    print(f"{bg_color}{Color.BOLD} {tag} {Color.RESET} {fg_color}{message}{Color.RESET}\n")


def loading(total: int, current: int, filename: str, start_time: float = None, current_time: float = None):
    """Display progress bar with estimated time remaining."""
    bar_len = 30
    filled = int(bar_len * current / total)
    bar = "#" * filled + "-" * (bar_len - filled)
    percent = int((current / total) * 100)

    # Estimate remaining time
    eta_str = ""
    if start_time is not None:
        current_time = current_time or time.time()
        elapsed = current_time - start_time
        avg_per_file = elapsed / current
        remaining_files = total - current
        eta_seconds = int(avg_per_file * remaining_files)

        minutes, seconds = divmod(eta_seconds, 60)
        eta_str = f" | ETA: {minutes}m {seconds}s"

    # Construct the string manually instead of calling banner()
    tag, bg_color, fg_color = BannerType.LOADING.value
    line = f"{bg_color}{Color.BOLD} {tag} {Color.RESET} {fg_color}Processing file {current}/{total}: {filename} |{bar}| {percent}%{eta_str}{Color.RESET}"

    sys.stdout.write(f"\r{line}")  # overwrite the same line
    sys.stdout.flush()

    if current == total:
        print()