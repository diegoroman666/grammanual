// ─────────────────────────────────────────────────────────────────────────────
// Repaso guiado tras una prueba
//
// El problema que resuelve: al terminar una prueba, la pantalla de resultados
// ofrece ir al contenido teórico. Pulsar ese enlace navega a /teoria, lo que
// DESMONTA el componente de la prueba y se lleva por delante el puntaje. Al
// volver aparecía la pantalla inicial y el alumno perdía el resultado, así que
// no podía repasar un tema y seguir con el siguiente.
//
// La solución es guardar una foto del resultado en sessionStorage mientras dura
// el repaso. El componente la recupera al montarse y vuelve a enseñar la
// pantalla del puntaje. Funciona tanto con el botón «Volver a los resultados»
// de Teoría como con la flecha atrás del navegador.
//
// Se usa sessionStorage y no localStorage a propósito: el repaso pertenece a
// esta visita. Si el alumno cierra la pestaña, no debe encontrarse el puntaje de
// una prueba antigua al volver otro día.
//
// La foto se borra en cuanto el alumno sale de los resultados a propósito
// (repetir la prueba, elegir otra, volver al inicio), para que nunca reaparezca
// un resultado viejo donde no toca.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Crea el almacén de repaso de una sección.
 * @param {string} key clave propia de la sección, para que dos pruebas
 *                     distintas no se pisen el resultado.
 */
export function makeReviewSession(key) {
  return {
    load() {
      try {
        const raw = sessionStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch {
        // Almacenamiento no disponible (modo privado, cuota llena) o JSON
        // corrupto: se sigue sin repaso guardado en vez de romper la vista.
        return null;
      }
    },

    save(data) {
      try {
        sessionStorage.setItem(key, JSON.stringify(data));
      } catch {
        // Sin almacenamiento el repaso sigue funcionando con el botón «Volver a
        // los resultados»; solo se pierde si se recarga la página.
      }
    },

    clear() {
      try {
        sessionStorage.removeItem(key);
      } catch {
        /* nada que limpiar */
      }
    },
  };
}

/**
 * Estado que se pasa a /teoria para que muestre la vuelta a los resultados.
 * @param {string} tab      pestaña de teoría a abrir (puede ser null)
 * @param {string} backTo   ruta a la que vuelve el botón
 * @param {string} backLabel texto del botón
 */
export function theoryNavState(tab, backTo, backLabel = 'Volver a los resultados') {
  return {
    ...(tab ? { tab } : {}),
    backTo,
    backLabel,
  };
}
