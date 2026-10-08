---
id: terminal-git-status
command: "git status"
category: "Git"
risk: "bajo"
---

# git status

## Qué hace
Muestra el estado actual del repositorio: qué archivos están modificados, cuáles están en staging (listos para commit) y cuáles no están rastreados por Git.

## Cuándo usarlo
Antes de cualquier commit, y antes de cualquier comando que pueda descartar cambios (`checkout`, `reset`, `clean`). Es el comando que deberías ejecutar casi reflejamente antes de tocar nada destructivo.

## Riesgos
Ninguno — es de solo lectura, no modifica nada.

## Ejemplo
```bash
git status
# On branch main
# Changes not staged for commit:
#   modified:   app/js/app.js
# Untracked files:
#   docs/NUEVO.md
```

## Ejercicio
Modifica un archivo cualquiera de este repo, crea uno nuevo sin guardarlo en git, y ejecuta `git status`. Identifica en la salida cuál aparece como "modified" y cuál como "untracked", y explica la diferencia con tus palabras.

## Error común
Asumir que "no sale nada raro en status" significa que es seguro ejecutar un comando destructivo sobre TODO el repositorio — status solo te dice el estado en este momento, no lo que un comando posterior hará.

## Recovery
No aplica: `git status` nunca necesita deshacerse.
