---
id: terminal-curl
command: "curl"
category: "Redes / APIs"
risk: "bajo"
---

# curl

## Qué hace
Envía una petición HTTP (u otros protocolos) desde la terminal y muestra la respuesta. Es la forma más directa de probar una API sin escribir código ni abrir un navegador.

## Cuándo usarlo
Para verificar que un endpoint propio responde como esperas, reproducir un error de API reportado por otra persona, o probar rápidamente un servicio externo antes de integrarlo en código.

## Riesgos
Bajo para peticiones GET de lectura. Ten cuidado con comandos `curl` copiados de internet que hacen POST/DELETE contra endpoints reales — revisa siempre la URL y el método antes de ejecutar un comando que no escribiste tú.

## Ejemplo
```bash
curl http://localhost:3000/api/health
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{"producto": "X", "cantidad": 2}'
curl -i http://localhost:3000/api/pedidos/999   # -i muestra también los headers de respuesta
```

## Ejercicio
Levanta cualquiera de tus APIs de laboratorio (semana 3 o posteriores) y usa `curl` para probar: un GET que debería funcionar, y un GET a un recurso que no existe. Observa el código de estado HTTP en cada caso.

## Error común
No revisar el código de estado HTTP de la respuesta (solo mirar si "salió algo") — un `curl` puede devolver un cuerpo de error 500 que parece una respuesta válida si no te fijas en el código.

## Recovery
No aplica a peticiones de lectura (GET). Si ejecutaste por error un `curl` con POST/DELETE contra datos reales, la recuperación depende de si ese endpoint tiene backups o un registro de auditoría — por eso nunca se prueban comandos de escritura contra producción.
