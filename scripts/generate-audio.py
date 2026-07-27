#!/usr/bin/env python3
"""
Genera los MP3 de la sección «Test Audio» a partir de las transcripciones.

¿Por qué existe este script?
────────────────────────────
La sección Test Audio leía cada ejercicio con la Web Speech API del navegador
(`speechSynthesis`). Eso funciona en un PC con voces instaladas, pero en muchos
dispositivos el navegador NO trae ninguna voz en inglés: `getVoices()` devuelve
una lista vacía y cada `speak()` termina en `error: synthesis-failed`. Resultado:
el alumno pulsa «Escuchar», no oye NADA y encima pierde una reproducción.

La solución es no depender del dispositivo: se pre-generan aquí archivos MP3
reales que se sirven desde el propio sitio (`/audio/*.mp3`), igual para todos.

Uso
───
    pip install lameenc numpy
    apt-get install espeak-ng
    python3 scripts/generate-audio.py

Lee las transcripciones (`audioText`) de src/data/testAudioData.js y escribe
public/audio/<id>.mp3. Es idempotente: si el MP3 ya existe y la transcripción no
cambió, no lo vuelve a generar (usa el manifiesto public/audio/manifest.json).
"""

import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
import wave

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'src', 'data', 'testAudioData.js')
OUT_DIR = os.path.join(ROOT, 'public', 'audio')
MANIFEST = os.path.join(OUT_DIR, 'manifest.json')

# Perfiles de voz: (voz espeak-ng, tono 0-99, velocidad en palabras/min).
#
# Las variantes NO están elegidas a ojo. Se sintetizaron frases de los propios
# ejercicios con ~45 combinaciones de voz/tono/velocidad y se pasaron por un
# reconocedor de voz offline (pocketsphinx), midiendo cuánto de la transcripción
# recuperaba. Estas seis son las que mejor puntuaron manteniendo un timbre
# claramente distinto entre sí, que es lo que pide la sección (una voz diferente
# por ejercicio).
#
# Dos hallazgos que conviene no deshacer:
#   • las variantes `en-gb` genéricas se entienden fatal (0.12–0.18 de acierto);
#     para el inglés británico hay que usar `en-gb-x-rp`, que llega a 0.46–0.56.
#   • bajar de ~136 palabras/min y añadir `-g 8` (pausa entre palabras) mejora
#     bastante la comprensión, y de paso viene bien para un examen de nivel.
VOICE_PROFILES = {
    ('en-US', 'female'): ('en-us+f5', 50, 138),
    ('en-US', 'male'):   ('en-us+edward', 35, 138),
    ('en-GB', 'female'): ('en-gb-x-rp+f2', 54, 134),
    ('en-GB', 'male'):   ('en-gb-x-rp+edward', 40, 134),
    ('en-AU', 'female'): ('en-us+f2', 56, 136),
    ('en-AU', 'male'):   ('en-us+m6', 35, 136),
}
DEFAULT_PROFILE = ('en-us+f5', 50, 138)

MP3_BITRATE = 32      # kbps, mono: de sobra para voz y ~4 KB por segundo
SAMPLE_RATE = 22050   # el que produce espeak-ng


def read_exercises():
    """Extrae (id, voiceKind, gender, audioText) del archivo de datos.

    Se parsea con expresiones regulares en vez de importar el módulo para que el
    script no necesite Node ni una build previa.
    """
    src = open(DATA, encoding='utf-8').read()

    # Los ejercicios usan `...V.usF`, así que hay que resolver el alias a su
    # voiceKind/gender leyendo la tabla V del propio archivo.
    voice_alias = {}
    for name, body in re.findall(r"(\w+):\s*\{([^}]*voiceKind[^}]*)\}", src):
        kind = re.search(r"voiceKind:\s*'([^']+)'", body)
        gender = re.search(r"gender:\s*'([^']+)'", body)
        if kind and gender:
            voice_alias[name] = (kind.group(1), gender.group(1))

    exercises = []
    # Cada ejercicio: id, luego (opcional) speaker, luego ...V.xxx, luego audioText.
    pattern = re.compile(
        r"id:\s*'(t\d+-e\d+)'.*?\.\.\.V\.(\w+),.*?audioText:\s*\n?\s*(\"(?:[^\"\\]|\\.)*\")",
        re.S,
    )
    for ex_id, alias, raw_text in pattern.findall(src):
        text = json.loads(raw_text)
        kind, gender = voice_alias.get(alias, ('en-US', 'female'))
        exercises.append({'id': ex_id, 'voiceKind': kind, 'gender': gender, 'text': text})
    return exercises


