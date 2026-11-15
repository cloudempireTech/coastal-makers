import os
from PIL import Image, ImageDraw, ImageFont

DEST_DIR = r"C:\Users\dasan\.gemini\antigravity\scratch\coastal-makers\assets\images"
os.makedirs(DEST_DIR, exist_ok=True)

# 1. logo.svg
logo_svg = """<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="darkBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#082f49" />
      <stop offset="100%" stop-color="#02131d" />
    </linearGradient>
  </defs>

  <!-- Outer Rounded Crest -->
  <rect x="25" y="25" width="450" height="450" rx="90" fill="url(#darkBg)" stroke="url(#oceanGrad)" stroke-width="4" />
  <rect x="42" y="42" width="416" height="416" rx="76" fill="none" stroke="rgba(56, 189, 248, 0.25)" stroke-width="1.5" stroke-dasharray="6,4" />

  <!-- 3D Layering Wave Motif / Isometric Hexagon -->
  <polygon points="250,110 330,155 330,245 250,290 170,245 170,155" fill="none" stroke="url(#oceanGrad)" stroke-width="5" />
  <polyline points="170,155 250,200 330,155" fill="none" stroke="url(#oceanGrad)" stroke-width="4" />
  <line x1="250" y1="200" x2="250" y2="290" stroke="url(#oceanGrad)" stroke-width="4" />

  <!-- Wave Layering Lines Inside -->
  <path d="M 195 210 Q 250 235 305 210" fill="none" stroke="#38bdf8" stroke-width="3" />
  <path d="M 205 235 Q 250 260 295 235" fill="none" stroke="#ffffff" stroke-width="2.5" />

  <!-- Typography -->
  <text x="250" y="345" text-anchor="middle" font-family="'Plus Jakarta Sans', -apple-system, sans-serif" font-size="28" font-weight="800" fill="#ffffff" letter-spacing="4">COASTAL MAKERS</text>
  <text x="250" y="380" text-anchor="middle" font-family="'Plus Jakarta Sans', -apple-system, sans-serif" font-size="13" font-weight="700" fill="#38bdf8" letter-spacing="6">CUSTOM 3D PRINTING &#8226; DÉCOR</text>
  <text x="250" y="412" text-anchor="middle" font-family="'Plus Jakarta Sans', -apple-system, sans-serif" font-size="11" font-weight="500" fill="rgba(255, 255, 255, 0.7)" letter-spacing="3">SYDNEY, NSW &#8226; ADDITIVE CRAFT</text>
</svg>
"""

with open(os.path.join(DEST_DIR, "logo.svg"), "w", encoding="utf-8") as f:
    f.write(logo_svg)

# 2. favicon.svg
fav_svg = """<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <linearGradient id="og" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="28" fill="#082f49" stroke="url(#og)" stroke-width="4" />
  <text x="50" y="66" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="44" font-weight="900" fill="url(#og)">CM</text>
</svg>
"""

with open(os.path.join(DEST_DIR, "favicon.svg"), "w", encoding="utf-8") as f:
    f.write(fav_svg)

# 3. Raster logo.png (512x512)
img = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)
draw.rounded_rectangle([16, 16, 496, 496], radius=90, fill=(8, 47, 73, 255), outline=(6, 182, 212, 255), width=6)
draw.rounded_rectangle([32, 32, 480, 480], radius=76, fill=None, outline=(56, 189, 248, 90), width=2)

try:
    font_large = ImageFont.truetype("arialbd.ttf", 34)
    font_sub = ImageFont.truetype("arialbd.ttf", 15)
    font_loc = ImageFont.truetype("arial.ttf", 12)
    font_m = ImageFont.truetype("arialbd.ttf", 95)
except Exception:
    font_large = ImageFont.load_default()
    font_sub = font_large
    font_loc = font_large
    font_m = font_large

draw.text((256, 195), "CM", fill=(56, 189, 248, 255), font=font_m, anchor="mm")
draw.line([(140, 275), (372, 275)], fill=(6, 182, 212, 255), width=3)
draw.text((256, 335), "COASTAL MAKERS", fill=(255, 255, 255, 255), font=font_large, anchor="mm")
draw.text((256, 375), "CUSTOM 3D PRINTING • DÉCOR", fill=(56, 189, 248, 255), font=font_sub, anchor="mm")
draw.text((256, 408), "SYDNEY, NSW • ADDITIVE CRAFT", fill=(186, 230, 253, 255), font=font_loc, anchor="mm")

