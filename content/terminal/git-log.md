---
id: terminal-git-log
command: "git log"
category: "Git"
risk: "bajo"
---

# git log

## Qué hace
Muestra el historial de commits del repositorio: autor, fecha, mensaje y el hash único de cada commit.

## Cuándo usarlo
Para entender qué ha pasado en el proyecto, encontrar en qué commit se introdujo un cambio (útil antes de usar `git bisect`), o copiar el hash de un commit al que quieras volver.

## Riesgos
Ninguno — es de solo lectura.

## Ejemplo
```bash
git log --oneline -10
# a1b2c3d Corrige cálculo de XP al desmarcar una semana
# e4f5g6h Añade validación de email en el formulario
```
`--oneline` resume cada commit en una línea; `-10` limita a los últimos 10.

## Ejercicio
Ejecuta `git log --oneline` en este repositorio tras el primer commit y busca el hash corto del commit más reciente. Después prueba `git log -p -1` para ver el diff completo de ese commit.

## Error común
No usar ningún filtro y quedarte perdido en cientos de líneas de salida en un repositorio con mucho historial — aprende `--oneline`, `-n`, `--author`, y `--grep` pronto.

## Recovery
No aplica: `git log` nunca necesita deshacerse.
