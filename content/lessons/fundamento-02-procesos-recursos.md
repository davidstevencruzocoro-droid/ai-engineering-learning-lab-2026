---
id: fundamento-02
week: 1
order: 2
category: "Sistemas operativos"
title: "Proceso, hilo, RAM y almacenamiento: quién usa qué"
---

# Proceso, hilo, RAM y almacenamiento: quién usa qué

## Pregunta de diagnóstico
Explica la diferencia entre un proceso y un hilo, y entre memoria RAM y almacenamiento en disco.

## Modelo mental
- **Proceso:** una instancia en ejecución de un programa, con su propio espacio de memoria aislado. El sistema operativo le asigna un PID (identificador numérico) y recursos (memoria, descriptores de archivo, sockets de red).
- **Hilo (thread):** una línea de ejecución *dentro* de un proceso. Un proceso puede tener uno o varios hilos, y todos comparten la misma memoria del proceso (por eso compartir datos entre hilos es rápido pero peligroso si no se sincroniza).
- **RAM:** memoria volátil, rápida, donde viven los procesos mientras corren. Se borra al apagar o matar el proceso.
- **Almacenamiento (disco):** persistente, más lento, sobrevive a reinicios. Un proceso lee/escribe ahí explícitamente (abrir un archivo, escribir en una base de datos).

## En este proyecto
Cuando corres `npm run lab:server`, el sistema operativo crea un **proceso** Node.js nuevo con su propio PID. Lo viviste literalmente en esta sesión: tuviste un error `EADDRINUSE` en el puerto 4176 porque un proceso anterior (un PID específico, visible con `netstat -ano | findstr 4176`) seguía vivo y ocupando ese puerto — tuviste que `taskkill //PID X //F` para matarlo antes de levantar el nuevo.

Dentro de ese único proceso de `server/index.mjs`, Node.js usa un solo hilo principal de JavaScript (el "event loop"), pero las operaciones costosas — como ejecutar un contenedor Docker en `/api/run` o esperar la respuesta de Ollama en `/api/mentor` — no bloquean ese hilo: se delegan a operaciones asíncronas (`await`, promesas) que el sistema operativo resuelve por debajo.

Sobre RAM vs disco: mientras el servidor corre, el contenido de `generated/content.json` que `data.js` importó vive en RAM (rápido de leer, se pierde si matas el proceso). Pero el archivo `generated/content.json` en sí vive en disco — por eso `npm run content:build` tiene que **escribirlo a disco** cada vez que cambias un `.md` en `content/`, o el cambio nunca se refleja la próxima vez que algo lo lea.

## Para verificar que entendiste
- ¿Por qué matar el proceso de Node (PID específico) libera el puerto 4176, pero no borra los archivos en `content/`?
- Si abres dos pestañas del navegador apuntando al mismo Vite dev server, ¿son dos procesos distintos o el mismo? ¿Y si abres dos terminales corriendo `npm run lab:server` cada una?
- ¿Qué pasaría con los datos de `generated/content.json` si el servidor se cae a mitad de una petición, comparado con qué pasaría si se corrompiera el archivo en disco?

## Caso avanzado
Node.js ejecuta tu JavaScript en un solo hilo — pero este Lab maneja múltiples ejecuciones de código "al mismo tiempo" sin romperse. ¿Cómo? En `server/index.mjs` hay dos variables de estado compartidas entre TODAS las peticiones que llegan al mismo proceso:

```text
const activeRuns = new Set();
const requestCounts = new Map();
```

`activeRuns` lleva la cuenta de cuántos contenedores sandbox están corriendo ahora mismo, en cualquier petición de cualquier usuario. `runSandbox()` la revisa así:

```text
if (activeRuns.size >= MAX_CONCURRENT_RUNS) {
  throw new Error('El runner está ocupado...');
}
const containerName = `ai-lab-${randomUUID()}`;
activeRuns.add(containerName);
```

Esto es exactamente el tipo de código donde, en un lenguaje con hilos reales (Java, por ejemplo), dos hilos podrían ejecutar el `if` al mismo tiempo, ambos ver `activeRuns.size < MAX_CONCURRENT_RUNS`, y ambos añadir un contenedor — superando el límite sin que ninguna línea de código esté "mal". Eso es una condición de carrera clásica.

Aquí NO pasa, y la razón es precisa: entre el `if` y el `activeRuns.add(...)` no hay ningún `await`. En JavaScript de un solo hilo, una secuencia de código síncrono (sin `await` en medio) se ejecuta de principio a fin sin que el motor pueda "cambiar" a atender otra petición a la mitad. El single-thread de Node no te protege de condiciones de carrera en general — te protegería en este caso concreto porque no cede el control del hilo entre la verificación y la reserva.

**Para verificar que entendiste (avanzado):** si alguien reescribiera ese fragmento como `if (activeRuns.size >= MAX_CONCURRENT_RUNS) throw ...; await algunaValidacionAsincrona(); activeRuns.add(containerName);` (insertando un `await` entre la verificación y el `add`), ¿por qué ese cambio sí introduciría una condición de carrera real, incluso en un Node.js de un solo hilo?
