/**
 * Generates the brand placeholder artwork in /public/images.
 *
 * These are deliberately illustrative rather than photographic: they keep the
 * site self-contained (no remote image hosts, nothing to break offline) and
 * read as intentional brand art. Replace them with real photography before
 * launch — see the "Replacing the artwork" section of the README.
 *
 * Run: npm run art
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "images");

const PALETTE = {
  teal900: "#0F3F44",
  teal700: "#1A5A63",
  teal500: "#2E7A82",
  teal300: "#7FB0B1",
  teal50: "#EAF2F1",
  orange: "#E86E2B",
  orangeSoft: "#F4BF9F",
  gold: "#C8972F",
  cream: "#F7F4EE",
  sand: "#E8D9BE",
  fur: "#D9A867",
  furDark: "#B8853F",
  grey: "#9AA7AC",
  white: "#FFFFFF",
};

/* ------------------------------------------------------------- primitives */

const pawPath =
  "M50 46c12 0 22 8.5 22 17.8 0 7.3-6.3 11.6-14 11.6-3.1 0-5.4-.8-8-.8s-4.9.8-8 .8c-7.7 0-14-4.3-14-11.6C28 54.5 38 46 50 46Z";

function paw(x, y, scale, fill, opacity = 1, rotate = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rotate}) scale(${scale})" fill="${fill}" opacity="${opacity}">
    <ellipse cx="30" cy="32" rx="9.5" ry="12.5" transform="rotate(-18 30 32)"/>
    <ellipse cx="50" cy="24" rx="9.5" ry="13" />
    <ellipse cx="70" cy="32" rx="9.5" ry="12.5" transform="rotate(18 70 32)"/>
    <path d="${pawPath}"/>
  </g>`;
}

/** Scattered paw-print texture, deterministic from a seed. */
function pawField(width, height, fill, opacity, count = 14, seed = 1) {
  let value = seed * 9301;
  const next = () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
  return Array.from({ length: count }, () => {
    const x = next() * width;
    const y = next() * height;
    const scale = 0.1 + next() * 0.14;
    const rotate = next() * 360;
    return paw(x, y, scale, fill, opacity, rotate);
  }).join("");
}

function dogHead(cx, cy, size, coat, coatDark, snout) {
  const s = size / 100;
  return `<g transform="translate(${cx} ${cy}) scale(${s}) translate(-50 -50)">
    <path d="M18 30c-6-10-4-21 3-22 6-1 12 6 14 13Z" fill="${coatDark}"/>
    <path d="M82 30c6-10 4-21-3-22-6-1-12 6-14 13Z" fill="${coatDark}"/>
    <path d="M50 14c17 0 29 12 29 29 0 20-13 36-29 36S21 63 21 43c0-17 12-29 29-29Z" fill="${coat}"/>
    <ellipse cx="50" cy="60" rx="15" ry="12" fill="${snout}"/>
    <ellipse cx="50" cy="52" rx="5.5" ry="4.2" fill="${PALETTE.teal900}"/>
    <path d="M50 56v5m0 0c0 3-3 4.5-5.5 3.5M50 61c0 3 3 4.5 5.5 3.5" stroke="${PALETTE.teal900}" stroke-width="2" stroke-linecap="round" fill="none"/>
    <ellipse cx="38" cy="39" rx="4" ry="4.6" fill="${PALETTE.teal900}"/>
    <ellipse cx="62" cy="39" rx="4" ry="4.6" fill="${PALETTE.teal900}"/>
    <circle cx="39.4" cy="37.4" r="1.4" fill="${PALETTE.white}"/>
    <circle cx="63.4" cy="37.4" r="1.4" fill="${PALETTE.white}"/>
  </g>`;
}

function catHead(cx, cy, size, coat, coatDark, snout) {
  const s = size / 100;
  return `<g transform="translate(${cx} ${cy}) scale(${s}) translate(-50 -50)">
    <path d="M24 34 22 12l19 11Z" fill="${coat}"/>
    <path d="M76 34 78 12 59 23Z" fill="${coat}"/>
    <path d="M27 31 26 19l10 6Z" fill="${coatDark}"/>
    <path d="M73 31 74 19l-10 6Z" fill="${coatDark}"/>
    <path d="M50 20c16 0 28 12 28 27s-12 28-28 28-28-13-28-28 12-27 28-27Z" fill="${coat}"/>
    <ellipse cx="50" cy="58" rx="12" ry="9" fill="${snout}"/>
    <path d="M50 50.5 46 55h8Z" fill="${PALETTE.teal900}"/>
    <path d="M50 55v4m0 0c0 2.6-2.8 4-5 3M50 59c0 2.6 2.8 4 5 3" stroke="${PALETTE.teal900}" stroke-width="1.8" stroke-linecap="round" fill="none"/>
    <ellipse cx="38" cy="42" rx="4.6" ry="5.4" fill="${PALETTE.teal900}"/>
    <ellipse cx="62" cy="42" rx="4.6" ry="5.4" fill="${PALETTE.teal900}"/>
    <circle cx="39.6" cy="40.2" r="1.5" fill="${PALETTE.white}"/>
    <circle cx="63.6" cy="40.2" r="1.5" fill="${PALETTE.white}"/>
    <path d="M30 56h-12M30 60h-11M70 56h12M70 60h11" stroke="${PALETTE.white}" stroke-width="1.4" stroke-linecap="round" opacity="0.75"/>
  </g>`;
}

function rabbitHead(cx, cy, size, coat, coatDark, snout) {
  const s = size / 100;
  return `<g transform="translate(${cx} ${cy}) scale(${s}) translate(-50 -50)">
    <ellipse cx="36" cy="18" rx="8" ry="22" transform="rotate(-10 36 18)" fill="${coat}"/>
    <ellipse cx="64" cy="18" rx="8" ry="22" transform="rotate(10 64 18)" fill="${coat}"/>
    <ellipse cx="36" cy="19" rx="4" ry="16" transform="rotate(-10 36 19)" fill="${snout}"/>
    <ellipse cx="64" cy="19" rx="4" ry="16" transform="rotate(10 64 19)" fill="${snout}"/>
    <ellipse cx="50" cy="55" rx="27" ry="25" fill="${coat}"/>
    <ellipse cx="50" cy="64" rx="12" ry="9" fill="${snout}"/>
    <path d="M50 58.5 46.5 62h7Z" fill="${PALETTE.teal900}"/>
    <path d="M50 62v3.5m0 0c0 2.4-2.6 3.6-4.6 2.7M50 65.5c0 2.4 2.6 3.6 4.6 2.7" stroke="${PALETTE.teal900}" stroke-width="1.7" stroke-linecap="round" fill="none"/>
    <ellipse cx="39" cy="50" rx="4.2" ry="5" fill="${PALETTE.teal900}"/>
    <ellipse cx="61" cy="50" rx="4.2" ry="5" fill="${PALETTE.teal900}"/>
    <circle cx="40.4" cy="48.3" r="1.4" fill="${PALETTE.white}"/>
    <circle cx="62.4" cy="48.3" r="1.4" fill="${PALETTE.white}"/>
    <path d="M31 62h-11M31 66h-10M69 62h11M69 66h10" stroke="${coatDark}" stroke-width="1.3" stroke-linecap="round" opacity="0.8"/>
  </g>`;
}

function birdHead(cx, cy, size, coat, coatDark, beak) {
  const s = size / 100;
  return `<g transform="translate(${cx} ${cy}) scale(${s}) translate(-50 -50)">
    <path d="M50 16c5 0 9 3 10 7-6-2-14-2-20 0 1-4 5-7 10-7Z" fill="${coatDark}"/>
    <ellipse cx="50" cy="48" rx="28" ry="30" fill="${coat}"/>
    <path d="M26 54c-6 8-6 18 2 24 4-10 10-18 16-22Z" fill="${coatDark}"/>
    <path d="M50 54c6 0 11 4 11 9s-5 10-11 10-11-5-11-10 5-9 11-9Z" fill="${coatDark}" opacity="0.35"/>
    <path d="M50 50 62 58 50 66Z" fill="${beak}"/>
    <path d="M50 58h-3" stroke="${PALETTE.teal900}" stroke-width="1.4" stroke-linecap="round" opacity="0.5"/>
    <circle cx="40" cy="42" r="6" fill="${PALETTE.white}" opacity="0.5"/>
    <circle cx="40" cy="42" r="4.4" fill="${PALETTE.teal900}"/>
    <circle cx="41.6" cy="40.4" r="1.5" fill="${PALETTE.white}"/>
  </g>`;
}

function smallPetHead(cx, cy, size, coat, coatDark, snout) {
  const s = size / 100;
  return `<g transform="translate(${cx} ${cy}) scale(${s}) translate(-50 -50)">
    <circle cx="27" cy="30" r="12" fill="${coat}"/>
    <circle cx="73" cy="30" r="12" fill="${coat}"/>
    <circle cx="27" cy="30" r="7" fill="${snout}"/>
    <circle cx="73" cy="30" r="7" fill="${snout}"/>
    <ellipse cx="50" cy="52" rx="30" ry="27" fill="${coat}"/>
    <path d="M50 25c10 0 18 6 22 15-6-4-14-6-22-6s-16 2-22 6c4-9 12-15 22-15Z" fill="${coatDark}" opacity="0.5"/>
    <ellipse cx="50" cy="62" rx="13" ry="10" fill="${snout}"/>
    <ellipse cx="50" cy="56.5" rx="3.6" ry="2.8" fill="${PALETTE.teal900}"/>
    <path d="M50 59v3.5m0 0c0 2.4-2.6 3.6-4.6 2.7M50 62.5c0 2.4 2.6 3.6 4.6 2.7" stroke="${PALETTE.teal900}" stroke-width="1.7" stroke-linecap="round" fill="none"/>
    <ellipse cx="38" cy="47" rx="4.2" ry="4.8" fill="${PALETTE.teal900}"/>
    <ellipse cx="62" cy="47" rx="4.2" ry="4.8" fill="${PALETTE.teal900}"/>
    <circle cx="39.4" cy="45.4" r="1.4" fill="${PALETTE.white}"/>
    <circle cx="63.4" cy="45.4" r="1.4" fill="${PALETTE.white}"/>
    <path d="M46 68h8" stroke="${PALETTE.white}" stroke-width="2.2" stroke-linecap="round" opacity="0.85"/>
  </g>`;
}

function svg(width, height, body, extraDefs = "") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img">
<defs>${extraDefs}</defs>
${body}
</svg>`;
}

