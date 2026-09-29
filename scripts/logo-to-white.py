"""Turn a logo drawn over a solid block (light-on-dark or dark-on-light) into a white logo on transparency.

Usage: python3 scripts/logo-to-white.py <input.png> <output.png> [max-size]
Only needs the standard library (RGBA 8-bit PNGs). `max-size` downscales so the longest side fits.
"""
import struct
import sys
import zlib


def read_png(path):
    data = open(path, "rb").read()
    pos, idat = 8, b""
    while pos < len(data):
        (length,) = struct.unpack(">I", data[pos : pos + 4])
        kind, chunk = data[pos + 4 : pos + 8], data[pos + 8 : pos + 8 + length]
        if kind == b"IHDR":
            w, h, depth, color = struct.unpack(">IIBB", chunk[:10])
            assert depth == 8 and color == 6, "expected 8-bit RGBA"
        elif kind == b"IDAT":
            idat += chunk
        pos += 12 + length
    raw, bpp = zlib.decompress(idat), 4
    stride, rows, prev, i = w * bpp, [], bytearray(w * bpp), 0
    for _ in range(h):
        f = raw[i]
        i += 1
        line = bytearray(raw[i : i + stride])
        i += stride
        for x in range(stride):
            a = line[x - bpp] if x >= bpp else 0
            b = prev[x]
            c = prev[x - bpp] if x >= bpp else 0
            if f == 1:
                line[x] = (line[x] + a) & 255
            elif f == 2:
                line[x] = (line[x] + b) & 255
            elif f == 3:
                line[x] = (line[x] + (a + b) // 2) & 255
            elif f == 4:
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                line[x] = (line[x] + (a if pa <= pb and pa <= pc else b if pb <= pc else c)) & 255
        rows.append(line)
        prev = line
    return w, h, rows


def write_png(path, w, h, rows):
    def chunk(kind, body):
        return struct.pack(">I", len(body)) + kind + body + struct.pack(">I", zlib.crc32(kind + body))

    raw = b"".join(b"\x00" + bytes(r) for r in rows)
    png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0))
    png += chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b"")
    open(path, "wb").write(png)


def trim(w, h, rows, margin=0.04):
    """Crop to the visible ink plus a small margin."""
    ys = [y for y in range(h) if any(rows[y][x + 3] > 8 for x in range(0, w * 4, 4))]
    xs = [x for x in range(w) if any(rows[y][x * 4 + 3] > 8 for y in ys)]
    if not ys or not xs:
        return w, h, rows
    pad = round(max(xs[-1] - xs[0], ys[-1] - ys[0]) * margin)
    x0, x1 = max(0, xs[0] - pad), min(w, xs[-1] + 1 + pad)
    y0, y1 = max(0, ys[0] - pad), min(h, ys[-1] + 1 + pad)
    return x1 - x0, y1 - y0, [row[x0 * 4 : x1 * 4] for row in rows[y0:y1]]


def downscale(w, h, rows, max_size):
    """Box filter, integer factor only: good enough for flat logos."""
    f = -(-max(w, h) // max_size)
    if f <= 1:
        return w, h, rows
    nw, nh, out = w // f, h // f, []
    for y in range(nh):
        line = bytearray()
        for x in range(nw):
            total = sum(rows[y * f + j][(x * f + i) * 4 + 3] for j in range(f) for i in range(f))
            # Thin strokes lose weight when averaged; give some of it back
            line += bytes((255, 255, 255, min(255, round(total / (f * f) * 1.5))))
        out.append(line)
    return nw, nh, out


def main(src, dst, max_size=None):
    w, h, rows = read_png(src)
    lum = lambda r, g, b: 0.2126 * r + 0.7152 * g + 0.0722 * b
    # The background block is the most common opaque colour
    counts = {}
    for row in rows:
        for x in range(0, len(row), 4):
            if row[x + 3] == 255:
                key = tuple(row[x : x + 3])
                counts[key] = counts.get(key, 0) + 1
    bg = lum(*max(counts, key=counts.get))
    out = []
    for row in rows:
        line = bytearray()
        for x in range(0, len(row), 4):
            r, g, b, a = row[x : x + 4]
            # Ink is whatever departs from the background, towards the opposite end
            ink = (lum(r, g, b) - bg) / (255 - bg) if bg < 128 else (bg - lum(r, g, b)) / bg
            alpha = max(0.0, min(1.0, ink)) * (a / 255)
            line += bytes((255, 255, 255, round(alpha * 255)))
        out.append(line)
    w, h, out = trim(w, h, out)
    if max_size:
        w, h, out = downscale(w, h, out, max_size)
    write_png(dst, w, h, out)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else None)
