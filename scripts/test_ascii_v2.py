import numpy as np
from PIL import Image

# Read image with alpha
img = Image.open(r'd:\AI -MVP-DEVELOPMENTS\ChronoCard_AI\public\assets\octomem-2nd.png')
r, g, b, a = img.split()

W = 58
# Monospace font aspect ratio in browser is ~0.5 (height is 2x width)
H = int(W * (img.height / img.width) * 0.46)

# Resize with high quality
small_a = a.resize((W, H), Image.LANCZOS)
gray = img.convert('L').resize((W, H), Image.LANCZOS)

arr_a = np.array(small_a, dtype=np.float32)
arr_g = np.array(gray, dtype=np.float32)

# Normalize
norm_a = arr_a / 255.0  # 0 outside, 1 inside octopus
norm_g = arr_g / 255.0  # internal brightness

# Character ramps
# We want Cline's aesthetic:
# Outside: space
# Soft edge: . or :
# Outer contour: - or + or =
# Body interior: S or $ or @ (dense, bright)
# Core chip/highlights: special accents or bright $

def render_ascii(char_mode="cline"):
    rows = []
    for y in range(H):
        line = ""
        for x in range(W):
            alpha = norm_a[y, x]
            g_val = norm_g[y, x]
            
            if alpha < 0.15:
                line += " "
            elif alpha < 0.35:
                line += "."
            elif alpha < 0.60:
                line += ":"
            elif alpha < 0.85:
                # Edge transition
                if g_val > 0.5:
                    line += "+"
                else:
                    line += "-"
            else:
                # Solid interior of octopus
                # Let's check if it's the center chip area
                cx = W / 2.0
                cy = H / 2.0
                dist_center = np.sqrt(((x - cx) * 1.0)**2 + ((y - cy) * 1.8)**2)
                
                # Internal texture
                if dist_center < 5.0:
                    # Very center chip
                    if g_val < 0.35:
                        line += "#"
                    elif g_val < 0.6:
                        line += "@"
                    else:
                        line += "$"
                else:
                    if g_val < 0.35:
                        line += ":"
                    elif g_val < 0.55:
                        line += "+"
                    elif g_val < 0.75:
                        line += "S"
                    else:
                        line += "$"
        rows.append(line.rstrip())

    # Trim leading/trailing empty rows
    while rows and not rows[0].strip(): rows.pop(0)
    while rows and not rows[-1].strip(): rows.pop()
    return "\n".join(rows)

ascii_cline = render_ascii()
print("=== CLINE STYLE OCTOPUS ===")
print(ascii_cline)
print("\nLines:", ascii_cline.count("\n") + 1, "MaxW:", max(len(l) for l in ascii_cline.splitlines()))