function linearGradient(id, from, to, angle = "0 0 0 1") {
  const [x1, y1, x2, y2] = angle.split(" ");
  return `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient>`;
}

/* ----------------------------------------------------------------- scenes */

function heroScene() {
  const W = 880;
  const H = 760;
  const defs =
    linearGradient("sky", "#2E7A82", "#0F3F44", "0 0 0.6 1") +
    // Radial glows rather than flat translucent circles: a semi-transparent
    // warm fill over teal reads as grey mud, a soft falloff reads as light.
    `<radialGradient id="sun"><stop offset="0" stop-color="${PALETTE.orangeSoft}" stop-opacity="0.55"/><stop offset="0.6" stop-color="${PALETTE.gold}" stop-opacity="0.14"/><stop offset="1" stop-color="${PALETTE.gold}" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="haze"><stop offset="0" stop-color="${PALETTE.teal300}" stop-opacity="0.38"/><stop offset="1" stop-color="${PALETTE.teal300}" stop-opacity="0"/></radialGradient>`;
  const body = `
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <circle cx="665" cy="168" r="185" fill="url(#sun)"/>
  <circle cx="175" cy="600" r="250" fill="url(#haze)"/>
  ${pawField(W, H, PALETTE.white, 0.06, 18, 7)}
  <ellipse cx="440" cy="690" rx="300" ry="46" fill="${PALETTE.teal900}" opacity="0.3"/>
  <!-- pet parent, abstracted -->
  <g>
    <path d="M318 700c0-108 42-176 112-176s112 68 112 176Z" fill="${PALETTE.teal50}" opacity="0.92"/>
    <circle cx="430" cy="470" r="74" fill="${PALETTE.sand}"/>
    <path d="M430 396c42 0 70 28 70 66 0 10-3 18-3 18-6-28-30-42-67-42s-61 14-67 42c0 0-3-8-3-18 0-38 28-66 70-66Z" fill="${PALETTE.furDark}"/>
    <circle cx="408" cy="468" r="5" fill="${PALETTE.teal900}"/>
    <circle cx="452" cy="468" r="5" fill="${PALETTE.teal900}"/>
    <path d="M414 492c5 7 11 10 16 10s11-3 16-10" stroke="${PALETTE.teal900}" stroke-width="4.5" stroke-linecap="round" fill="none"/>
  </g>
  ${dogHead(596, 530, 250, PALETTE.fur, PALETTE.furDark, PALETTE.sand)}
  <path d="M470 612c40-22 92-22 132 0" stroke="${PALETTE.teal50}" stroke-width="16" stroke-linecap="round" fill="none" opacity="0.9"/>
  ${paw(96, 120, 0.9, PALETTE.white, 0.22, -12)}
  ${paw(740, 560, 0.7, PALETTE.white, 0.18, 22)}
  <g transform="translate(150 200) scale(0.85)" fill="${PALETTE.orange}" opacity="0.75">
    <path d="M50 86C50 86 8 58 8 32 8 17 19 7 32 7c8 0 15 4 18 11 3-7 10-11 18-11 13 0 24 10 24 25 0 26-42 54-42 54Z"/>
  </g>`;
  return svg(W, H, body, defs);
}

