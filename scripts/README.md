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
