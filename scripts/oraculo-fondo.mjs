/**
 * Builds the Oráculo chat background: a seamless tile of faint line doodles, like a messaging
 * app wallpaper, from lucide icons (ISC licence, already a dependency). The tile is used as a CSS
 * mask, so its colour comes from the theme. Run: node scripts/oraculo-fondo.mjs
 */
import { writeFileSync } from "node:fs";

const ICONS = [
  "heart", "message-circle", "book-open", "school", "star", "sun", "music", "leaf", "face-slightly-smiling",
  "sparkles", "pencil", "moon", "cloud", "users", "handshake", "puzzle", "palette", "bike",
  "volleyball", "backpack", "hand-heart", "graduation-cap", "send", "flower-2", "rainbow",
];
const TILE = 400;
const GRID = 8;
const CELL = TILE / GRID;

// Small deterministic generator, so the tile is the same on every run
let seed = 7;
const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

const attrs = (props) =>
  Object.entries(props)
    .filter(([key]) => key !== "key")
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

// Every icon about twice per tile, in a shuffled order so the repeat is hard to spot
const order = Array.from({ length: GRID * GRID }, (_, i) => ICONS[i % ICONS.length]);
for (let i = order.length - 1; i > 0; i--) {
  const j = Math.floor(random() * (i + 1));
  [order[i], order[j]] = [order[j], order[i]];
}

const shapes = [];
for (let i = 0; i < GRID * GRID; i++) {
  const name = order[i];
  const { __iconData } = await import(`../node_modules/lucide-react/dist/esm/icons/${name}.mjs`);
  const inner = __iconData.node.map(([tag, props]) => `<${tag} ${attrs(props)}/>`).join("");
  // Jitter inside the cell, never close enough to the edge to be cut by the repeat
  const scale = 0.85 + random() * 0.35;
  const x = (i % GRID) * CELL + CELL / 2 + (random() - 0.5) * 16;
  const y = Math.floor(i / GRID) * CELL + CELL / 2 + (random() - 0.5) * 16;
  const angle = Math.round((random() - 0.5) * 50);
  shapes.push(
    `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle}) scale(${scale.toFixed(2)}) translate(-12 -12)">${inner}</g>`,
  );
}

// Tiny dots and crosses between the drawings fill the gaps, as in a chat wallpaper
for (let row = 1; row < GRID; row++) {
  for (let col = 1; col < GRID; col++) {
    if (random() < 0.45) continue;
    const x = col * CELL;
    const y = row * CELL;
    shapes.push(
      random() < 0.5
        ? `<circle cx="${x}" cy="${y}" r="1.6"/>`
        : `<path d="M${x - 3} ${y}h6M${x} ${y - 3}v6"/>`,
    );
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE}" height="${TILE}" viewBox="0 0 ${TILE} ${TILE}" fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${shapes.join("")}</svg>\n`;
writeFileSync(new URL("../public/assets/images/oraculo-fondo.svg", import.meta.url), svg);
console.log(`oraculo-fondo.svg: ${shapes.length} trazos, ${svg.length} bytes`);
