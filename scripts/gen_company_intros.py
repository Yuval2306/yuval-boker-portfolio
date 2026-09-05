"""
Generate personalized narrator intros for company links (?for=Company).

Usage:
    python scripts/gen_company_intros.py                # generates the built-in list
    python scripts/gen_company_intros.py "Wix" "Monday"  # generates only these

Requires:  pip install edge-tts   (and ffmpeg on PATH)
Output:    public/intro/<slug>.mp3  — "Welcome, <Company> team... to the portfolio of Yuval Boker."
"""
import asyncio, os, re, subprocess, sys, tempfile, unicodedata
import edge_tts

COMPANIES = [
    "Wix", "Monday", "Google", "Microsoft", "Meta", "Amazon", "Apple", "Nvidia", "Intel",
    "Check Point", "Palo Alto", "CyberArk", "Lightricks", "Fiverr", "Playtika", "Taboola",
    "Outbrain", "Riskified", "Payoneer", "AppsFlyer", "JFrog", "Snyk", "Mobileye", "Elbit",
    "Rafael", "IBM", "Oracle", "Salesforce", "SAP", "Onezero", "Similarweb", "Gong",
    "Melio", "Rapyd", "Lemonade", "Tipalti", "Verbit", "Trax", "Hibob", "Papaya",
]

VOICE = "en-US-ChristopherNeural"
RATE = "-10%"
PITCH = "-8Hz"
FILTERS = "bass=g=5:f=110,aecho=0.85:0.75:70:0.22,loudnorm=I=-14:TP=-1.5"

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "public", "intro")


def slug(name: str) -> str:
    s = unicodedata.normalize("NFKD", name).lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


async def gen(name: str, tmp: str) -> str:
    text = f"Welcome, {name} team... to the portfolio of Yuval Boker."
    raw = os.path.join(tmp, f"{slug(name)}_raw.mp3")
    await edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH).save(raw)
    out = os.path.join(OUT_DIR, f"{slug(name)}.mp3")
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-af", FILTERS,
         "-codec:a", "libmp3lame", "-q:a", "3", out],
        check=True,
    )
    return out


async def main(names):
    os.makedirs(OUT_DIR, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        for n in names:
            out = await gen(n, tmp)
            print(f"  OK {n:<14} -> {os.path.relpath(out, ROOT)}")


if __name__ == "__main__":
    names = sys.argv[1:] or COMPANIES
    asyncio.run(main(names))
