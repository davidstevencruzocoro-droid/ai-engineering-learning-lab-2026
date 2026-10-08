---
id: terminal-docker-logs
command: "docker logs"
category: "Docker"
risk: "bajo"
---

# docker logs

## Qué hace
Muestra la salida estándar (stdout/stderr) de un contenedor, es decir, lo que el proceso dentro del contenedor ha ido imprimiendo. Con `-f` sigue el log en tiempo real (como `tail -f`).

## Cuándo usarlo
Es el primer comando a ejecutar cuando un contenedor "no funciona", se reinicia solo, o responde con errores — antes de adivinar, mira qué dice el propio proceso.

## Riesgos
Ninguno — es de solo lectura. El único cuidado real es no pegar logs con datos sensibles (tokens, contraseñas) en un canal público al compartirlos para pedir ayuda.

## Ejemplo
```bash
docker logs mi_postgres --tail 50
docker logs -f mi_api   # seguir en vivo mientras reproduces el problema
```

## Ejercicio
Levanta un contenedor que falle a propósito (por ejemplo, una imagen de base de datos con una variable de entorno obligatoria sin definir) y usa `docker logs` para encontrar el mensaje de error exacto que explica por qué no arrancó.

## Error común
Reiniciar el contenedor repetidamente "a ver si arranca" sin leer el log entre intento e intento — si la causa es la misma, el resultado va a ser el mismo.

## Recovery
No aplica: `docker logs` nunca necesita deshacerse.
