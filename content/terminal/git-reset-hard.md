---
id: terminal-git-reset-hard
command: "git reset --hard"
category: "Git"
risk: "alto"
---

# git reset --hard

## Qué hace
Mueve la rama actual a un commit específico (por defecto, `HEAD`) y **descarta** todos los cambios no comiteados en el árbol de trabajo y en el staging, sin posibilidad de recuperarlos por las vías normales.

## Cuándo usarlo
Cuando quieres descartar deliberadamente TODOS tus cambios locales no guardados y volver exactamente al último commit (o a uno anterior específico), y estás seguro de que no te importa perderlos.

## Riesgos
**Alto.** A diferencia de `git reset --soft` o `--mixed`, `--hard` no solo deshace el commit: borra el contenido de los archivos modificados en tu disco. No hay "deshacer" sencillo. Si tenías cambios importantes sin comitear, se pierden.

## Ejemplo
```bash
# Simulación segura: ejecútala en una carpeta de prueba, nunca en un proyecto real
mkdir /tmp/demo-reset && cd /tmp/demo-reset
git init
echo "version 1" > archivo.txt && git add . && git commit -m "v1"
echo "version 2 - cambio importante sin comitear" > archivo.txt
cat archivo.txt   # "version 2 - cambio importante sin comitear"

git reset --hard
cat archivo.txt   # "version 1" — el cambio desapareció, sin aviso de confirmación
```

## Ejercicio
Repite la simulación anterior en una carpeta de prueba (nunca en un proyecto real). Antes de ejecutar `git reset --hard`, predice qué va a pasar con el contenido de `archivo.txt`. Después confírmalo y explica con tus palabras la diferencia entre `--soft`, `--mixed` (por defecto) y `--hard`.

## Error común
Ejecutar `git reset --hard` pensando que solo deshace el último commit "sin tocar mis archivos" — en realidad si tenías cambios sin comitear sobre esos archivos, esos cambios desaparecen también.

## Recovery
Si el commit al que volviste seguía existiendo en el historial, `git reflog` puede ayudarte a encontrar el commit "perdido" y volver a él con `git reset --hard <hash>`. Pero los cambios que **nunca llegaron a comitearse** no están en ningún commit — el reflog no los recupera. La única defensa real es comitear (o al menos `git stash`) antes de ejecutar comandos destructivos.
