---
id: fundamento-11
week: 4
order: 1
category: "Docker y contenedores"
title: "Imagen vs contenedor: la plantilla y la instancia"
---

# Imagen vs contenedor: la plantilla y la instancia

## Pregunta de diagnóstico
Explica la diferencia entre una imagen Docker y un contenedor Docker.

## Modelo mental
- **Imagen**: una plantilla de solo lectura, inmutable, construida en capas (`docker build`). Define qué sistema de archivos, qué binarios y qué configuración tendrá cualquier cosa que se arranque a partir de ella. Vive en disco, no "corre" por sí misma.
- **Contenedor**: una instancia en ejecución de una imagen — un proceso aislado (usa los mismos mecanismos del sistema operativo que viste en la lección de procesos: namespaces y cgroups en Linux) que arranca a partir de esa plantilla. Puedes crear muchos contenedores distintos a partir de la misma imagen, igual que puedes abrir muchas instancias de un mismo programa.

La relación es la misma que entre una clase y un objeto, o entre un molde y las piezas que salen de él: la imagen no cambia cuando el contenedor corre; cualquier escritura que el contenedor haga a su sistema de archivos desaparece cuando el contenedor se destruye, a menos que se use explícitamente un volumen para persistir datos fuera del contenedor.

## En este proyecto
Este Lab usa ambos conceptos de forma deliberadamente distinta:

- **La imagen** se construye una sola vez con `npm run lab:sandbox:build`, que ejecuta `docker build` sobre `sandbox/Dockerfile`. Esa imagen queda guardada en tu máquina y lista para reutilizarse muchas veces — no necesitas reconstruirla cada vez que calificas código.
- **Los contenedores** se crean y destruyen uno por cada ejecución: cada vez que llamas a `/api/run` o `/api/grade`, `runSandbox()` en `server/index.mjs` lanza un `docker run --rm --init -i --network=none ...` nuevo — un contenedor efímero que arranca, ejecuta el código del estudiante, produce su salida, y se destruye automáticamente (`--rm`) apenas termina.

Esto es intencional por seguridad: cada ejecución de código de un estudiante parte de la MISMA imagen limpia (nunca hereda archivos ni estado de una ejecución anterior), corre sin red (`--network=none`) y con el sistema de archivos en modo solo lectura (`--read-only`), y desaparece por completo al terminar. Si el código del estudiante intentara "contaminar" el entorno para la siguiente ejecución, no podría — el siguiente contenedor nace limpio de la imagen otra vez.

## Para verificar que entendiste
- Si reconstruyes la imagen con `npm run lab:sandbox:build` después de cambiar `sandbox/Dockerfile`, ¿afecta eso a contenedores que ya terminaron de correr antes del rebuild?
- ¿Por qué `--rm` es importante para la seguridad de calificar código de estudiantes en un sandbox compartido, más allá de solo "ahorrar espacio en disco"?
- Si un contenedor pudiera escribir cambios permanentes a la imagen desde la que arrancó, ¿qué riesgo de seguridad introduciría eso entre ejecuciones sucesivas de distintos estudiantes?

## Caso avanzado
El `sandbox/Dockerfile` real de este proyecto es deliberadamente simple — y esa simplicidad tiene un costo medible:
```text
FROM node:22-bookworm-slim
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 default-jdk-headless sqlite3 \
  && rm -rf /var/lib/apt/lists/*
COPY runner.py /usr/local/bin/ai-lab-runner.py
ENTRYPOINT ["python3", "/usr/local/bin/ai-lab-runner.py"]
```
Es una sola etapa (no usa *multi-stage build*) que instala Node, Python, un JDK completo y sqlite3 todos juntos en la misma imagen final. Eso hace la imagen bastante más pesada de lo necesario para ejecutar, por ejemplo, un fragmento de JavaScript — y aumenta la superficie de ataque, porque un contenedor que solo necesitaba ejecutar JS igual tiene un JDK completo disponible adentro si algo saliera mal.

Un Dockerfile de producción más cuidadoso normalmente separaría esto en imágenes distintas por lenguaje (una imagen solo-Node, una solo-Python, una solo-Java), o usaría *multi-stage builds* para instalar herramientas de compilación en una etapa y copiar solo los binarios finales a la imagen final, dejando fuera compiladores y gestores de paquetes que un atacante podría aprovechar si lograra ejecutar código fuera del sandbox esperado.

La decisión aquí fue un trade-off consciente: una sola imagen más grande y más simple de mantener (un Dockerfile, un build), a cambio de no tener la superficie mínima ideal — aceptable porque la verdadera barrera de seguridad no es el tamaño de la imagen, es el aislamiento del contenedor en tiempo de ejecución (`--network=none`, `--read-only`, `--cap-drop=ALL`, usuario sin privilegios).

**Para verificar que entendiste (avanzado):** ¿por qué tener un JDK completo instalado dentro de la imagen aumenta el riesgo incluso para una ejecución que solo corre JavaScript, aunque el `ENTRYPOINT` nunca invoque Java directamente?
