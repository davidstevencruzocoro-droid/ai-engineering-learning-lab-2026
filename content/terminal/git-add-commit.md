---
id: terminal-git-add-commit
command: "git add + git commit"
category: "Git"
risk: "bajo"
---

# git add + git commit

## Qué hace
`git add <archivo>` mueve cambios al área de staging (lo que entrará en el próximo commit). `git commit -m "mensaje"` guarda esos cambios en el historial del repositorio con un mensaje que explica el porqué.

## Cuándo usarlo
Cada vez que termines una unidad de trabajo coherente y verificable (no "cada 5 minutos", ni "todo el día en un solo commit gigante"). Un buen punto de referencia: si no puedes resumir el cambio en una frase, probablemente deberías dividirlo.

## Riesgos
`git add .` o `git add -A` puede incluir archivos que no querías comitear (credenciales, `node_modules`, archivos temporales) si no tienes un `.gitignore` correcto. Siempre revisa `git status` antes de comitear algo añadido con `-A`.

## Ejemplo
```bash
git add app/js/app.js
git status
git commit -m "Corrige cálculo de XP al desmarcar una semana"
```

## Ejercicio
Haz un cambio pequeño y real en un archivo de este proyecto. Añádelo al staging, revisa con `git status` que solo está ese archivo, y comitea con un mensaje que explique el porqué, no el qué.

## Error común
Escribir mensajes de commit como "cambios" o "fix" sin contexto. Dentro de un mes, ni tú vas a recordar qué arreglaba ese commit.

## Recovery
Si comiteaste algo por error pero NO lo has subido a un remoto (`git push`): `git reset --soft HEAD~1` deshace el último commit y deja los cambios en staging, sin perderlos. Si ya lo subiste, nunca reescribas el historial sin avisar a quien más use ese repositorio.
