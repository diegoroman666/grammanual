# GramManual

Aplicación React + Vite para aprender gramática inglesa.

## Audios de «Test Audio»

Los 30 ejercicios de comprensión auditiva se sirven como MP3 pregenerados desde
`public/audio/`. **No** se sintetizan en el navegador: hacerlo dejaba la sección
muda en cualquier dispositivo sin voces en inglés instaladas. Para regenerarlos o
verificarlos, ver [`scripts/README.md`](scripts/README.md):

```bash
npm run audio:generate         # regenera los MP3 desde las transcripciones
npm run audio:verify           # comprueba en un navegador real que suenan
npm run audio:intelligibility  # comprueba que dicen lo que deberían
```

## Desarrollo

```bash
npm install
npm run dev
npm run build
npm run lint
```

---

Este proyecto usa la plantilla de React en Vite con HMR y unas reglas de ESLint.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
