# Juego de Ahorcado

Juego del ahorcado en el navegador hecho con TypeScript, HTML y CSS. Adivina palabras del mundo de la programación letra por letra antes de quedarte sin vidas.

## Cómo correr el proyecto

**1. Instalar dependencias**
```bash
npm install
```

**2. Compilar el TypeScript**
```bash
npm run build
```

**3. Abrir `index.html` en el navegador**

> También puedes usar `npm run dev` para que el proyecto se recompile automáticamente cada vez que guardes cambios en el código.

## Estructura

```
├── src/
│   └── game.ts       # lógica del juego
├── dist/             # archivos compilados (generado automáticamente)
├── index.html
├── styles.css
├── tsconfig.json
└── package.json
```

## Cómo jugar

- Tienes 6 vidas para adivinar la palabra
- Haz clic en las letras del teclado o usa el teclado físico
- Si fallas 6 veces, el ahorcado se completa y pierdes
