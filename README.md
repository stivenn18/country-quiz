# 🌍 Country Quiz App

Aplicación de quiz sobre países del mundo desarrollada como parte de la actividad académica del semestre 6 - Frontend.

## Stack

- **React ** + **TypeScript**
- **React Router v6** — enrutamiento completo (/, /quiz, /result)
- **Tailwind CSS** — estilos responsivos y dark mode nativo
- **Vitest** + **Testing Library** — 4 pruebas unitarias
- **ESLint** — calidad de código
- **Vite** — bundler

## Características

- ✅ 10 preguntas generadas desde la API de restcountries.com
- ✅ 4 opciones por pregunta con feedback inmediato
- ✅ Navegación libre entre preguntas (dots de progreso)
- ⏱ **Timer** de 15 segundos por pregunta (respuesta incorrecta automática al expirar)
- 🏆 **High Score** persistido con localStorage
- 🌙 **Dark / Light Mode** con clases `dark:` de Tailwind
- 🔊 **Efectos de sonido** al acertar o fallar

## Instalación

```bash
npm install
npm run dev
```

## Tests

```bash
npm run test
```

## Lint

```bash
npm run lint
```

## Build para producción

```bash
npm run build
```

## Rutas

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | `Home` | Pantalla de inicio con high score |
| `/quiz` | `Quiz` | Quiz activo con timer y opciones |
| `/result` | `Result` | Resultados finales y resumen |

## Despliegue

La aplicación está desplegada en Netlify con CI/CD automático desde la rama `main`.
