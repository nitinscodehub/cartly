"""Generate abstract product artwork for the Cartly demo catalog.

Usage: python3 scripts/generate_images.py
Output: public/products/*.png
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

W = H = 600
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

PRODUCTS = [
    ("aura", "#6366f1", "#312e81", "AUDIO"),
    ("pulse", "#22d3ee", "#0e7490", "WEARABLES"),
    ("nova", "#f59e0b", "#b45309", "WORKSPACE"),
    ("luma", "#fbbf24", "#92400e", "WORKSPACE"),
    ("drift", "#34d399", "#065f46", "AUDIO"),
    ("vertex", "#94a3b8", "#1e293b", "CAMERAS"),
    ("halo", "#f472b6", "#9d174d", "WEARABLES"),
    ("atlas", "#a78bfa", "#5b21b6", "WORKSPACE"),
    ("ember", "#fb7185", "#9f1239", "LIFESTYLE"),
    ("orbit", "#38bdf8", "#0369a1", "AUDIO"),
    ("slate", "#a3a3a3", "#404040", "LIFESTYLE"),
    ("frame", "#818cf8", "#3730a3", "CAMERAS"),
]


def rgb(value: str) -> tuple[int, int, int]:
    return tuple(int(value[i : i + 2], 16) for i in (1, 3, 5))


def draw_shape(layer: ImageDraw.ImageDraw, kind: str) -> None:
    white = (255, 255, 255, 220)
    soft = (255, 255, 255, 90)
    if kind == "AUDIO":
        layer.ellipse((150, 140, 450, 440), outline=white, width=26)
        layer.ellipse((215, 205, 385, 375), outline=soft, width=12)
        layer.rounded_rectangle((132, 350, 178, 470), radius=20, fill=white)
        layer.rounded_rectangle((422, 350, 468, 470), radius=20, fill=white)
    elif kind == "WEARABLES":
        layer.rounded_rectangle((205, 130, 395, 470), radius=70, outline=white, width=26)
        layer.line((205, 220, 395, 220), fill=soft, width=10)
        layer.ellipse((265, 285, 335, 355), outline=white, width=12)
    elif kind == "WORKSPACE":
        layer.rounded_rectangle((110, 210, 490, 410), radius=34, outline=white, width=22)
        for row in range(3):
            for col in range(7):
                x, y = 145 + col * 48, 250 + row * 50
                layer.rounded_rectangle((x, y, x + 30, y + 30), radius=8, fill=soft)
    elif kind == "CAMERAS":
        layer.rounded_rectangle((130, 190, 470, 430), radius=34, outline=white, width=22)
        layer.ellipse((235, 235, 375, 375), outline=white, width=24)
        layer.ellipse((285, 285, 325, 325), fill=white)
        layer.rounded_rectangle((300, 165, 390, 195), radius=12, fill=soft)
    else:
        layer.rounded_rectangle((190, 180, 410, 450), radius=45, outline=white, width=24)
        layer.arc((190, 130, 410, 290), start=180, end=360, fill=white, width=18)
        layer.line((225, 350, 375, 350), fill=soft, width=12)


out_dir = Path(__file__).resolve().parents[1] / "public" / "products"
out_dir.mkdir(parents=True, exist_ok=True)

font = ImageFont.truetype(FONT, 22)

for slug, start, end, kind in PRODUCTS:
    c1, c2 = rgb(start), rgb(end)
    image = Image.new("RGB", (W, H))
    pixels = ImageDraw.Draw(image)
    for y in range(H):
        t = y / H
        pixels.line(
            (0, y, W, y),
            fill=tuple(int(c1[i] * (1 - t) + c2[i] * t) for i in range(3)),
        )

    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse((60, 40, 540, 520), fill=(255, 255, 255, 28))
    image = Image.alpha_composite(image.convert("RGBA"), glow.filter(ImageFilter.GaussianBlur(60)))

    shape = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw_shape(ImageDraw.Draw(shape), kind)
    image = Image.alpha_composite(image, shape)

    draw = ImageDraw.Draw(image)
    draw.text((30, 540), kind, font=font, fill=(255, 255, 255, 210))
    image.convert("RGB").save(out_dir / f"{slug}.png", optimize=True)

print(f"Wrote {len(PRODUCTS)} images to {out_dir}")
