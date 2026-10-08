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
