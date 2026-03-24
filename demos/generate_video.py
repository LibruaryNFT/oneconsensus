"""
Fully automated demo video generator for OneConsensus.
Playwright records screen, OpenAI TTS generates voice, ffmpeg combines.
"""

import asyncio
import os
import subprocess
import sys
from pathlib import Path

if sys.platform == "win32":
    import io

    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

from dotenv import load_dotenv

load_dotenv(Path("<eco-root>/.env"))
load_dotenv(Path(__file__).parent.parent / "backend" / ".env")

DEMO_DIR = Path(__file__).parent
APP_URL = "http://localhost:3000"
FFMPEG = "<user-home>/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1-full_build/bin/ffmpeg.exe"
FFPROBE = FFMPEG.replace("ffmpeg.exe", "ffprobe.exe")

# Script synced to what's actually on screen
FULL_SCRIPT = """What if three AI agents could independently analyze a real-world asset worth hundreds of millions of dollars, debate its risks, and record their verdict on the blockchain?

This is OneConsensus. AI-powered risk intelligence for tokenized assets, built on OneChain.

Three autonomous agents work together. The Auditor finds opportunity. The Risk Officer flags danger. The Arbitrator reaches consensus. Every evaluation is verified on-chain.

Let's see it in action. We have six tokenized assets. A Manhattan office tower, Iowa farmland, a container vessel fleet, gold reserves, a toll road network, and a solar farm.

Let's evaluate the Manhattan Office Tower. Eight hundred fifty million dollars, four point two percent yield.

The three AI agents analyze simultaneously. The Auditor, powered by Claude, identifies strong yield potential and institutional demand. The Risk Officer, powered by GPT, raises concerns about market cycles and interest rate exposure.

The Arbitrator synthesizes both views and delivers the final verdict. A risk score, a recommended collateral ratio, and a clear recommendation. All reasoning is transparent. You see exactly how each agent reached its conclusion.

Now here's what makes this different. We record this assessment directly on OneChain's testnet. One click. A real blockchain transaction. Verifiable by anyone on the OneChain explorer. Three Move smart contracts. Leaderboard, prediction pool, and rewards. All deployed and live.

We also track agent performance over time. Three thousand seven hundred forty-one assessments. Eighty-four percent accuracy. Ninety-one percent top performance score. Every agent has a verifiable track record.

OneConsensus. Transparent AI risk intelligence for the trillion-dollar tokenized asset market. Built on OneChain with OneRWA, OneWallet, OnePredict, and OneID. Thank you."""


async def generate_voiceover() -> Path:
    """Generate voiceover using OpenAI TTS."""
    from openai import OpenAI

    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    print("Generating voiceover...")
    response = client.audio.speech.create(
        model="tts-1-hd",
        voice="onyx",
        input=FULL_SCRIPT,
        speed=0.92,
    )

    audio_path = DEMO_DIR / "voiceover.mp3"
    response.stream_to_file(str(audio_path))
    print(f"  Saved: {audio_path} ({audio_path.stat().st_size / 1024:.0f} KB)")
    return audio_path


