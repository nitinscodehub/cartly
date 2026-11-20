"""Generate the Cartly portfolio cover image.

Usage: python3 scripts/generate_cover.py
Output: public/cartly-cover.png
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1200, 630
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


base = Image.new("RGB", (W, H), (246, 246, 243))

glow = Image.new("RGB", (W, H), (0, 0, 0))
glow_draw = ImageDraw.Draw(glow)
glow_draw.ellipse((640, -240, 1360, 520), fill=(12, 110, 100))
base = Image.blend(base, glow.filter(ImageFilter.GaussianBlur(150)), 0.32)

glow2 = Image.new("RGB", (W, H), (0, 0, 0))
glow2_draw = ImageDraw.Draw(glow2)
glow2_draw.ellipse((-200, 380, 520, 900), fill=(190, 90, 30))
base = Image.blend(base, glow2.filter(ImageFilter.GaussianBlur(160)), 0.18)

draw = ImageDraw.Draw(base)

# Brand
draw.rounded_rectangle((70, 76, 122, 128), radius=16, fill=(15, 118, 110))
draw.rounded_rectangle((84, 92, 108, 112), radius=4, outline=(255, 255, 255), width=3)
draw.line((84, 100, 108, 100), fill=(255, 255, 255), width=3)
draw.text((140, 86), "CARTLY", font=font(FONT_BOLD, 30), fill=(24, 25, 28))
draw.text((141, 126), "HEADLESS COMMERCE", font=font(FONT_REG, 14), fill=(115, 118, 125))

# Headline
draw.text((70, 208), "Storefronts", font=font(FONT_BOLD, 68), fill=(24, 25, 28))
draw.text((70, 292), "that convert.", font=font(FONT_BOLD, 68), fill=(15, 118, 110))

draw.text(
    (74, 408),
    "Product discovery, smart cart, discount codes and checkout.",
    font=font(FONT_REG, 23),
    fill=(90, 94, 102),
)

chips = [("Next.js 15", (15, 118, 110)), ("REST APIs", (37, 99, 235)), ("Demo checkout", (234, 88, 12))]
x = 74
for label, color in chips:
    width = draw.textbbox((0, 0), label, font=font(FONT_REG, 16))[2] + 30
    draw.rounded_rectangle((x, 478, x + width, 518), radius=12, outline=color, width=2)
    draw.text((x + 15, 487), label, font=font(FONT_REG, 16), fill=color)
    x += width + 14

# Product cards mockup
for index, (x0, y0, color) in enumerate(
    [(700, 120, (99, 102, 241)), (925, 120, (34, 211, 238)), (700, 350, (245, 158, 11)), (925, 350, (52, 211, 153))]
):
    draw.rounded_rectangle((x0, y0, x0 + 195, y0 + 200), radius=18, fill=(255, 255, 255), outline=(226, 226, 220), width=2)
    draw.rounded_rectangle((x0 + 14, y0 + 14, x0 + 181, y0 + 122), radius=12, fill=color)
    draw.rounded_rectangle((x0 + 18, y0 + 140, x0 + 130, y0 + 152), radius=6, fill=(226, 226, 220))
    draw.rounded_rectangle((x0 + 18, y0 + 162, x0 + 80, y0 + 174), radius=6, fill=(115, 118, 125))
    draw.rounded_rectangle((x0 + 137, y0 + 156, x0 + 181, y0 + 180), radius=8, fill=(15, 118, 110))

output = Path(__file__).resolve().parents[1] / "public" / "cartly-cover.png"
base.save(output, optimize=True)
print(f"Wrote {output}")
