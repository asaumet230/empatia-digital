import { describe, expect, it } from "vitest";
import { SCHOOLS } from "@/lib/content/colegios";
import { detectImage } from "@/lib/galeria/imagen";

const bytes = (...values: number[]) => new Uint8Array([...values, ...new Array(16).fill(0)]);
const ascii = (text: string) => [...text].map((c) => c.charCodeAt(0));

describe("galería: qué cuenta como imagen", () => {
  it("reconoce PNG, JPEG y WEBP por sus primeros bytes", () => {
    expect(detectImage(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a))).toBe("png");
    expect(detectImage(bytes(0xff, 0xd8, 0xff, 0xe0))).toBe("jpeg");
    expect(detectImage(bytes(...ascii("RIFF"), 1, 2, 3, 4, ...ascii("WEBP")))).toBe("webp");
  });

  it("rechaza lo demás aunque se llame .png: SVG, GIF, PDF, un programa o un archivo vacío", () => {
    for (const fake of [
      ascii('<svg xmlns="http://www.w3.org/2000/svg">'),
      ascii("GIF89a"),
      ascii("%PDF-1.7"),
      [0x4d, 0x5a, 0x90, 0x00],
      ascii("RIFF\0\0\0\0WAVE"),
      [],
    ]) {
      expect(detectImage(new Uint8Array(fake))).toBeNull();
    }
  });
});

describe("galería: lista de colegios", () => {
  it("tiene los colegios públicos de Barranquilla, sin códigos ni nombres repetidos", () => {
    expect(SCHOOLS.length).toBeGreaterThan(100);
    expect(new Set(SCHOOLS.map((s) => s.dane)).size).toBe(SCHOOLS.length);
    expect(new Set(SCHOOLS.map((s) => s.name)).size).toBe(SCHOOLS.length);
  });

  it("los nombres sirven como carpeta de Drive", () => {
    for (const { name } of SCHOOLS) expect(name).toMatch(/^[\p{L}\d .]+$/u);
  });
});
