---
id: fundamento-03
week: 1
order: 3
category: "Git y control de versiones"
title: "Commit, push y merge: qué registra Git realmente"
---

# Commit, push y merge: qué registra Git realmente

## Pregunta de diagnóstico
Explica qué hace `git commit`, qué hace `git push` y qué hace un `merge`.

## Modelo mental
- **`git commit`**: congela una fotografía del estado actual de los archivos *en tu copia local*. No se comunica con nadie más. Cada commit tiene un hash único, un autor, una fecha y un mensaje, y apunta a su commit "padre" — por eso el historial es una cadena, no una lista plana.
- **`git push`**: envía los commits que tienes localmente y que el repositorio remoto no tiene todavía. Es la única operación de las tres que toca la red.
- **`merge`**: combina el historial de dos ramas en una. Si ambas ramas modificaron líneas distintas, Git lo resuelve solo. Si modificaron las mismas líneas de forma distinta, Git se detiene y te pide resolver el conflicto a mano.

## En este proyecto
Puedes ver esto en la historia real de este repositorio con `git log --oneline`. Los últimos commits antes de esta lección fueron, por ejemplo:

```
4959126 Reestructura el dashboard en módulos (una vista a la vez) + Sesiones de mentoría
e9c1a3d Adopta el paquete de mentoría de Ingeniería de Sistemas como CLAUDE.md raíz
819f300 Corrige 3 fallos reales encontrados en auditoría manual
585812f Break the System interactivo: ejercicio calificado lab-06 con bugs plantados
8fe2bf2 Log Analyzer + Mapa de dominio personal
```

Cada línea es un commit: una fotografía con su propio hash corto (`4959126`, etc.) y un mensaje que explica el *por qué*, no solo el *qué*. Nota que `819f300` ("Corrige 3 fallos reales...") es un commit separado de los que agregaron la funcionalidad — esa es la disciplina de "cambios pequeños y reversibles" de la que habla este mismo mentor: si algo sale mal, puedes volver exactamente a `585812f` sin perder el trabajo de corrección de bugs hecho después.

Durante esta sesión también viviste un bloqueo real de Git: no pude ejecutar `git commit` porque `git config user.name` y `user.email` no estaban configurados — y por protocolo de seguridad, yo (el agente) tengo prohibido ejecutar `git config` directamente. Tú tuviste que correr esos dos comandos con el prefijo `!`. Eso es control de cambios funcionando como debería: una acción que modifica configuración global requiere que la persona, no el agente, la autorice y ejecute.

## Para verificar que entendiste
- Si haces `git commit` pero nunca haces `git push`, ¿el repositorio remoto (GitHub) se entera de tu cambio?
- ¿Por qué cada commit en el log tiene un hash distinto aunque dos commits cambien el mismo archivo?
- Si dos personas editan la misma línea de `app.js` en ramas distintas y luego intentan un `merge`, ¿qué tiene que pasar para que Git termine la operación?

## Caso avanzado
Este mismo repositorio vivió un caso real de riesgo de conflicto: durante este proyecto, dos agentes de IA (Claude Code y un agente de GitHub Copilot) estuvieron editando el mismo directorio de trabajo en paralelo, sin coordinarse directamente entre sí. Esto es, en esencia, el mismo riesgo que dos personas trabajando sobre la misma rama sin hacer `pull` entre medio.

La mitigación que se usó no fue mágica ni automática: antes de cada operación que pudiera pisar trabajo ajeno (leer, editar, o sobre todo antes de un commit), se ejecutaba `git status` para observar qué había cambiado desde la última vez. Esto no previene un conflicto de Git en sí — previene algo peor: sobrescribir sin darte cuenta trabajo que otro proceso (humano o IA) ya había hecho, *antes* de que Git tuviera oportunidad de detectarlo como conflicto.

Si en cambio hubiera ocurrido un conflicto real de `merge` (ambos agentes modificando la misma línea de un archivo ya comiteado en ramas o momentos distintos), Git se habría detenido a mitad del merge y marcado el archivo con marcadores de conflicto:
```text
<<<<<<< HEAD
tu versión de la línea
=======
la versión del otro commit
>>>>>>> otra-rama
```
Resolver eso exige decidir manualmente cuál versión (o combinación) es la correcta, borrar los marcadores, y hacer `git add` + `git commit` para cerrar el merge. Ni Git ni ninguna IA pueden decidir eso por ti de forma segura — requiere entender la intención detrás de ambos cambios.

**Para verificar que entendiste (avanzado):** si dos agentes hubieran hecho cada uno un commit distinto sobre el mismo archivo pero en líneas completamente diferentes (sin solaparse), ¿Git habría necesitado intervención manual para el merge, o lo habría resuelto solo? ¿Por qué?
