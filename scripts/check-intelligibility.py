#!/usr/bin/env python3
"""
Comprueba que los MP3 generados dicen realmente lo que pone la transcripción.

`scripts/verify-audio.mjs` demuestra que el audio SUENA (carga, dura y avanza).
Esto va un paso más allá: pasa cada audio por un reconocedor de voz offline
(pocketsphinx) y lo compara con el `audioText` del ejercicio. Sirve para dos
cosas:

  • detectar un audio mudo o corrupto que aun así «se reproduce»;
  • confirmar que las 5 preguntas de cada ejercicio siguen teniendo respuesta en
    el audio, porque las palabras clave se oyen de verdad.

El reconocedor es pequeño y se equivoca a menudo, así que el umbral es
deliberadamente bajo: se busca «esto es habla inglesa que coincide a grandes
rasgos con el guion», no una transcripción perfecta.

    pip install pocketsphinx numpy
    python3 scripts/check-intelligibility.py
"""

import difflib
import os
import re
import subprocess
import sys
import tempfile
import wave

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO_DIR = os.path.join(ROOT, 'public', 'audio')

# Umbrales deliberadamente bajos. El reconocedor incluido en pocketsphinx es
# pequeño y con modelo acústico americano: penaliza el acento británico y falla
# casi siempre con cifras sueltas («four eight two», «forty-five») y nombres
# propios («SkyLine»), por buena que sea la locución. Medido sobre los 30 audios,
# los ejercicios normales quedan en 0.45–0.88 y el peor caso (un anuncio de
# aeropuerto lleno de números) en 0.30; un archivo mudo o equivocado se queda
# cerca de 0.00. El listón se pone donde separa esos dos mundos, no donde exige
# una transcripción perfecta.
MIN_SIMILARITY = 0.25   # coincidencia mínima de palabras con la transcripción
MIN_KEYWORD_HIT = 0.20  # proporción mínima de palabras clave reconocidas
MIN_RMS = 200           # por debajo de esto el audio está prácticamente mudo

sys.path.insert(0, os.path.join(ROOT, 'scripts'))
from importlib.machinery import SourceFileLoader
gen = SourceFileLoader('gen', os.path.join(ROOT, 'scripts', 'generate-audio.py')).load_module()


def decode_mp3(path):
    """MP3 → PCM mono de 16 kHz, que es lo que espera el reconocedor.

    lameenc solo codifica, así que hace falta un decodificador externo: se usa
    `mpg123` y, si no está, `ffmpeg`. mpg123 no sabe remuestrear a 16 kHz desde
    22.05 kHz, así que se decodifica a la frecuencia original y se remuestrea
    aquí con numpy.
    """
    import numpy as np

    # Se decodifica a un archivo temporal, no a una tubería: al escribir WAV por
    # stdout la cabecera lleva una longitud desconocida y el módulo `wave` no la
    # sabe leer.
    raw = None
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp:
        wav_path = tmp.name
    try:
        for cmd in (['mpg123', '-q', '-w', wav_path, '-m', path],
                    ['ffmpeg', '-y', '-v', 'quiet', '-i', path, '-ac', '1', wav_path]):
            try:
                subprocess.run(cmd, capture_output=True, check=True)
                with wave.open(wav_path) as w:
                    raw = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16)
                    rate = w.getframerate()
                if len(raw):
                    break
                raw = None
            except (FileNotFoundError, subprocess.CalledProcessError, wave.Error, EOFError):
                continue
    finally:
        os.unlink(wav_path)

    if raw is None or len(raw) == 0:
        return None, None

    if rate != 16000:
        idx = np.arange(0, len(raw), rate / 16000)
        raw = np.interp(idx, np.arange(len(raw)), raw.astype(np.float32)).astype(np.int16)
    return raw.tobytes(), 16000


def main():
    import numpy as np
    from pocketsphinx import Decoder, get_model_path

    model = get_model_path() + '/en-us'
    decoder = Decoder(hmm=model + '/en-us', lm=model + '/en-us.lm.bin',
                      dict=model + '/cmudict-en-us.dict', logfn=os.devnull)

    exercises = gen.read_exercises()
    failures = []
    checked = skipped = 0

    for ex in exercises:
        mp3 = os.path.join(AUDIO_DIR, ex['id'] + '.mp3')
        if not os.path.exists(mp3):
            failures.append(f"{ex['id']}: falta el archivo")
            continue

        pcm, rate = decode_mp3(mp3)
        if pcm is None:
            print(f"  ⚠️  {ex['id']}: no se pudo decodificar (¿falta mpg123 o ffmpeg?) — se omite")
            skipped += 1
            continue
        checked += 1

        samples = np.frombuffer(pcm, dtype=np.int16)
        rms = float(np.sqrt((samples.astype(np.float64) ** 2).mean()))
        if rms < MIN_RMS:
            print(f"  ❌ {ex['id']:8} rms={rms:5.0f}  el audio está prácticamente en silencio")
            failures.append(f"{ex['id']}: el audio está prácticamente en silencio (rms={rms:.0f})")
            continue

        decoder.start_utt()
        decoder.process_raw(pcm, False, True)
        decoder.end_utt()
        heard = decoder.hyp().hypstr if decoder.hyp() else ''

        ref = re.sub(r"[^a-z0-9' ]", ' ', ex['text'].lower()).split()
        hyp = heard.split()
        sim = difflib.SequenceMatcher(None, ref, hyp).ratio()

        stop = {'the', 'a', 'an', 'at', 'in', 'on', 'of', 'to', 'and', 'is', 'are', 'i', 'my', 'it'}
        keywords = [w for w in set(ref) if len(w) > 3 and w not in stop]
        hits = sum(1 for w in keywords if w in hyp)
        hit_rate = hits / len(keywords) if keywords else 1.0

        ok = sim >= MIN_SIMILARITY or hit_rate >= MIN_KEYWORD_HIT
        print(f"  {'✅' if ok else '❌'} {ex['id']:8} rms={rms:5.0f}  parecido={sim:.2f}  "
              f"palabras clave={hits}/{len(keywords)}  «{heard[:60]}…»")
        if not ok:
            failures.append(f"{ex['id']}: no se reconoce el guion (parecido={sim:.2f}, "
                            f"palabras clave={hits}/{len(keywords)})")

    print()
    if failures:
        print(f'❌ {len(failures)} audio(s) con problemas:')
        for f in failures:
            print('   - ' + f)
        sys.exit(1)
    if not checked:
        print('❌ No se pudo analizar ningún audio: instala mpg123 o ffmpeg.')
        sys.exit(1)
    if skipped:
        print(f'⚠️  {skipped} audio(s) omitidos por no poder decodificarlos.')
    print(f'✅ {checked} audios contienen habla inglesa acorde con su transcripción.')


if __name__ == '__main__':
    main()
