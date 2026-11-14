from PIL import Image, ImageFilter
import numpy as np

img = Image.open(r'd:\AI -MVP-DEVELOPMENTS\ChronoCard_AI\public\assets\octomem-2nd.png')
r, g, b, a = img.split()

# Target width ~56 chars for a clean, tight, punchy ASCII emblem like Cline
W = 56
H = int(W * (img.height / img.width) * 0.48)

# Resize alpha and grayscale
img_gray = img.convert('L')

small_a = a.resize((W, H), Image.LANCZOS)
small_g = img_gray.resize((W, H), Image.LANCZOS)

arr_a = np.array(small_a)
arr_g = np.array(small_g)

# Let's inspect character choices
# Cline uses: spaces, dots, colons, plus, and dollar signs $ S for body
chars_normal = " .:-=+*#%@$"
# Or Cline style:
# Edges: . : + =
# Solid: S $ @ #

rows = []
for y in range(H):
    line = ""
    for x in range(W):
        alpha = arr_a[y, x]
        gray = arr_g[y, x]
        if alpha < 35:
            line += " "
        elif alpha < 110:
            line += "."
        elif alpha < 180:
            line += ":"
        else:
            # Inside the octopus:
            # We want the solid body to be bright and filled!
            # The original image has dark outlines and lighter metal panels.
            # In dark-mode ASCII, filled areas should be dense characters like $, S, @, #
            # Let's map brightness:
            if gray < 50:
                line += ":"
            elif gray < 100:
                line += "+"
            elif gray < 160:
                line += "="
            elif gray < 210:
                line += "S"
            else:
                line += "$"
    rows.append(line.rstrip())

# Trim top and bottom
while rows and not rows[0].strip(): rows.pop(0)
while rows and not rows[-1].strip(): rows.pop()

ascii_art = "\n".join(rows)
print("=== VERSION 1 ===")
print(ascii_art)
print("Lines:", len(rows), "MaxW:", max(len(r) for r in rows))
