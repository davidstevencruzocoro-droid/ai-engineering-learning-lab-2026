---
id: 8
level: 3
xp: 25
title: "Semana 8 · CI/CD"
---

# Semana 8: CI/CD y automatización

## Objetivo
Diseñar un flujo de entrega continuo que valide cambios, ejecute pruebas y detecte riesgos antes del despliegue.

## Por qué importa
Sin automatización, cada entrega depende de memoria, disciplina manual y probabilidad de error humano.

## Conceptos
- CI
- CD
- pipelines
- calidad automática
- despliegue seguro

## Arquitectura
```text
Commit
  ↓
Pipeline de validación
  ↓
Tests / lint / build
  ↓
Despliegue o bloqueo
```

## Ejemplo
```yaml
steps:
  - run: npm install
  - run: npm run validate
  - run: npm run test
  - run: npm run build
```

## Profundización técnica
El ejemplo anterior es un esqueleto conceptual; un pipeline real de GitHub Actions necesita estructura completa (`name`, `on`, `jobs`) y suele cachear dependencias para no reinstalar todo en cada ejecución:

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run validate
      - run: npm test
      - run: npm run build
```

Detalles que marcan la diferencia entre "un YAML que corre" y uno confiable en equipo:
- `npm ci` en vez de `npm install`: instala exactamente las versiones fijadas en `package-lock.json`, sin resolver nada de nuevo — reproducible, y falla explícitamente si el lockfile no coincide con `package.json`, en vez de silenciosamente actualizar algo.
- `cache: 'npm'`: el runner guarda `~/.npm` entre ejecuciones, así que `npm ci` no vuelve a descargar toda la red de dependencias cada vez.
- El trigger `pull_request` + `push: branches: [main]` corre el pipeline tanto en cada PR (antes del merge) como después del merge — así un cambio nunca llega a `main` sin haber pasado por el mismo pipeline.

El patrón para que un pipeline sea más que "si falla, el repo se ve en rojo" es hacerlo bloqueante: en la configuración de protección de rama de GitHub, marcar ese job como *required status check* — así un PR literalmente no se puede fusionar si `build-and-test` no pasó, sin depender de que alguien recuerde revisarlo manualmente.

## Laboratorio
Crear un pipeline que verifique contenido, build y pruebas antes de aceptar la entrega.

## Preparación
- repositorio público o privado
- action runner o entorno de CI
- definición de calidad mínima

## Paso 1
Definir qué validaciones deben ejecutarse en cada cambio.

## Paso 2
Añadir control de calidad y señales automatizadas.

## Paso 3
Revisar fallos de pipeline y corregir la causa real.

## Verificación
```bash
npm run validate
npm run test
npm run build
```

## Errores comunes
- pipeline demasiado frágil,
- pruebas que no se ejecutan,
- dependencias sin bloqueo de versiones,
- despliegue sin validación previa.

## Debugging
Comprueba logs de cada paso y determina si la causa es configuración, código o entorno.

## Reto
Hacer que un pipeline falle por un problema real y corregirlo sin escribir cambios al azar.

## BREAK THE SYSTEM
Introducir una regresión o un config drift y observar el pipeline reaccionar.

## RECOVERY
Arreglar la configuración de manera explícita y documentar la corrección.

## Evaluación
- ¿Cada cambio tiene validación automática?
- ¿El pipeline revela la causa sin ambigüedad?
- ¿La entrega se vuelve más segura?

## Evidencia
Guardar el pipeline, historial de ejecuciones y decisiones de calidad.

## Criterio de aprobación
El estudiante debe poder explicar qué validaciones son obligatorias antes de entregar software.