/**
 * Wide homepage hero: a warm living room with a dog and cat on a couch.
 *
 * Composed so the left ~45% stays near-flat cream — the headline sits there and
 * needs even contrast — while the scene itself fills the right. The component
 * lays a cream-to-transparent gradient over the top as a second safeguard.
 */
function heroHomeScene() {
  const W = 1600;
  const H = 950;
  const defs =
    linearGradient("wall", "#F2E7D6", "#E3D2BA", "0 0 0.3 1") +
    linearGradient("couch", "#F3EADC", "#DFCFB6", "0 0 0 1") +
    linearGradient("cushion", "#D8E2DD", "#B3C7C1", "0 0 0.4 1") +
    linearGradient("floor", "#E8D9BE", "#CDB894", "0 0 0 1") +
    `<radialGradient id="window"><stop offset="0" stop-color="#FFF8EC" stop-opacity="0.95"/><stop offset="0.55" stop-color="#FDEFD8" stop-opacity="0.45"/><stop offset="1" stop-color="#FDEFD8" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="warm"><stop offset="0" stop-color="${PALETTE.gold}" stop-opacity="0.22"/><stop offset="1" stop-color="${PALETTE.gold}" stop-opacity="0"/></radialGradient>` +
    `<linearGradient id="calm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${PALETTE.cream}" stop-opacity="0.72"/><stop offset="0.3" stop-color="${PALETTE.cream}" stop-opacity="0.52"/><stop offset="0.62" stop-color="${PALETTE.cream}" stop-opacity="0"/></linearGradient>`;

  /** A leafy houseplant — repeated at two sizes to frame the scene. */
  const plant = (x, y, scale, flip = false) => `
  <g transform="translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})">
    <path d="M0 0c-4-46-30-74-62-84 34-4 58 12 66 44Z" fill="#4E7A5E"/>
    <path d="M0 0c6-44 34-68 68-74-32-10-60 6-72 38Z" fill="#3E6A4E"/>
    <path d="M0 0c-30-34-28-72-8-100-26 18-34 56-16 92Z" fill="#59896A"/>
    <path d="M0 0c26-30 64-32 92-18-22-24-62-24-88 4Z" fill="#456F55"/>
    <path d="M-6 0h12l-4 46h-4Z" fill="#8A6A47"/>
  </g>`;

  const body = `
  <rect width="${W}" height="${H}" fill="url(#wall)"/>
  <circle cx="1180" cy="120" r="420" fill="url(#window)"/>
  <circle cx="900" cy="700" r="520" fill="url(#warm)"/>

  <!-- window frame -->
  <g opacity="0.5">
    <rect x="1010" y="-40" width="340" height="430" rx="18" fill="#FFF9EE" opacity="0.65"/>
    <path d="M1180-40v430M1010 175h340" stroke="#C9B493" stroke-width="9"/>
    <rect x="1010" y="-40" width="340" height="430" rx="18" fill="none" stroke="#C9B493" stroke-width="12"/>
  </g>

  ${plant(1490, 430, 1.15)}
  ${plant(760, 330, 0.62, true)}

  <!-- floor + couch -->
  <rect y="720" width="${W}" height="230" fill="url(#floor)"/>
  <rect x="640" y="560" width="1010" height="230" rx="54" fill="url(#couch)"/>
  <rect x="690" y="470" width="900" height="150" rx="46" fill="#EADCC6"/>
  <g>
    <rect x="735" y="455" width="190" height="165" rx="40" fill="url(#cushion)" transform="rotate(-7 830 537)"/>
    <rect x="1370" y="462" width="180" height="158" rx="38" fill="#EFD9C3" transform="rotate(6 1460 541)"/>
  </g>
  <!-- blanket the pets rest on -->
  <path d="M700 700c140-46 420-60 640-26 128 20 212 18 268-6v98H700Z" fill="#F6EFE3"/>

  ${pawField(W, H, PALETTE.white, 0.1, 16, 23)}

  <!-- dog -->
  <g>
    <ellipse cx="1065" cy="742" rx="196" ry="56" fill="${PALETTE.furDark}" opacity="0.14"/>
    <path d="M905 742c0-104 72-168 160-168s160 64 160 168Z" fill="${PALETTE.fur}"/>
    <path d="M940 742c0-72 50-116 125-116s125 44 125 116Z" fill="#E7BE84" opacity="0.65"/>
    <ellipse cx="930" cy="736" rx="46" ry="26" fill="${PALETTE.fur}"/>
    <ellipse cx="1200" cy="736" rx="46" ry="26" fill="${PALETTE.fur}"/>
    <path d="M912 728c0-9 8-14 18-14s18 5 18 14M952 728c0-9 8-14 18-14s18 5 18 14" stroke="${PALETTE.furDark}" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.55"/>
  </g>
  ${dogHead(1065, 480, 320, PALETTE.fur, PALETTE.furDark, PALETTE.sand)}

  <!-- cat, tucked beside the dog -->
  <g>
    <ellipse cx="1372" cy="748" rx="140" ry="42" fill="#7A878C" opacity="0.14"/>
    <path d="M1258 748c0-74 52-120 114-120s114 46 114 120Z" fill="${PALETTE.grey}"/>
    <path d="M1286 748c0-52 36-84 86-84s86 32 86 84Z" fill="#B0BBBF" opacity="0.6"/>
    <path d="M1470 742c48-6 76-30 82-62 2-10-12-16-18-7-12 20-32 33-64 37Z" fill="${PALETTE.grey}"/>
  </g>
  ${catHead(1372, 548, 230, PALETTE.grey, "#7A878C", PALETTE.cream)}

  <!-- Left-hand cream field, keeping the headline area calm. A gradient rather
       than a hard-edged rect: a flat one leaves a visible vertical seam down
       the middle of the scene. -->
  <rect width="${W}" height="${H}" fill="url(#calm)"/>
  ${paw(150, 760, 1.5, PALETTE.gold, 0.1, -14)}
  ${paw(330, 120, 1.1, PALETTE.gold, 0.08, 20)}`;

  return svg(W, H, body, defs);
}

