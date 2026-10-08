---
id: lab-20
week: 20
xp: 55
title: "Optimización de rendimiento"
---

# Lab 20: Romper el rendimiento, medirlo, y arreglarlo

## Objetivo
Encontrar el cuello de botella real de un sistema propio con medición, no con intuición, y demostrar la mejora con números de antes y después.

## Duración
2 sesiones

## Requisitos
- una aplicación propia con una operación que puedas medir (una consulta a base de datos, un endpoint, una función con bucle)
- una herramienta simple de carga (puede ser un script propio que haga N peticiones en paralelo)

## Tareas
1. Mide el tiempo de respuesta actual de la operación bajo una carga realista (no solo una petición aislada).
2. Identifica el cuello de botella real con profiling o medición por partes (¿es la consulta SQL? ¿la falta de un índice? ¿un bucle ineficiente?) — no optimices a ciegas.
3. Aplica una única optimización dirigida a ese cuello de botella (un índice, una caché, eliminar una consulta N+1).
4. Vuelve a medir bajo la misma carga y compara objetivamente.

## Pista
Si no puedes decir "esta parte específica tarda X ms de los Y ms totales", todavía no has encontrado el cuello de botella — solo tienes una sospecha.

## Pista 2
Define la misma carga representativa y toma una línea base con varias ejecuciones. Perfila por etapas hasta encontrar dónde se consume el tiempo.

## Pista 3
Haz un solo cambio dirigido y vuelve a medir con idéntica carga y condiciones. Compara latencia y resultado funcional para confirmar que optimizaste sin regresiones.

## Solución
```sql
-- Antes: sin índice, escanea toda la tabla
EXPLAIN ANALYZE SELECT * FROM pedidos WHERE cliente_id = 42;
-- Seq Scan on pedidos (cost=0.00..1850.00 rows=1 width=120) (actual time=12.400ms)

CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);

-- Después: usa el índice
EXPLAIN ANALYZE SELECT * FROM pedidos WHERE cliente_id = 42;
-- Index Scan using idx_pedidos_cliente (cost=0.29..8.31 rows=1 width=120) (actual time=0.050ms)
```
```javascript
// Script simple de carga
async function medirCarga(url, peticionesParalelas = 20) {
  const inicio = Date.now();
  await Promise.all(Array.from({ length: peticionesParalelas }, () => fetch(url)));
  return Date.now() - inicio;
}
```

## Penalización XP
-8 XP por optimizar sin evidencia o sin comprender el problema (cambiar código "porque debería ser más rápido" sin medir antes).

## Evidencia
El número de antes, el número de después, bajo la misma carga, y la explicación concreta de qué cambiaste y por qué ese cambio ataca el cuello de botella identificado (no uno distinto).

## Criterio de aprobación
Existe una medición de antes y después bajo carga comparable, con una mejora cuantificada, y la explicación del cuello de botella coincide con la optimización aplicada.