img.save(os.path.join(DEST_DIR, "logo.png"), "PNG")
print("Saved logo.png")

# 4. Multi-res favicon suite
img_fav = Image.new("RGBA", (180, 180), (0, 0, 0, 0))
draw_fav = ImageDraw.Draw(img_fav)
draw_fav.rounded_rectangle([6, 6, 174, 174], radius=44, fill=(8, 47, 73, 255), outline=(6, 182, 212, 255), width=6)
try:
    font_f = ImageFont.truetype("arialbd.ttf", 72)
except Exception:
    font_f = ImageFont.load_default()
draw_fav.text((90, 95), "CM", fill=(56, 189, 248, 255), font=font_f, anchor="mm")

img_fav.save(os.path.join(DEST_DIR, "apple-touch-icon.png"), "PNG")
fav32 = img_fav.resize((32, 32), Image.LANCZOS)
fav32.save(os.path.join(DEST_DIR, "favicon-32x32.png"), "PNG")
fav32.save(os.path.join(DEST_DIR, "favicon.ico"), format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
print("Saved favicon suite!")

# 5. Build high quality compressed showcase & service images (1200x800, quality 82)
items = [
    ("decor-parametric-lamp.jpg", "Parametric Voronoi Wave Ambient Lamp", "Warm Glow Diffuser with Organic Ocean Ridge Ribbing", (8, 47, 73), (56, 189, 248)),
    ("decor-topographic-map.jpg", "Sydney Coastal Topographic Relief Map", "Multi-Color Layered Elevation Wall Art", (12, 58, 88), (6, 182, 212)),
    ("decor-lithophane-art.jpg", "Curved Backlit Memory Lithophane Display", "High-Resolution Photo Carved in Translucent Bio-Polymer", (15, 65, 98), (56, 189, 248)),
    ("decor-geometric-planters.jpg", "Architectural Faceted Eco-Planters", "Self-Watering Modular Planters in Terracotta PLA", (10, 50, 78), (14, 165, 233)),
    ("workshop-additive-farm.jpg", "High-Speed Multi-Nozzle 3D Print Farm", "Rapid Prototyping & Small-Batch Production in Sydney", (6, 38, 60), (6, 182, 212)),
    ("materials-eco-polymers.jpg", "Sustainable Engineering & Eco Bio-Polymers", "Corn-Based Silk PLA • Recycled PETG • Wood Composite", (14, 62, 94), (56, 189, 248))
]

for filename, title, subtitle, bg_col, accent_col in items:
    card_img = Image.new("RGB", (1200, 800), bg_col)
    c_draw = ImageDraw.Draw(card_img)

    for r in range(400, 0, -12):
        c_draw.ellipse([600 - r, 400 - r, 600 + r, 400 + r], outline=(accent_col[0], accent_col[1], accent_col[2]), width=4)

    c_draw.rounded_rectangle([30, 30, 1170, 770], radius=24, outline=accent_col, width=3)
    c_draw.rounded_rectangle([44, 44, 1156, 756], radius=18, outline=(255, 255, 255), width=1)

    try:
        t_font = ImageFont.truetype("arialbd.ttf", 40)
        s_font = ImageFont.truetype("arial.ttf", 22)
        b_font = ImageFont.truetype("arialbd.ttf", 18)
    except Exception:
        t_font = ImageFont.load_default()
        s_font = t_font
        b_font = t_font

    c_draw.text((600, 330), "COASTAL MAKERS SYDNEY", fill=accent_col, font=b_font, anchor="mm")
    c_draw.text((600, 400), title, fill=(255, 255, 255), font=t_font, anchor="mm")
    c_draw.text((600, 460), subtitle, fill=(224, 242, 254), font=s_font, anchor="mm")
    c_draw.text((600, 520), "PRECISION ADDITIVE FABRICATION • SYDNEY NSW", fill=(186, 230, 253), font=b_font, anchor="mm")

    out_p = os.path.join(DEST_DIR, filename)
    card_img.save(out_p, "JPEG", quality=82, optimize=True, progressive=True)
    print(f"Generated {filename}")

print("All Coastal Makers assets built successfully!")