function petPlate(name, kind, coat, coatDark, snout, bg1, bg2) {
  const W = 400;
  const H = 400;
  const defs = linearGradient("bg", bg1, bg2, "0 0 1 1");
  const head =
    kind === "cat"
      ? catHead(200, 205, 230, coat, coatDark, snout)
      : dogHead(200, 200, 240, coat, coatDark, snout);
  const body = `<rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${pawField(W, H, PALETTE.white, 0.1, 9, name.length + 3)}
  <circle cx="200" cy="208" r="150" fill="${PALETTE.white}" opacity="0.12"/>
  ${head}`;
  return svg(W, H, body, defs);
}

function avatarPlate(seed, tone, accent, initials) {
  const W = 200;
  const H = 200;
  const defs = linearGradient("bg", tone, accent, "0 0 1 1");
  const body = `<rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${pawField(W, H, PALETTE.white, 0.1, 5, seed)}
  <circle cx="100" cy="82" r="34" fill="${PALETTE.white}" opacity="0.92"/>
  <path d="M38 200c0-38 28-62 62-62s62 24 62 62Z" fill="${PALETTE.white}" opacity="0.92"/>
  <text x="100" y="196" text-anchor="middle" font-family="system-ui, sans-serif" font-size="1" fill="transparent">${initials}</text>`;
  return svg(W, H, body, defs);
}

