---
id: terminal-git-branch
command: "git branch + git checkout -b"
category: "Git"
risk: "bajo"
---

# git branch + git checkout -b

## Qué hace
`git branch` lista las ramas existentes. `git checkout -b nombre-rama` (o `git switch -c nombre-rama`) crea una rama nueva a partir de donde estás y te mueve a ella.

## Cuándo usarlo
Antes de empezar cualquier cambio que no sea trivial, para no trabajar directamente sobre `main`/`master`. Así tu rama principal se mantiene siempre en un estado estable.

## Riesgos
Si tienes cambios sin comitear y cambias de rama, Git puede negarse a cambiar (para no perderlos) o, en algunos casos, llevarse esos cambios sin commitear contigo a la nueva rama — lo cual puede confundirte si no lo esperabas. Revisa `git status` antes de cambiar de rama.

## Ejemplo
```bash
git branch
# * main
git checkout -b feature/sistema-pistas
# Switched to a new branch 'feature/sistema-pistas'
```

## Ejercicio
Crea una rama nueva, haz un cambio pequeño y comitéalo ahí. Vuelve a `main` con `git checkout main` y comprueba que ese cambio NO aparece en `main` (porque vive solo en tu rama).

## Error común
Acumular semanas de trabajo en una sola rama gigante sin comitear nada — las ramas son baratas, úsalas para unidades de trabajo pequeñas y revisables.

## Recovery
Si creaste una rama con el nombre equivocado: `git branch -m nombre-nuevo` la renombra sin perder nada. Si quieres borrar una rama ya fusionada: `git branch -d nombre-rama`.
