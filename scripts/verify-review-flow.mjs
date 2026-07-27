/**
 * Comprueba el repaso guiado tras terminar una prueba de Test Audio.
 *
 * El fallo que arregla: al terminar la prueba, la pantalla de resultados sugiere
 * los temas fallados. Entrar en uno llevaba a Teoría y DESMONTABA el componente,
 * así que al volver aparecía la lista de pruebas y el alumno perdía el puntaje y
 * el resto de sugerencias. No había forma de repasar un tema tras otro.
 *
 * Se recorre el flujo completo en los DOS modos (contrarreloj y tiempo libre):
 *   1. responder la prueba entera hasta la pantalla de resultados;
 *   2. anotar el puntaje;
 *   3. entrar en la primera sugerencia de repaso;
 *   4. volver con el botón «Volver a los resultados» → el puntaje debe seguir ahí;
 *   5. entrar en OTRA sugerencia y volver otra vez;
 *   6. repetir la vuelta con la flecha atrás del navegador.
 *
 * Uso:
 *   npm run build && npx vite preview --port 4173 &
 *   node scripts/verify-review-flow.mjs [http://localhost:4173]
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:4173';
const CHROME = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const failures = [];
const check = (cond, label) => {
  console.log(`   ${cond ? '✅' : '❌'} ${label}`);
  if (!cond) failures.push(label);
};

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] });

for (const mode of ['free', 'timed']) {
  const label = mode === 'free' ? 'tiempo libre (sin cronómetro)' : 'contra el tiempo';
  console.log(`\n═══ MODO: ${label} ═══`);
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  await page.goto(BASE + '/test-audio', { waitUntil: 'networkidle' });

  await page.locator('.ta-test-card').first().click();
  await page.locator(`.ta-mode-card.${mode}`).click();

  // Responder la prueba entera. Se elige a propósito una opción cualquiera: da
  // igual acertar o fallar, lo que se prueba es la navegación posterior.
  for (let ex = 0; ex < 10; ex++) {
    const questions = page.locator('.ta-question');
    const n = await questions.count();
    for (let q = 0; q < n; q++) {
      const opts = questions.nth(q).locator('.ta-option');
      if (await opts.first().isEnabled()) await opts.first().click();
    }
    await page.locator('.ta-nav .ta-btn-primary').click();
    await page.waitForTimeout(120);
  }

  await page.waitForSelector('.ta-result-card', { timeout: 10000 });
  const score = (await page.locator('.ta-result-score').innerText()).replace(/\s+/g, '');
  const pct = await page.locator('.ta-result-pct').innerText();
  console.log(`   Puntaje obtenido: ${score} · ${pct}`);

  const suggestions = await page.locator('.ta-review-item').count();
  check(suggestions > 0, `la pantalla de resultados propone temas de repaso (${suggestions})`);
  if (suggestions === 0) { await page.close(); continue; }

  // ── 1ª sugerencia ─────────────────────────────────────────────────────────
  const firstTopic = await page.locator('.ta-review-item').first().locator('.ta-review-concept').innerText();
  await page.locator('.ta-review-item').first().click();
  await page.waitForTimeout(400);
  check(page.url().includes('/teoria'), `entra en Teoría desde «${firstTopic}»`);
  check(await page.locator('.teoria-back').isVisible(), 'Teoría muestra el botón «Volver a los resultados»');

  await page.locator('.teoria-back').click();
  await page.waitForTimeout(500);
  check(await page.locator('.ta-result-card').isVisible(), 'al volver se ve otra vez la pantalla de resultados');
  const score2 = (await page.locator('.ta-result-score').innerText()).replace(/\s+/g, '');
  check(score2 === score, `el puntaje se conserva (${score2} = ${score})`);
  check(await page.locator('.ta-review-item').count() === suggestions,
    'la lista de sugerencias sigue completa');
  check(await page.locator('.ta-review-item.seen').count() >= 1,
    'el tema ya visitado queda marcado como revisado');

  // ── 2ª sugerencia ─────────────────────────────────────────────────────────
  if (suggestions > 1) {
    const second = await page.locator('.ta-review-item').nth(1).locator('.ta-review-concept').innerText();
    await page.locator('.ta-review-item').nth(1).click();
    await page.waitForTimeout(400);
    check(page.url().includes('/teoria'), `entra en la segunda sugerencia «${second}»`);
    await page.locator('.teoria-back').click();
    await page.waitForTimeout(500);
    check(await page.locator('.ta-result-card').isVisible(), 'vuelve otra vez a los resultados');
    check((await page.locator('.ta-result-score').innerText()).replace(/\s+/g, '') === score,
      'el puntaje sigue intacto tras el segundo repaso');
    check(await page.locator('.ta-review-item.seen').count() >= 2,
      'ya hay dos temas marcados como revisados');
  }

  // ── Flecha atrás del navegador ────────────────────────────────────────────
  await page.locator('.ta-review-item').first().click();
  await page.waitForTimeout(400);
  await page.goBack();
  await page.waitForTimeout(600);
  check(await page.locator('.ta-result-card').isVisible(),
    'la flecha atrás del navegador también devuelve a los resultados');

  // ── Salir a propósito debe limpiar el repaso ──────────────────────────────
  await page.locator('.ta-result-actions .ta-btn-secondary').click();
  await page.waitForTimeout(300);
  check(await page.locator('.ta-tests-grid').isVisible(), '«Otras pruebas» vuelve a la lista');
  await page.goto(BASE + '/test-audio', { waitUntil: 'networkidle' });
  check(await page.locator('.ta-tests-grid').isVisible(),
    'tras salir a propósito ya no reaparece el puntaje viejo');

  await page.close();
}

// ═══════════════════════════════════════════════════════════════════════════
// MÓDULOS (/prueba) — mismo problema, mismo arreglo: «Ver Teoría» desde los
// resultados navegaba a /teoria y el puntaje del módulo se perdía.
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n═══ MÓDULOS · contrarreloj por pregunta ═══');
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  await page.goto(BASE + '/prueba', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.selector-container');

  await page.locator('.selector-card').first().click();
  // Cuenta atrás de 3 segundos antes de la primera pregunta.
  await page.waitForSelector('.test-screen', { timeout: 15000 });

  // Responder hasta llegar a los resultados. Cada pregunta tiene su propio
  // cronómetro, así que se contesta en cuanto aparecen las opciones.
  for (let guard = 0; guard < 40; guard++) {
    if (await page.locator('.result-card').isVisible().catch(() => false)) break;
    const opt = page.locator('.opt-btn:not([disabled])').first();
    if (await opt.isVisible().catch(() => false)) {
      await opt.click().catch(() => {});
    }
    await page.waitForTimeout(700);
  }

  await page.waitForSelector('.result-card', { timeout: 30000 });
  const score = (await page.locator('.rstat-val').first().innerText()).trim();
  const stats = (await page.locator('.result-stats').innerText()).replace(/\s+/g, ' ');
  console.log(`   Resultado del módulo: ${stats}`);

  check(await page.locator('.res-theory').isVisible(), 'la pantalla de resultados ofrece «Ver Teoría»');

  await page.locator('.res-theory').click();
  await page.waitForTimeout(500);
  check(page.url().includes('/teoria'), 'entra en Teoría desde los resultados del módulo');
  check(await page.locator('.teoria-back').isVisible(), 'Teoría muestra el botón de vuelta');

  await page.locator('.teoria-back').click();
  await page.waitForTimeout(600);
  check(await page.locator('.result-card').isVisible(), 'al volver se ve otra vez el resultado del módulo');
  check((await page.locator('.rstat-val').first().innerText()).trim() === score,
    `el puntaje del módulo se conserva (${score})`);

  // Segunda vuelta, para comprobar que se puede repetir el ciclo.
  await page.locator('.res-theory').click();
  await page.waitForTimeout(500);
  await page.goBack();
  await page.waitForTimeout(600);
  check(await page.locator('.result-card').isVisible(),
    'la flecha atrás del navegador también devuelve al resultado del módulo');

  // Salir a propósito debe descartar el repaso.
  await page.locator('.res-ruta').click();
  await page.waitForTimeout(400);
  await page.goto(BASE + '/prueba', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  check(await page.locator('.selector-container').isVisible(),
    'tras salir a propósito ya no reaparece el resultado viejo');

  await page.close();
}

await browser.close();

console.log('');
if (failures.length) {
  console.error(`❌ ${failures.length} comprobación(es) fallidas:`);
  failures.forEach(f => console.error('   - ' + f));
  process.exit(1);
}
console.log('✅ El repaso guiado funciona en Test Audio (los dos modos) y en Módulos: '
  + 'se entra al contenido teórico y se vuelve al puntaje.');