/** Flat-illustration product plate, keyed to its category. */
function productPlate(slug, label, tint) {
  const W = 480;
  const H = 480;
  const defs = linearGradient("bg", PALETTE.cream, tint, "0 0 0.4 1");

  const art = {
    "dog-food": `<rect x="150" y="150" width="180" height="210" rx="22" fill="${PALETTE.teal700}"/>
      <rect x="150" y="150" width="180" height="62" rx="22" fill="${PALETTE.teal500}"/>
      <rect x="150" y="196" width="180" height="16" fill="${PALETTE.teal500}"/>
      ${paw(196, 236, 0.9, PALETTE.white, 0.95)}
      <rect x="178" y="312" width="124" height="10" rx="5" fill="${PALETTE.white}" opacity="0.5"/>
      <rect x="198" y="332" width="84" height="8" rx="4" fill="${PALETTE.white}" opacity="0.32"/>`,
    "cat-food": `<rect x="160" y="160" width="160" height="200" rx="20" fill="${PALETTE.teal700}"/>
      <path d="M160 180h160v30H160z" fill="${PALETTE.gold}"/>
      ${catHead(240, 272, 120, PALETTE.white, PALETTE.teal50, PALETTE.teal50)}`,
    treats: `<rect x="140" y="190" width="200" height="140" rx="18" fill="${PALETTE.gold}"/>
      <path d="M140 212h200" stroke="${PALETTE.white}" stroke-width="6" opacity="0.5"/>
      <circle cx="200" cy="272" r="22" fill="${PALETTE.furDark}"/>
      <circle cx="248" cy="272" r="22" fill="${PALETTE.fur}"/>
      <circle cx="296" cy="272" r="22" fill="${PALETTE.furDark}"/>`,
    "health-supplements": `<rect x="186" y="150" width="108" height="190" rx="20" fill="${PALETTE.teal500}"/>
      <rect x="206" y="120" width="68" height="40" rx="12" fill="${PALETTE.teal900}"/>
      <rect x="200" y="208" width="80" height="88" rx="12" fill="${PALETTE.white}" opacity="0.9"/>
      <path d="M240 228v48M216 252h48" stroke="${PALETTE.orange}" stroke-width="14" stroke-linecap="round"/>`,
    "parasite-control": `<ellipse cx="240" cy="258" rx="92" ry="78" fill="${PALETTE.teal700}"/>
      <path d="M240 180c40 0 70 30 70 70" stroke="${PALETTE.white}" stroke-width="8" fill="none" opacity="0.4" stroke-linecap="round"/>
      <circle cx="240" cy="256" r="34" fill="${PALETTE.cream}"/>
      <path d="M216 232l48 48M264 232l-48 48" stroke="${PALETTE.orange}" stroke-width="12" stroke-linecap="round"/>`,
    grooming: `<rect x="176" y="150" width="128" height="180" rx="24" fill="${PALETTE.teal500}"/>
      <rect x="208" y="122" width="64" height="34" rx="10" fill="${PALETTE.teal900}"/>
      <circle cx="240" cy="236" r="40" fill="${PALETTE.white}" opacity="0.92"/>
      <circle cx="318" cy="186" r="20" fill="${PALETTE.white}" opacity="0.6"/>
      <circle cx="348" cy="232" r="13" fill="${PALETTE.white}" opacity="0.45"/>`,
    "toys-enrichment": `<circle cx="240" cy="256" r="94" fill="${PALETTE.orange}"/>
      <circle cx="240" cy="256" r="60" fill="${PALETTE.cream}"/>
      ${paw(196, 212, 0.9, PALETTE.orange, 1)}`,
    accessories: `<path d="M152 230h176a26 26 0 0 1 0 52H152a26 26 0 0 1 0-52Z" fill="${PALETTE.teal700}"/>
      <circle cx="240" cy="310" r="30" fill="${PALETTE.gold}"/>
      ${paw(216, 288, 0.5, PALETTE.white, 1)}
      <rect x="196" y="244" width="24" height="24" rx="6" fill="${PALETTE.white}" opacity="0.6"/>`,
  }[slug];

  const body = `<rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${pawField(W, H, PALETTE.teal700, 0.05, 10, label.length)}
  <circle cx="240" cy="250" r="168" fill="${PALETTE.white}" opacity="0.55"/>
  ${art ?? ""}`;
  return svg(W, H, body, defs);
}

