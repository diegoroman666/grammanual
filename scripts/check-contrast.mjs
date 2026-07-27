/**
 * Audita el contraste de TODO el texto visible del sitio, en los dos temas.
 *
 * El requisito era claro: al pasar a los colores de INACAP no puede quedar
 * ningún texto que no se vea. Revisar eso a ojo, hoja por hoja, no es fiable —
 * hay más de 4.000 líneas de CSS y colores heredados de la paleta anterior.
 *
 * Este script recorre las páginas con un navegador real y, para cada nodo de
 * texto, calcula el contraste WCAG entre su color y el fondo REALMENTE pintado
 * detrás (subiendo por los ancestros hasta encontrar un fondo opaco y
 * componiendo las capas translúcidas). Falla si algo baja del mínimo AA.
 *
 * Uso:
 *   npm run build && npx vite preview --port 4173 &
 *   node scripts/check-contrast.mjs [http://localhost:4173]
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:4173';
const CHROME = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

// Umbrales WCAG AA: 4.5:1 para texto normal, 3:1 para texto grande
// (>=24px, o >=18.66px en negrita).
const AA_NORMAL = 4.5;   // texto normal
const AA_LARGE = 3.0;    // texto grande (>=24px, o >=18.66px en negrita)

const PAGES = [
  ['Inicio', '/'],
  ['Cómo aprender', '/como-aprender'],
  ['Teoría', '/teoria'],
  ['Herramientas', '/herramientas'],
  ['Ruta', '/ruta'],
  ['Módulos', '/prueba'],
  ['Práctica libre', '/practica-libre'],
  ['Test Audio', '/test-audio'],
  ['Acerca', '/acerca'],
];

// OJO: esta función se serializa y se ejecuta DENTRO del navegador, así que no
// puede leer nada del ámbito de Node. Los umbrales entran como argumento.
const audit = ({ aaNormal, aaLarge }) => {
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(',').map(s => parseFloat(s.trim()));
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const over = (fg, bg) => ({           // compone fg (con alfa) sobre bg opaco
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
  };

  // Colores de un degradado. getComputedStyle().backgroundColor devuelve
  // "transparent" cuando el fondo es un linear-gradient, así que hay que sacar
  // las paradas de color del background-image o el degradado se ignoraría y se
  // mediría contra el fondo del padre (falso positivo).
  const gradientStops = (bgImage) => {
    if (!bgImage || !bgImage.includes('gradient')) return [];
    return (bgImage.match(/rgba?\([^)]+\)/g) || []).map(parse).filter(Boolean);
  };

  // ¿El degradado del elemento está recortado al texto? Con
  // `background-clip: text` + `text-fill-color: transparent` el degradado NO es
  // el fondo: es el relleno de las letras. Hay que tratarlo como color de texto
  // o se compararía el degradado consigo mismo.
  const clipsToText = (s) =>
    (s.webkitBackgroundClip === 'text' || s.backgroundClip === 'text') &&
    (s.webkitTextFillColor === 'rgba(0, 0, 0, 0)' || s.color === 'rgba(0, 0, 0, 0)');

  // Fondo efectivo: sube por los ancestros componiendo capas translúcidas.
  // Devuelve la lista de fondos candidatos — si hay degradado, son varios y el
  // texto debe leerse sobre TODOS ellos.
  const effectiveBgs = (el, skipOwn) => {
    let layers = [];
    let stops = [];
    let node = skipOwn ? el.parentElement : el;
    while (node && node !== document.documentElement) {
      const s = getComputedStyle(node);
      if (!stops.length && !clipsToText(s)) stops = gradientStops(s.backgroundImage);
      const c = parse(s.backgroundColor);
      if (c && c.a > 0) {
        layers.unshift(c);
        if (c.a === 1) break;
      }
      if (stops.length) break;   // el degradado tapa lo que haya debajo
      node = node.parentElement;
    }
    let base = parse(getComputedStyle(document.documentElement).backgroundColor);
    if (!base || base.a === 0) base = { r: 255, g: 255, b: 255, a: 1 };
    const solid = layers.reduce((acc, l) => over(l, acc), base);
    return stops.length ? stops.map(s => over(s, solid)) : [solid];
  };

  const results = [];
  const seen = new Set();

  document.querySelectorAll('body *').forEach(el => {
    // Solo elementos con texto propio y visible
    const own = Array.from(el.childNodes)
      .filter(n => n.nodeType === 3 && n.textContent.trim())
      .map(n => n.textContent.trim()).join(' ');
    if (!own) return;

    // Los emoji se pintan con sus propios colores y no obedecen a `color`, así
    // que medir su contraste no dice nada: un 🔤 sobre fondo oscuro se ve
    // perfectamente aunque el `color` heredado sea negro. Se saltan los textos
    // que son solo pictogramas.
    if (!/[\p{L}\p{N}]/u.test(own)) return;

    const rect = el.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    const s = getComputedStyle(el);
    if (s.visibility === 'hidden' || s.display === 'none' || parseFloat(s.opacity) < 0.15) return;

    // Colores del texto: normalmente uno, pero si el degradado está recortado al
    // texto son las paradas del degradado las que pintan las letras.
    const textIsGradient = clipsToText(s);
    const fgs = textIsGradient ? gradientStops(s.backgroundImage) : [parse(s.color)].filter(Boolean);
    if (!fgs.length || fgs.every(c => c.a === 0)) return;

    // Se toma la combinación PEOR: el texto tiene que leerse en todo el recorrido
    // del degradado, no solo en un extremo.
    const bgs = effectiveBgs(el, textIsGradient);
    let worst = null;
    for (const bg of bgs) {
      for (const f of fgs) {
        const composed = f.a < 1 ? over(f, bg) : f;
        const rr = ratio(composed, bg);
        if (!worst || rr < worst.r) worst = { r: rr, bg, fg: f };
      }
    }
    const { r, bg } = worst;
    const fgLabel = textIsGradient
      ? `degradado rgb(${Math.round(worst.fg.r)}, ${Math.round(worst.fg.g)}, ${Math.round(worst.fg.b)})`
      : s.color;

    const size = parseFloat(s.fontSize);
    const bold = parseInt(s.fontWeight, 10) >= 700;
    const large = size >= 24 || (bold && size >= 18.66);
    const min = large ? aaLarge : aaNormal;

    const key = `${el.className}|${fgLabel}|${own.slice(0, 24)}`;
    if (seen.has(key)) return;
    seen.add(key);

    if (r < min) {
      results.push({
        text: own.slice(0, 55),
        selector: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string'
          ? '.' + el.className.trim().split(/\s+/).join('.') : ''),
        color: fgLabel,
        bg: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
        ratio: Number(r.toFixed(2)),
        min,
        size: Math.round(size),
      });
    }
  });
  return results;
};

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

let total = 0;
const failures = [];

for (const theme of ['dark', 'light']) {
  console.log(`\n${'═'.repeat(60)}\nTEMA ${theme.toUpperCase()}\n${'═'.repeat(60)}`);
  for (const [name, path] of PAGES) {
    // El tema se guarda en localStorage con esta clave y App.jsx lo aplica como
    // clase en <html> al montar; hay que fijarlo ANTES de cargar la página para
    // que el render inicial ya use el tema correcto.
    await page.addInitScript((t) => {
      localStorage.setItem('grammanual-theme', t);
    }, theme);
    // 'domcontentloaded' y no 'networkidle': la hoja de fuentes de Google puede
    // tardar o no llegar, y esperar a la red ociosa multiplica por diez lo que
    // tarda la auditoría sin cambiar los colores calculados.
    //
    // Se reintenta porque el servidor de vista previa devuelve algún fallo
    // esporádico al servir varias páginas seguidas, y un tropiezo de red no debe
    // parecer un problema de contraste.
    let loaded = false;
    for (let attempt = 1; attempt <= 3 && !loaded; attempt++) {
      try {
        await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('.app-wrapper', { timeout: 15000 });
        loaded = true;
      } catch (err) {
        if (attempt === 3) throw new Error(`No se pudo cargar ${path}: ${err.message}`);
        await page.waitForTimeout(1000 * attempt);
      }
    }
    await page.waitForTimeout(500);

    const applied = await page.evaluate(() => document.documentElement.className);
    if (!applied.includes(theme)) {
      throw new Error(`No se pudo aplicar el tema ${theme} en ${path} (clases: "${applied}")`);
    }

    const bad = await page.evaluate(audit, { aaNormal: AA_NORMAL, aaLarge: AA_LARGE });
    total += 1;
    if (bad.length === 0) {
      console.log(`✅ ${name}`);
    } else {
      console.log(`❌ ${name} — ${bad.length} con contraste insuficiente:`);
      bad.forEach(b => {
        console.log(`     ${String(b.ratio).padStart(5)}:1 (mín ${b.min})  ${b.selector}`);
        console.log(`            «${b.text}»  ${b.color} sobre ${b.bg}  ${b.size}px`);
        failures.push(`[${theme}] ${name} · ${b.selector} · ${b.ratio}:1`);
      });
    }
  }
}

await browser.close();

console.log('');
if (failures.length) {
  console.error(`❌ ${failures.length} problema(s) de contraste en ${total} vistas revisadas.`);
  process.exit(1);
}
console.log(`✅ Todo el texto visible supera el contraste AA en las ${total} vistas revisadas (claro y oscuro).`);
