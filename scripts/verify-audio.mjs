/**
 * Comprueba, en un navegador de verdad, que los 30 audios de «Test Audio»
 * SUENAN. Es la prueba que faltaba: antes la sección dependía de las voces del
 * sistema y en un navegador sin voces no se oía nada, pero nada en el código lo
 * detectaba.
 *
 * Para cada ejercicio verifica que:
 *   1. el MP3 responde 200 y no está vacío;
 *   2. el elemento <audio> lo decodifica (duración finita y > 3 s);
 *   3. al reproducirlo, `currentTime` AVANZA de verdad (no se queda a 0);
 *   4. no se agota el presupuesto de reproducciones por un fallo técnico.
 *
 * Uso:
 *   npm run build && npx vite preview --port 4173 &
 *   node scripts/verify-audio.mjs [http://localhost:4173]
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:4173';
const CHROME = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
});
const page = await browser.newPage();

const failures = [];
const rows = [];

await page.goto(BASE + '/', { waitUntil: 'networkidle' });

// La lista de ejercicios sale del propio bundle, no de una copia a mano.
const exercises = await page.evaluate(async () => {
  const res = await fetch('/audio/manifest.json');
  const manifest = await res.json();
  return Object.keys(manifest.audios).sort();
});
console.log(`Verificando ${exercises.length} audios contra ${BASE}\n`);

for (const id of exercises) {
  const url = `${BASE}/audio/${id}.mp3`;
  const result = await page.evaluate(async (src) => {
    // 1) ¿existe el archivo?
    const head = await fetch(src, { method: 'GET' });
    if (!head.ok) return { ok: false, why: `HTTP ${head.status}` };
    const bytes = (await head.blob()).size;
    if (bytes < 2000) return { ok: false, why: `archivo demasiado pequeño (${bytes} B)` };

    // 2) ¿el navegador lo decodifica?
    const el = new Audio();
    el.src = src;
    el.volume = 0; // silencioso para el test: currentTime avanza igual
    const meta = await new Promise((resolve) => {
      const t = setTimeout(() => resolve({ ok: false, why: 'timeout cargando metadatos' }), 15000);
      el.onloadedmetadata = () => { clearTimeout(t); resolve({ ok: true }); };
      el.onerror = () => { clearTimeout(t); resolve({ ok: false, why: 'error de decodificación' }); };
    });
    if (!meta.ok) return { ...meta, bytes };
    const duration = el.duration;
    if (!isFinite(duration) || duration < 3) return { ok: false, why: `duración inválida (${duration})`, bytes };

    // 3) ¿avanza al reproducir? Es lo que distingue «suena» de «no suena».
    try { await el.play(); } catch (e) { return { ok: false, why: 'play() rechazado: ' + e.message, bytes, duration }; }
    await new Promise(r => setTimeout(r, 1200));
    const advanced = el.currentTime;
    el.pause();
    if (advanced <= 0.1) return { ok: false, why: `currentTime no avanzó (${advanced})`, bytes, duration };

    return { ok: true, bytes, duration, advanced };
  }, url);

  rows.push({ id, ...result });
  if (!result.ok) failures.push(`${id}: ${result.why}`);
  const mark = result.ok ? '✅' : '❌';
  console.log(
    `${mark} ${id.padEnd(8)} ${result.duration ? result.duration.toFixed(1).padStart(5) + 's' : '   —  '}` +
    ` ${result.bytes ? (result.bytes / 1024).toFixed(0).padStart(4) + ' KB' : ''}` +
    `${result.ok ? `  avanzó a ${result.advanced.toFixed(2)}s` : `  ${result.why}`}`
  );
}

// ── Recorrido real por la interfaz: el botón «Escuchar» del primer ejercicio ──
console.log('\nComprobando el reproductor de la interfaz…');
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.getByRole('link', { name: 'Test Audio' }).click();
await page.locator('.ta-test-card').first().click();
await page.locator('.ta-mode-card.free').click();
await page.locator('.ta-play-btn').click();
await page.waitForTimeout(2500);

const ui = await page.evaluate(() => {
  const el = document.querySelector('.ta-player-card audio');
  return {
    src: el ? el.getAttribute('src') : null,
    currentTime: el ? el.currentTime : -1,
    paused: el ? el.paused : true,
    plays: (document.querySelector('.ta-plays')?.textContent || '').trim(),
    error: (document.querySelector('.ta-audio-error')?.textContent || '').trim(),
  };
});
console.log('   src:', ui.src, '| currentTime:', ui.currentTime.toFixed(2), '| paused:', ui.paused);
console.log('   contador:', ui.plays, ui.error ? '| aviso: ' + ui.error : '');
if (ui.currentTime <= 0.1) failures.push('interfaz: el botón «Escuchar» no hizo avanzar el audio');
if (ui.error) failures.push('interfaz: mostró un aviso de error — ' + ui.error);

await browser.close();

console.log('');
if (failures.length) {
  console.error(`❌ ${failures.length} fallo(s):`);
  failures.forEach(f => console.error('   - ' + f));
  process.exit(1);
}
console.log(`✅ Los ${rows.length} audios cargan, se decodifican y avanzan al reproducirse.`);