function categoryPlate(slug, from, to, kind) {
  const W = 480;
  const H = 320;
  const defs = linearGradient("bg", from, to, "0 0 1 1");
  const creature =
    kind === "cat"
      ? catHead(360, 190, 180, PALETTE.white, PALETTE.teal50, PALETTE.teal50)
      : kind === "dog"
        ? dogHead(360, 185, 190, PALETTE.white, PALETTE.teal50, PALETTE.teal50)
        : paw(300, 110, 1.5, PALETTE.white, 0.9);
  const body = `<rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${pawField(W, H, PALETTE.white, 0.08, 10, slug.length)}
  <g opacity="0.95">${creature}</g>`;
  return svg(W, H, body, defs);
}

function guideCover(slug, from, to, motif) {
  const W = 800;
  const H = 480;
  const defs = linearGradient("bg", from, to, "0 0 0.8 1");

  const motifs = {
    syringe: `<g transform="translate(250 150) rotate(-28)" fill="${PALETTE.white}" opacity="0.95">
      <rect x="0" y="40" width="190" height="52" rx="14"/>
      <rect x="186" y="56" width="52" height="20" rx="8"/>
      <rect x="236" y="62" width="76" height="8" rx="4"/>
      <rect x="-34" y="48" width="38" height="36" rx="10"/>
    </g>`,
    tick: `<ellipse cx="400" cy="250" rx="96" ry="78" fill="${PALETTE.white}" opacity="0.95"/>
      <circle cx="400" cy="178" r="34" fill="${PALETTE.white}" opacity="0.95"/>
      <path d="M312 206l-62-28M312 250h-70M312 294l-62 28M488 206l62-28M488 250h70M488 294l62 28" stroke="${PALETTE.white}" stroke-width="12" stroke-linecap="round" opacity="0.8"/>`,
    bowl: `<path d="M268 240h264c0 72-60 112-132 112s-132-40-132-112Z" fill="${PALETTE.white}" opacity="0.95"/>
      <ellipse cx="400" cy="240" rx="132" ry="34" fill="${PALETTE.cream}"/>
      ${paw(362, 192, 0.76, PALETTE.orange, 0.9)}`,
    scale: `<rect x="280" y="300" width="240" height="56" rx="20" fill="${PALETTE.white}" opacity="0.95"/>
      <circle cx="400" cy="328" r="16" fill="${PALETTE.teal700}"/>
      ${dogHead(400, 200, 190, PALETTE.white, PALETTE.teal50, PALETTE.cream)}`,
    skin: `<circle cx="400" cy="250" r="118" fill="${PALETTE.white}" opacity="0.95"/>
      <path d="M336 232c22-20 48-20 70 0s48 20 70 0" stroke="${PALETTE.orange}" stroke-width="14" fill="none" stroke-linecap="round"/>
      <path d="M336 284c22-20 48-20 70 0s48 20 70 0" stroke="${PALETTE.orange}" stroke-width="14" fill="none" stroke-linecap="round" opacity="0.6"/>`,
    kitten: catHead(400, 240, 260, PALETTE.white, PALETTE.teal50, PALETTE.cream),
    alert: `<path d="M400 140l140 240H260Z" fill="${PALETTE.white}" opacity="0.95"/>
      <rect x="388" y="222" width="24" height="86" rx="12" fill="${PALETTE.orange}"/>
      <circle cx="400" cy="336" r="15" fill="${PALETTE.orange}"/>`,
    senior: `${dogHead(400, 230, 250, PALETTE.white, PALETTE.teal50, PALETTE.cream)}
      <path d="M250 382c40-26 100-26 150 0s110 26 150 0" stroke="${PALETTE.white}" stroke-width="12" fill="none" opacity="0.5" stroke-linecap="round"/>`,
    litter: `<path d="M276 232h248v124a16 16 0 0 1-16 16H292a16 16 0 0 1-16-16Z" fill="${PALETTE.white}" opacity="0.95"/>
      <rect x="260" y="210" width="280" height="34" rx="16" fill="${PALETTE.cream}"/>
      ${paw(366, 262, 0.72, PALETTE.teal700, 0.85)}`,
    worm: `<path d="M240 300c40-80 120-80 160 0s120 80 160 0" stroke="${PALETTE.white}" stroke-width="26" fill="none" stroke-linecap="round" opacity="0.95"/>
      <circle cx="240" cy="300" r="22" fill="${PALETTE.white}"/>`,
  };

  const body = `<rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${pawField(W, H, PALETTE.white, 0.07, 16, slug.length)}
  ${motifs[motif] ?? motifs.bowl}`;
  return svg(W, H, body, defs);
}

