# PLAN: Mejoras en Ejercicios de Gramática

## Información Recopilada
- **Archivo principal**: `src/components/Ejercicios.jsx` (13 ejercicios actuales)
- **Estilos**: `src/components/Ejercicios.css`
- **Ruteo**: `src/App.jsx` con react-router-dom
- **Componentes**: Layout con navegación

## Necesidades del Usuario
1. **Navegación rápida**: Al seleccionar botones de filtro (audio, lectura, etc.), ir directamente a esas preguntas
2. **Más preguntas**: Agregar 50 preguntas en total (actualmente hay 13, faltan 37)
3. **Más interactivo**: Mejorar la experiencia de usuario
4. **GitHub**: Actualizar repositorio
5. **Build**: Generar app-debug llamado "grammanual"

## Plan de Implementación

### Fase 1: Actualizar Ejercicios.jsx con 50 preguntas
- Mantener estructura actual de tipos: complete, reading, audio, slash, singular
- Agregar 37 preguntas nuevas distribuidas en los 5 tipos
- Añadir navegación automática al seleccionar filtro

### Fase 2: Mejorar interactividad
- Agregar scroll suave hacia el ejercicio al filtrar
- Añadir indicador visual de progreso por tipo
- Agregar animaciones CSS
- Mejorar feedback visual

### Fase 3: GitHub y Build
- Git add, commit, push
- npm run build

## Archivos a Editar
1. `src/components/Ejercicios.jsx` - Principal
2. `src/components/Ejercicios.css` - Estilos adicionales

## Preguntas a Crear (37 nuevas)
- **Completar (10)**: Verbos regulares e irregulares
- **Lectura (8)**: Textos cortos con preguntas
- **Audio (7)**: Diálogos para escuchar
- **Pasado/Presente (6)**: Comparaciones
- **Singular/Plural (6)**: Sujeto-verbo agreement