def synth_wav(text, profile, wav_path):
    voice, pitch, speed = profile
    subprocess.run(
        ['espeak-ng', '-v', voice, '-p', str(pitch), '-s', str(speed),
         '-g', '8',            # pausa extra entre palabras: se entiende mejor
         '-w', wav_path, text],
        check=True, capture_output=True,
    )


def wav_to_mp3(wav_path, mp3_path):
    import numpy as np
    import lameenc

    with wave.open(wav_path) as w:
        assert w.getnchannels() == 1 and w.getsampwidth() == 2
        rate = w.getframerate()
        pcm = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16)

    # Normaliza a un pico de -1 dBFS: espeak deja bastante margen y en un móvil,
    # con ruido alrededor, un audio bajo se percibe como «no se escucha».
    peak = int(np.abs(pcm).max()) or 1
    pcm = (pcm.astype(np.float32) * (29000.0 / peak)).clip(-32768, 32767).astype(np.int16)

    encoder = lameenc.Encoder()
    encoder.set_bit_rate(MP3_BITRATE)
    encoder.set_in_sample_rate(rate)
    encoder.set_channels(1)
    encoder.set_quality(2)
    data = encoder.encode(pcm.tobytes()) + encoder.flush()
    with open(mp3_path, 'wb') as f:
        f.write(bytes(data))

    return len(pcm) / rate


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    exercises = read_exercises()
    if not exercises:
        sys.exit('No se encontró ningún ejercicio en ' + DATA)

    manifest = {}
    if os.path.exists(MANIFEST):
        try:
            manifest = json.load(open(MANIFEST, encoding='utf-8')).get('audios', {})
        except (ValueError, OSError):
            manifest = {}

    force = '--force' in sys.argv
    new_manifest = {}
    generated = skipped = 0

    for ex in exercises:
        profile = VOICE_PROFILES.get((ex['voiceKind'], ex['gender']), DEFAULT_PROFILE)
        fingerprint = hashlib.sha256(
            (ex['text'] + '|' + '|'.join(map(str, profile)) + f'|{MP3_BITRATE}').encode()
        ).hexdigest()[:16]
        mp3_path = os.path.join(OUT_DIR, ex['id'] + '.mp3')
        prev = manifest.get(ex['id'])

        if not force and prev and prev.get('sha') == fingerprint and os.path.exists(mp3_path):
            new_manifest[ex['id']] = prev
            skipped += 1
            continue

        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp:
            wav_path = tmp.name
        try:
            synth_wav(ex['text'], profile, wav_path)
            duration = wav_to_mp3(wav_path, mp3_path)
        finally:
            os.unlink(wav_path)

        new_manifest[ex['id']] = {
            'sha': fingerprint,
            'voice': profile[0],
            'seconds': round(duration, 1),
            'bytes': os.path.getsize(mp3_path),
        }
        generated += 1
        print(f"  {ex['id']:8} {profile[0]:16} {duration:5.1f}s  "
              f"{os.path.getsize(mp3_path)/1024:6.1f} KB")

    with open(MANIFEST, 'w', encoding='utf-8') as f:
        json.dump({'audios': new_manifest}, f, indent=2, sort_keys=True)
        f.write('\n')

    total = sum(a['bytes'] for a in new_manifest.values())
    print(f"\n{generated} generados, {skipped} sin cambios · "
          f"{len(new_manifest)} audios · {total/1024/1024:.2f} MB en total")


if __name__ == '__main__':
    main()