function breedPlate(slug, kind, coat, coatDark, snout, bg) {
  const W = 400;
  const H = 300;
  const defs = linearGradient("bg", bg, PALETTE.cream, "0 0 0.5 1");
  const head =
    kind === "cat"
      ? catHead(200, 160, 190, coat, coatDark, snout)
      : dogHead(200, 155, 200, coat, coatDark, snout);
  const body = `<rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${pawField(W, H, PALETTE.teal700, 0.05, 8, slug.length)}
  ${head}`;
  return svg(W, H, body, defs);
}

/**
 * Square plate for the hero's species chips.
 *
 * Drawn square and cropped to a circle by the CSS that renders it, so the same
 * file also works in a rounded-rect tile without a second export.
 */
function petTypePlate(kind) {
  const S = 200;
  const art = {
    dog: () => ({
      bg: ["#F3D9AE", "#E0B678"],
      head: dogHead(100, 108, 150, PALETTE.fur, PALETTE.furDark, PALETTE.sand),
    }),
    cat: () => ({
      bg: ["#E6EEEC", "#C3D6D3"],
      head: catHead(100, 108, 150, PALETTE.grey, "#7A878C", PALETTE.cream),
    }),
    rabbit: () => ({
      bg: ["#F6E7D6", "#E4C9AC"],
      head: rabbitHead(100, 104, 150, "#D9BFA4", "#B2977C", PALETTE.cream),
    }),
    bird: () => ({
      bg: ["#DCEAF2", "#B4D2E2"],
      head: birdHead(100, 106, 150, "#5BA8C9", "#36789A", PALETTE.gold),
    }),
    small: () => ({
      bg: ["#F7E6D2", "#E8C9A4"],
      head: smallPetHead(100, 106, 150, "#E0B07A", "#B98650", PALETTE.cream),
    }),
  }[kind]();

  const defs = linearGradient("bg", art.bg[0], art.bg[1], "0 0 0.6 1");
  const body = `<rect width="${S}" height="${S}" fill="url(#bg)"/>
  ${pawField(S, S, PALETTE.white, 0.16, 5, kind.length * 3)}
  ${art.head}`;
  return svg(S, S, body, defs);
}

/* ------------------------------------------------------------------ write */

