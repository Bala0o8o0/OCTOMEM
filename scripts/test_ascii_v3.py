import numpy as np
from PIL import Image

img = Image.open(r'd:\AI -MVP-DEVELOPMENTS\ChronoCard_AI\public\assets\octomem-2nd.png')
r, g, b, a = img.split()

W = 54
H = int(W * (img.height / img.width) * 0.46)

small_a = a.resize((W, H), Image.LANCZOS)
gray = img.convert('L').resize((W, H), Image.LANCZOS)

norm_a = np.array(small_a, dtype=np.float32) / 255.0
norm_g = np.array(gray, dtype=np.float32) / 255.0

# Create Cline-style filled ASCII:
# Body is solid $$ / SS, edges are + and :
# Center core has chip detail
cx = W / 2.0
cy = H / 2.0

def make_art(is_lit=False):
    rows = []
    for y in range(H):
        line = ""
        for x in range(W):
            alpha = norm_a[y, x]
            g_val = norm_g[y, x]
            
            dist = np.sqrt(((x - cx) * 1.0)**2 + ((y - cy) * 1.8)**2)
            
            if alpha < 0.12:
                line += " "
            elif alpha < 0.28:
                line += "."
            elif alpha < 0.45:
                line += ":"
            elif alpha < 0.65:
                line += "+"
            else:
                # Solid interior
                if dist < 6.5:
                    # Central Chip
                    if dist < 2.5:
                        line += "#" if is_lit else "@"
                    elif dist < 4.5:
                        line += "$" if is_lit else "S"
                    else:
                        line += "=" if is_lit else "+"
                else:
                    # Tentacles & Armor
                    if is_lit:
                        line += "$" if g_val > 0.35 else "S"
                    else:
                        if g_val > 0.65:
                            line += "$"
                        elif g_val > 0.4:
                            line += "S"
                        else:
                            line += "+"
        rows.append(line.rstrip())

    while rows and not rows[0].strip(): rows.pop(0)
    while rows and not rows[-1].strip(): rows.pop()
    return "\n".join(rows)

normal = make_art(is_lit=False)
lit = make_art(is_lit=True)

print("=== NORMAL ART ===")
print(normal)
print("\nLines:", normal.count("\n") + 1, "MaxW:", max(len(l) for l in normal.splitlines()))

print("\n=== LIT ART ===")
print(lit)
