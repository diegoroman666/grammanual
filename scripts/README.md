# Scripts de verificación

Dos bloques: los audios de «Test Audio» y las comprobaciones de interfaz
(contraste de color y repaso guiado).

| Script | Qué comprueba |
| --- | --- |
| `npm run audio:generate` | Genera los MP3 desde las transcripciones |
| `npm run audio:verify` | Que los 30 audios suenan en un navegador real |
| `npm run audio:intelligibility` | Que dicen lo que deberían decir |
| `npm run check:contrast` | Que NINGÚN texto queda ilegible, en los dos temas |
| `npm run check:review-flow` | Que tras una prueba se puede repasar tema a tema sin perder el puntaje |

Los tres últimos necesitan el sitio servido:

```bash
npm run build && npx vite preview --port 4173 &
npm run check:contrast
npm run check:review-flow
```

---

## Contraste de color (`check-contrast.mjs`)

La paleta es la de INACAP: rojo, negro y blanco. El riesgo evidente al cambiar
colores es dejar texto que no se lee, y revisar 4.000 líneas de CSS a ojo no es
fiable. Este script recorre las nueve páginas en tema claro y oscuro y, para
cada nodo de texto, calcula el contraste WCAG contra el fondo **realmente
pintado** detrás: sube por los ancestros componiendo las capas translúcidas.
Falla si algo baja de AA (4,5:1, o 3:1 en texto grande).

Dos casos que costó modelar bien y conviene no romper:

- **Degradados de fondo.** `getComputedStyle().backgroundColor` devuelve
  `transparent` cuando el fondo es un `linear-gradient`, así que el script saca
  las paradas de color del `background-image` y exige que el texto se lea sobre
  **todas** ellas, no solo sobre una.
- **`background-clip: text`.** Ahí el degradado no es el fondo: son las letras.
  Se trata como color de texto y se mide contra el fondo del ancestro.

Al tocar colores, lo importante: `--accent-contrast` es el color del texto que
va **encima** de un fondo de acento, y no es el mismo en los dos temas. En
oscuro el rojo es claro y pide texto negro; en claro el rojo es oscuro y pide
texto blanco. Invertirlo deja el texto en 3,2:1 y se lee mal.

## Repaso guiado (`verify-review-flow.mjs`)

Al terminar una prueba de Test Audio, la pantalla de resultados sugiere los
temas fallados. Entrar en uno navega a Teoría, lo que desmonta el componente y
antes se llevaba por delante el puntaje: al volver aparecía la lista de pruebas
y no había forma de repasar un tema tras otro.

Ahora se guarda una foto del resultado en `sessionStorage` mientras dura el
repaso y Teoría muestra un botón «Volver a los resultados». El script recorre el
ciclo completo en **los dos modos** (contrarreloj y tiempo libre): responder la
prueba, entrar en una sugerencia, volver y comprobar que el puntaje sigue ahí,
entrar en otra, y verificar que la flecha atrás del navegador hace lo mismo.
También comprueba lo contrario: que al salir a propósito («Otras pruebas» o
repetir) el puntaje viejo **no** reaparece.

---

# Audios de la sección «Test Audio»

## Por qué existen estos scripts

La sección Test Audio leía cada ejercicio con la Web Speech API del navegador
(`speechSynthesis`). En un PC con voces instaladas funcionaba; en muchos otros
sitios, no:

- Chrome/Chromium en Linux sin `speech-dispatcher`,
- muchos Android y WebViews (incluida la app empaquetada con Capacitor),
- perfiles de navegador sin ningún paquete de voces en inglés.

En todos esos casos `speechSynthesis.getVoices()` devuelve una lista **vacía** y
cada `speak()` termina en `error: synthesis-failed`. El alumno pulsaba
«Escuchar», **no oía nada**, y encima el contador le descontaba una de sus tres
reproducciones. Nada en el código detectaba el fallo.

La solución es no depender del dispositivo: los 30 ejercicios se pre-generan
como MP3 y se sirven desde el propio sitio (`public/audio/`). La síntesis del
navegador queda solo como alternativa si el archivo no llegara a cargar.

## Requisitos

```bash
apt-get install -y espeak-ng mpg123      # síntesis y decodificación
pip install lameenc numpy pocketsphinx   # codificación MP3 y reconocimiento
npm install                              # playwright, para la verificación
```

## Los tres scripts

| Script | Qué hace |
| --- | --- |
| `npm run audio:generate` | Genera `public/audio/*.mp3` desde los `audioText` de `src/data/testAudioData.js`. Idempotente: si la transcripción no cambió, no regenera (`--force` lo obliga). |
| `npm run audio:verify` | Abre un navegador real (Playwright) y comprueba que los 30 MP3 cargan, se decodifican y **avanzan al reproducirse**, más un recorrido por la interfaz pulsando «Escuchar». |
| `npm run audio:intelligibility` | Pasa cada MP3 por un reconocedor de voz offline y lo compara con su transcripción: detecta audios mudos, cortados o que no dicen lo que deberían. |

`audio:verify` necesita el sitio servido:

```bash
npm run build && npx vite preview --port 4173 &
npm run audio:verify
```

## Elección de las voces

Las variantes de `espeak-ng` de `generate-audio.py` no están puestas a ojo: se
sintetizaron frases de los propios ejercicios con unas 45 combinaciones de
voz/tono/velocidad y se midió cuánto de la transcripción recuperaba el
reconocedor. Dos conclusiones que conviene no deshacer:

- las variantes `en-gb` genéricas se entienden muy mal (0.12–0.18 de acierto);
  para inglés británico hay que usar `en-gb-x-rp`;
- bajar a ~136 palabras/min y añadir `-g 8` (pausa entre palabras) mejora
  bastante la comprensión, y para un examen de nivel viene bien.

El reconocedor usado (pocketsphinx) tiene un modelo acústico **americano**, así
que penaliza los acentos británicos aunque suenen perfectamente claros. Los
umbrales de `check-intelligibility.py` son bajos a propósito: buscan «esto es
habla inglesa acorde con el guion», no una transcripción perfecta.

## Si cambias una transcripción

1. Edita el `audioText` en `src/data/testAudioData.js`.
2. `npm run audio:generate` — regenera solo los audios afectados.
3. Revisa que las 5 preguntas de ese ejercicio sigan teniendo respuesta en el
   nuevo texto.
4. `npm run audio:verify` y `npm run audio:intelligibility`.
