"""Turn a logo drawn in light tones over a solid dark block into a white logo on transparency.

Usage: python3 scripts/logo-to-white.py <input.png> <output.png>
Only needs the standard library (RGBA 8-bit PNGs).
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


def main(src, dst):
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
            alpha = max(0.0, min(1.0, (lum(r, g, b) - bg) / (255 - bg))) * (a / 255)
            line += bytes((255, 255, 255, round(alpha * 255)))
        out.append(line)
    write_png(dst, w, h, out)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
