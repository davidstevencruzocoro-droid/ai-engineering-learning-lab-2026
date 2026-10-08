---
id: terminal-npm-install-run
command: "npm install + npm run"
category: "Node.js"
risk: "bajo"
---

# npm install + npm run

## Qué hace
`npm install` lee `package.json` y descarga todas las dependencias declaradas a `node_modules/`. `npm run <script>` ejecuta uno de los scripts definidos en la sección `"scripts"` de `package.json` (por ejemplo `npm run build`, `npm run dev`).

## Cuándo usarlo
`npm install` cada vez que clonas un proyecto por primera vez, o cada vez que `package.json`/`package-lock.json` cambiaron (por ejemplo tras un `git pull`). `npm run <script>` para ejecutar cualquier tarea que el proyecto haya definido, en vez de recordar comandos largos de memoria.

## Riesgos
Bajo, pero real: instalar dependencias ejecuta los "scripts de instalación" que algunos paquetes traen, lo cual es código de terceros corriendo en tu máquina. No instales paquetes de fuentes que no conozcas sin revisar qué son.

## Ejemplo
```bash
npm install
npm run validate
npm run test
npm run build
```
Este propio proyecto usa exactamente esta secuencia (ver `package.json` → `scripts`).

## Ejercicio
Abre `package.json` de este proyecto y lista todos los scripts definidos en `"scripts"`. Para cada uno, explica en una frase qué hace, sin ejecutarlo primero — después ejecútalo y confirma si tu predicción era correcta.

## Error común
Borrar `node_modules` y reinstalar como primer intento de "arreglar" cualquier error — a veces funciona, pero muchas veces solo esconde el problema real (una versión de dependencia incompatible, un script mal configurado).

## Recovery
Si `node_modules` queda en un estado raro, es seguro borrarlo y reinstalar: `rm -rf node_modules && npm install` (en Windows: `Remove-Item -Recurse -Force node_modules`). `node_modules` nunca debe comitearse a git — siempre es regenerable desde `package-lock.json`.
