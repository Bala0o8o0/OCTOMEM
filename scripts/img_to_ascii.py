"""
Better ASCII conversion — wider output, cleaner char set, better contrast.
"""
from PIL import Image, ImageFilter, ImageEnhance
import json

IMG_PATH = r"d:\AI -MVP-DEVELOPMENTS\ChronoCard_AI\public\assets\octomem-2nd.png"
OUT_PATH = r"d:\AI -MVP-DEVELOPMENTS\ChronoCard_AI\scripts\ascii_output.json"

TARGET_W = 90        # wider = more detail
ASPECT   = 0.42      # monospace char h/w ratio

# Minimal clean char sets (space → dense)
# Use chars that render cleanly at small sizes in browser
CHARS_NORMAL = " .-:+*#@"
CHARS_LIT    = " .:-+*#@"

def to_ascii(img_path, width, chars):
    img = Image.open(img_path).convert("RGBA")
    bg  = Image.new("RGBA", img.size, (255, 255, 255, 255))
    img = Image.alpha_composite(bg, img).convert("L")

    # Boost contrast so the shape is crisper
    img = ImageEnhance.Contrast(img).enhance(1.8)
    img = img.filter(ImageFilter.SHARPEN)

    h = int(width * img.height / img.width * ASPECT)
    img = img.resize((width, h), Image.LANCZOS)

    n = len(chars) - 1
    rows = []
    for y in range(h):
        row = ""
        for x in range(width):
            brightness = img.getpixel((x, y))
            idx = int((255 - brightness) / 255 * n)
            row += chars[max(0, min(n, idx))]
        rows.append(row.rstrip())

    # Trim blank rows top + bottom
    while rows and not rows[0].strip():  rows.pop(0)
    while rows and not rows[-1].strip(): rows.pop()
    return "\n".join(rows)

normal = to_ascii(IMG_PATH, TARGET_W, CHARS_NORMAL)
lit    = to_ascii(IMG_PATH, TARGET_W, CHARS_LIT)

with open(OUT_PATH, "w", encoding="utf-8") as f:
    json.dump({"normal": normal, "lit": lit}, f, ensure_ascii=False)

print("=== PREVIEW ===")
print(normal)
print(f"\nLines: {normal.count(chr(10))+1}  MaxW: {max(len(l) for l in normal.splitlines())}")