async def record_screen() -> Path:
    """Record screen with Playwright — smooth navigation matching the script."""
    from playwright.async_api import async_playwright

    video_dir = DEMO_DIR / "screen_recording"
    video_dir.mkdir(exist_ok=True)
    # Clean old recordings
    for f in video_dir.glob("*.webm"):
        f.unlink()

    print("Recording screen...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1920, "height": 1080},
            record_video_dir=str(video_dir),
            record_video_size={"width": 1920, "height": 1080},
        )
        page = await context.new_page()

        # Helper for smooth scrolling
        async def smooth_scroll(y: int, duration: int = 1500):
            await page.evaluate(f"window.scrollTo({{top: {y}, behavior: 'smooth'}})")
            await page.wait_for_timeout(duration)

        # ===== SCENE 1: Landing page hero (0:00-0:12) =====
        print("  Scene 1: Landing page hero...")
        await page.goto(APP_URL, wait_until="networkidle", timeout=30000)
        await page.wait_for_timeout(5000)  # Let animations play

        # ===== SCENE 2: Scroll to show agents + features (0:12-0:22) =====
        print("  Scene 2: Scroll to agents section...")
        await smooth_scroll(400, 2000)
        await page.wait_for_timeout(2000)
        await smooth_scroll(800, 2000)  # Shows "Meet Your Risk Assessment Team"
        await page.wait_for_timeout(3000)
        await smooth_scroll(1200, 2000)  # Shows feature cards
        await page.wait_for_timeout(2000)

        # ===== SCENE 3: Navigate to Evaluate page (0:22-0:30) =====
        print("  Scene 3: Navigate to Evaluate...")
        await smooth_scroll(0, 1000)
        await page.wait_for_timeout(1000)
        await page.click('a[href="/arena"]', timeout=5000)
        await page.wait_for_timeout(4000)

        # ===== SCENE 4: Show asset grid (0:30-0:40) =====
        print("  Scene 4: Show assets...")
        await smooth_scroll(300, 2000)  # Scroll to see all 6 asset cards
        await page.wait_for_timeout(4000)

        # ===== SCENE 5: Click Manhattan Office Tower (0:40-0:45) =====
        print("  Scene 5: Select Manhattan Office Tower...")
        await smooth_scroll(200, 1000)
        try:
            await page.click('button:has-text("Manhattan")', timeout=5000)
        except Exception:
            buttons = await page.query_selector_all("button")
            if len(buttons) > 1:
                await buttons[1].click()
        await page.wait_for_timeout(3000)

        # ===== SCENE 6: Click Evaluate button (0:45-0:48) =====
        print("  Scene 6: Click Evaluate...")
        try:
            await page.click('button:has-text("Evaluate")', timeout=5000)
        except Exception:
            pass
        await page.wait_for_timeout(2000)

        # ===== SCENE 7: AI Debate loading + results (0:48-1:15) =====
        print("  Scene 7: AI Debate (waiting for results)...")
        await page.wait_for_timeout(15000)  # Wait for AI debate to appear
        await smooth_scroll(400, 2000)  # Scroll to see debate panels
        await page.wait_for_timeout(5000)
        await smooth_scroll(700, 2000)  # Scroll to see more
        await page.wait_for_timeout(5000)

        # ===== SCENE 8: Show consensus results (1:15-1:25) =====
        print("  Scene 8: Consensus results...")
        await smooth_scroll(1000, 2000)
        await page.wait_for_timeout(5000)

        # ===== SCENE 9: Record on chain (1:25-1:35) =====
        print("  Scene 9: Record on chain...")
        try:
            await page.click('button:has-text("Record")', timeout=3000)
        except Exception:
            try:
                await page.click('button:has-text("Chain")', timeout=3000)
            except Exception:
                pass
        await page.wait_for_timeout(5000)

        # ===== SCENE 10: Navigate to Agent Performance (1:35-1:50) =====
        print("  Scene 10: Agent Performance page...")
        await page.click('a[href="/leaderboard"]', timeout=5000)
        await page.wait_for_timeout(4000)
        await smooth_scroll(300, 2000)  # Show agent cards
        await page.wait_for_timeout(4000)
        await smooth_scroll(600, 2000)  # Show evaluation methodology
        await page.wait_for_timeout(3000)

        # ===== SCENE 11: Back to landing for closing (1:50-2:00) =====
        print("  Scene 11: Closing on landing page...")
        await page.click('a[href="/"]', timeout=5000)
        await page.wait_for_timeout(5000)

        await context.close()
        await browser.close()

    video_files = list(video_dir.glob("*.webm"))
    if not video_files:
        print("  ERROR: No video recorded!")
        return None

    recorded = video_files[0]
    print(f"  Saved: {recorded} ({recorded.stat().st_size / 1024 / 1024:.1f} MB)")
    return recorded


def combine(video: Path, audio: Path) -> Path:
    """Combine video + audio with ffmpeg."""
    output = DEMO_DIR / "oneconsensus_demo.mp4"

    # Get audio duration
    result = subprocess.run(
        [
            FFPROBE,
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(audio),
        ],
        capture_output=True,
        text=True,
    )
    duration = float(result.stdout.strip()) if result.stdout.strip() else 120

    print(f"Combining video ({video.stat().st_size / 1024 / 1024:.1f}MB) + audio ({duration:.0f}s)...")

    subprocess.run(
        [
            FFMPEG,
            "-y",
            "-i",
            str(video),
            "-i",
            str(audio),
            "-c:v",
            "libx264",
            "-preset",
            "medium",
            "-crf",
            "23",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            "-t",
            str(duration),
            "-vf",
            "scale=1920:1080",
            "-shortest",
            "-pix_fmt",
            "yuv420p",
            str(output),
        ],
        check=True,
        capture_output=True,
    )

    print(f"  Final: {output} ({output.stat().st_size / 1024 / 1024:.1f} MB)")
    return output


async def main():
    print("=" * 60)
    print("OneConsensus Demo Video Generator v2")
    print("=" * 60)

    audio = await generate_voiceover()
    video = await record_screen()
    if not video:
        return
    final = combine(video, audio)

    print()
    print("=" * 60)
    print(f"DONE: {final}")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
