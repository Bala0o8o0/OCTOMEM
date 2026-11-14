import json

with open(r'd:\AI -MVP-DEVELOPMENTS\ChronoCard_AI\scripts\ascii_output.json', encoding='utf-8') as f:
    d = json.load(f)

print("NORMAL_LINES:", d['normal'].count('\n') + 1)
print("LIT_LINES:", d['lit'].count('\n') + 1)

# Write as a JS file we can directly import
normal_js = d['normal'].replace('`', r'\`').replace('${', r'\${')
lit_js    = d['lit'].replace('`', r'\`').replace('${', r'\${')

out = f"""// Auto-generated ASCII art from octomem-2nd.png
// Do not edit manually — regenerate with scripts/img_to_ascii.py

export const OCTOMEM_ASCII_NORMAL = `{normal_js}`;

export const OCTOMEM_ASCII_LIT = `{lit_js}`;
"""

with open(r'd:\AI -MVP-DEVELOPMENTS\ChronoCard_AI\src\components\site\octomemAscii.ts', 'w', encoding='utf-8') as f:
    f.write(out)

print("Written to octomemAscii.ts")
