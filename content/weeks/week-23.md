---
id: 23
level: 5
xp: 30
title: "Semana 23 · Proyecto final II"
---

# Semana 23: Proyecto final II

## Objetivo
Construir la primera versión funcional del proyecto con enfoque en calidad y evidencia.

## Por qué importa
La construcción real revela los problemas de arquitectura, integración y prioridad.

## Conceptos
- implementación
- revisión rápida
- integración
- pruebas básicas
- mejora continua

## Arquitectura
```text
Plan
  ↓
Implementación incremental
  ↓
Validación por entregas
  ↓
Refinamiento
```

## Profundización técnica
"Implementación incremental" en la teoría suena bien; en la práctica, la forma real de no romper lo que ya funciona mientras construyes la siguiente pieza es un **smoke test**: una prueba mínima, rápida, que no verifica todo el sistema a fondo, solo que "las cosas básicas no están completamente rotas":
```javascript
// smoke-test.mjs — correr después de cada entrega, antes de seguir construyendo
async function smokeTest() {
  const checks = [
    ['El servidor responde', async () => (await fetch('http://localhost:4176/api/health')).status === 200],
    ['La página principal carga', async () => (await fetch('http://localhost:5173/')).status === 200],
    ['El flujo crítico no lanza error 500', async () => (await fetch('http://localhost:4176/api/pedidos')).status < 500]
  ];
  let fallos = 0;
  for (const [nombre, check] of checks) {
    const paso = await check().catch(() => false);
    console.log(`${paso ? '✔' : '✖'} ${nombre}`);
    if (!paso) fallos++;
  }
  if (fallos > 0) process.exit(1);
}
smokeTest();
```
No reemplaza una suite de tests completa (eso ya lo cubriste en la semana de testing) — su valor es ser tan rápido que lo corres *constantemente*, cada vez que entregas una pieza nueva, como primera señal de "¿rompí algo obvio?" antes de invertir tiempo en diagnosticar algo más sutil.

La otra práctica real para construir incrementalmente sin dejar el proyecto en un estado roto a medias es un **feature flag**: envolver una funcionalidad nueva en una condición que puedes apagar sin revertir código:
```javascript
const FEATURE_FLAGS = {
  exportarPdf: process.env.FEATURE_EXPORTAR_PDF === 'true'
};

if (FEATURE_FLAGS.exportarPdf) {
  app.get('/api/export/pdf', exportarPdfHandler);
}
```
Esto te permite integrar código nuevo al proyecto principal (en vez de dejarlo aislado en una rama que se desactualiza) incluso antes de que esté terminado — si algo falla, apagas el flag sin necesitar un rollback de código, y el resto del sistema sigue funcionando.

## Laboratorio
Entregar una versión funcional del proyecto, aunque todavía no sea perfecta.

## Preparación
- backlog mínimo,
- arquitectura base,
- validación de flujo principal

## Paso 1
Implementa la funcionalidad crítica antes de detalles secundarios.

## Paso 2
Mide fallos actuales y corrígelos en prioridad.

## Paso 3
Revisa si el proyecto sigue cumpliendo el objetivo inicial.

## Verificación
- flujo principal operativo,
- pruebas de funcionamiento,
- evidencia de entrega parcial.

## Errores comunes
- construir detalles sin base funcional,
- mezcla de requisitos no priorizados,
- no validar flujo real,
- ausencia de retroalimentación.

## Debugging
Cuando el proyecto se vuelve difícil de seguir, vuelve a los objetivos y a la funcionalidad crítica.

## Reto
Mantener una entrega útil mientras se mejora la calidad del sistema.

## BREAK THE SYSTEM
Forzar un caso real del producto para detectar errores importantes.

## RECOVERY
Corregir la causa raíz y documentar el aprendizaje importante.

## Evaluación
- ¿La solución funciona para el caso principal?
- ¿Está bien integrada?
- ¿Hay evidencia de mejora continua?

## Evidencia
Guardar entregas, pruebas y notas de iteración.

## Criterio de aprobación
El estudiante debe poder demostrar una versión útil del proyecto con un progreso claro.