const files = {
  "hero-pet.svg": heroScene(),
  "hero-home.svg": heroHomeScene(),

  "pet-types/dog.svg": petTypePlate("dog"),
  "pet-types/cat.svg": petTypePlate("cat"),
  "pet-types/rabbit.svg": petTypePlate("rabbit"),
  "pet-types/bird.svg": petTypePlate("bird"),
  "pet-types/small.svg": petTypePlate("small"),

  "pets/bruno.svg": petPlate("bruno", "dog", PALETTE.fur, PALETTE.furDark, PALETTE.sand, "#2E7A82", "#0F3F44"),
  "pets/misty.svg": petPlate("misty", "cat", PALETTE.grey, "#7A878C", PALETTE.cream, "#4E9298", "#134A52"),

  "avatars/parent.svg": avatarPlate(3, "#2E7A82", "#0F3F44", "AS"),
  "avatars/vet-1.svg": avatarPlate(5, "#1A5A63", "#0F3F44", "KR"),
  "avatars/vet-2.svg": avatarPlate(8, "#22676F", "#134A52", "IQ"),
  "avatars/vet-3.svg": avatarPlate(11, "#4E9298", "#1A5A63", "SP"),
  "avatars/tech-1.svg": avatarPlate(14, "#7FB0B1", "#2E7A82", "AK"),

  "products/dog-food.svg": productPlate("dog-food", "dog-food", "#D6E6E4"),
  "products/cat-food.svg": productPlate("cat-food", "cat-food", "#E8D9BE"),
  "products/treats.svg": productPlate("treats", "treats", "#FAE0D1"),
  "products/health-supplements.svg": productPlate("health-supplements", "health", "#D6E6E4"),
  "products/parasite-control.svg": productPlate("parasite-control", "parasite", "#E3E8E8"),
  "products/grooming.svg": productPlate("grooming", "grooming", "#EAF2F1"),
  "products/toys-enrichment.svg": productPlate("toys-enrichment", "toys", "#FAE0D1"),
  "products/accessories.svg": productPlate("accessories", "accessories", "#E8D9BE"),

  "categories/dog-food.svg": categoryPlate("dog-food", "#2E7A82", "#0F3F44", "dog"),
  "categories/cat-food.svg": categoryPlate("cat-food", "#4E9298", "#134A52", "cat"),
  "categories/treats.svg": categoryPlate("treats", "#C8972F", "#A97D22", "paw"),
  "categories/supplements.svg": categoryPlate("supplements", "#22676F", "#0F3F44", "paw"),
  "categories/parasite.svg": categoryPlate("parasite", "#1A5A63", "#0A2B2F", "dog"),
  "categories/grooming.svg": categoryPlate("grooming", "#7FB0B1", "#2E7A82", "cat"),
  "categories/toys.svg": categoryPlate("toys", "#E86E2B", "#AE4E1A", "paw"),
  "categories/accessories.svg": categoryPlate("accessories", "#2E7A82", "#134A52", "dog"),

  "guides/vaccination.svg": guideCover("vaccination", "#2E7A82", "#0F3F44", "syringe"),
  "guides/ticks.svg": guideCover("ticks", "#1A5A63", "#0A2B2F", "tick"),
  "guides/food-safety.svg": guideCover("food-safety", "#E86E2B", "#AE4E1A", "bowl"),
  "guides/nutrition.svg": guideCover("nutrition", "#22676F", "#0F3F44", "scale"),
  "guides/skin.svg": guideCover("skin", "#4E9298", "#1A5A63", "skin"),
  "guides/kitten.svg": guideCover("kitten", "#7FB0B1", "#2E7A82", "kitten"),
  "guides/emergency.svg": guideCover("emergency", "#C8972F", "#A97D22", "alert"),
  "guides/senior.svg": guideCover("senior", "#2E7A82", "#134A52", "senior"),
  "guides/litter.svg": guideCover("litter", "#4E9298", "#0F3F44", "litter"),
  "guides/deworming.svg": guideCover("deworming", "#1A5A63", "#0F3F44", "worm"),

  "breeds/golden-retriever.svg": breedPlate("golden", "dog", PALETTE.fur, PALETTE.furDark, PALETTE.sand, "#EAF2F1"),
  "breeds/labrador.svg": breedPlate("labrador", "dog", "#E3D3B4", "#C2AE8A", PALETTE.cream, "#F7F4EE"),
  "breeds/indie.svg": breedPlate("indie", "dog", "#D1A071", "#A87A4D", PALETTE.cream, "#EAF2F1"),
  "breeds/gsd.svg": breedPlate("gsd", "dog", "#8A6A47", "#4A3826", PALETTE.sand, "#E3E8E8"),
  "breeds/indian-shorthair.svg": breedPlate("shorthair", "cat", PALETTE.grey, "#7A878C", PALETTE.cream, "#EAF2F1"),
  "breeds/persian.svg": breedPlate("persian", "cat", "#F0E4D0", "#D4C3A6", PALETTE.white, "#F7F4EE"),
};

for (const [path, contents] of Object.entries(files)) {
  const target = join(OUT, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents, "utf8");
}

console.log(`Generated ${Object.keys(files).length} artwork files in public/images`);
