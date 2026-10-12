---
id: 20
level: 5
xp: 25
title: "Semana 20 · Performance"
---

# Semana 20: Performance y optimización

## Objetivo
Detectar cuellos de botella y mejorar la eficiencia sin perder claridad ni estabilidad.

## Por qué importa
Una solución que funciona pero es demasiado lenta o cara no es una solución completa.

## Conceptos
- latencia
- throughput
- profiling
- caché
- optimización

## Arquitectura
```text
Sistema
  ↓
Métricas
  ↓
Cuello de botella
  ↓
Optimización
```

## Profundización técnica
El error más común de "optimización" es medir con el promedio. Si 99 peticiones tardan 50ms y 1 tarda 8 segundos, el promedio (~130ms) esconde por completo el problema real. Por eso el rendimiento de producción se mide en **percentiles**, no en promedio:
- **p50** (mediana): la experiencia típica.
- **p95**: solo el 5% de las peticiones son peores que esto — suele ser el número que más le importa a un usuario real, porque captura la "mala suerte ocasional" sin dejarse engañar por un único caso extremo.
- **p99**: el 1% peor — relevante cuando tienes muchísimo tráfico, porque ese 1% puede ser miles de usuarios reales.

Calcularlos sobre un arreglo de tiempos medidos es directo:
```javascript
function percentil(tiempos, p) {
  const ordenados = [...tiempos].sort((a, b) => a - b);
  const indice = Math.ceil((p / 100) * ordenados.length) - 1;
  return ordenados[Math.max(0, indice)];
}
// percentil(tiempos, 50), percentil(tiempos, 95), percentil(tiempos, 99)
```

La causa más común y más cara de una cola larga de p95/p99 en aplicaciones con base de datos es el problema **N+1**: pedir una lista de N elementos con una consulta, y luego hacer una consulta adicional por cada uno de esos N elementos para traer un dato relacionado:
```javascript
// N+1: una consulta por cada pedido (lento con muchos pedidos)
const pedidos = await db.query('SELECT * FROM pedidos');
for (const pedido of pedidos) {
  pedido.cliente = await db.query('SELECT * FROM clientes WHERE id = ?', [pedido.cliente_id]);
}

// Una sola consulta adicional con JOIN o IN(...), sin importar cuántos pedidos haya
const pedidos = await db.query(`
  SELECT pedidos.*, clientes.nombre AS cliente_nombre
  FROM pedidos JOIN clientes ON clientes.id = pedidos.cliente_id
`);
```
Con 10 pedidos la diferencia es invisible; con 10,000 pedidos, la primera versión hace 10,001 viajes a la base de datos en vez de 1 — y cada viaje tiene latencia de red, no solo de cómputo. Esto es, en la práctica, la causa número uno de que "funciona rápido con datos de prueba y se arrastra en producción".

Antes de optimizar cualquier cosa, un perfilador (profiler) te dice *dónde* se va el tiempo realmente, en vez de adivinar: `node --prof app.js` genera un registro que `node --prof-process` convierte en un reporte legible de qué funciones consumen más tiempo de CPU — la evidencia que reemplaza la intuición de "esto debe ser lo lento".

## Laboratorio
Medir una operación crítica y actuar sobre el punto más costoso.

## Preparación
- carga de ejemplo,
- herramientas de benchmarking,
- trazas de tiempo y uso de recursos

## Paso 1
Definir qué significa “rápido” en este caso concreto.

## Paso 2
Medir la operación con un caso realista.

## Paso 3
Aplicar una mejora y volver a medir el efecto.

## Verificación
- tiempos de ejecución,
- uso de memoria,
- efectos de caché o paralelización.

## Errores comunes
- optimizar sin datos,
- mejorar una parte irrelevante,
- sacrificar legibilidad sin beneficio real,
- no volver a medir.

## Debugging
La optimización empieza con evidencia, no con suposiciones de rendimiento.

## Reto
Reducir tiempo de respuesta con un cambio concreto y documentar el antes y después.

## BREAK THE SYSTEM
Generar carga y detectar si el sistema se degrada de forma peligrosa.

## RECOVERY
Aplicar la mejora con ajuste de medición para observar el efecto real.

## Evaluación
- ¿Se midió antes y después?
- ¿La optimización cambia un punto crítico?
- ¿Se preservó la claridad del sistema?

## Evidencia
Guardar benchmarks, capturas y conclusiones del ajuste.

## Criterio de aprobación
El estudiante debe poder justificar por qué un cambio de rendimiento es útil y no solo aparente.
