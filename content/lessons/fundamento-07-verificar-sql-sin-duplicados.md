---
id: fundamento-07
week: 2
order: 3
category: "Bases de datos"
title: "Verificar que una consulta SQL no duplica registros"
---

# Verificar que una consulta SQL no duplica registros

## Pregunta de diagnóstico
¿Cómo verificarías que una consulta SQL no está devolviendo registros duplicados?

## Modelo mental
Los duplicados en SQL casi siempre vienen de un `JOIN` que multiplica filas: si la tabla A tiene una fila que hace match con tres filas de la tabla B, el resultado tiene tres filas para esa fila de A, no una. La verificación tiene dos capas:

1. **Verificación de forma (conteo)**: compara `COUNT(*)` del resultado contra `COUNT(DISTINCT columna_identificadora)`. Si son iguales, no hay duplicados por esa columna. Si el conteo total es mayor que el distinto, hay duplicación.
2. **Verificación de causa**: mirar qué `JOIN` introdujo la multiplicación, y decidir si hace falta `DISTINCT`, una agregación (`GROUP BY`), o corregir la condición del `JOIN` para que sea 1-a-1 en vez de 1-a-muchos.

Un error común es "arreglar" el síntoma con `SELECT DISTINCT *` sin entender la causa — eso oculta duplicados exactos, pero no corrige filas que son "casi" duplicadas con una sola columna distinta (por ejemplo, un timestamp de join diferente).

## En este proyecto
El arnés de calificación de SQL de este Lab (`SQL_TASKS_CHECKS` en `server/grading.mjs`) hace justo este tipo de verificación de forma, aplicado a una tabla `tasks`: uno de los chequeos (`tiene_al_menos_dos_filas`) cuenta filas con `SELECT COUNT(*) FROM tasks;` y exige que el resultado sea `>= 2`, para confirmar que el estudiante insertó datos reales y no solo creó una tabla vacía.

Puedes aplicar la misma lógica de "comparar dos conteos" para detectar duplicados en esa misma tabla: `SELECT COUNT(*) FROM tasks;` contra `SELECT COUNT(DISTINCT title) FROM tasks;`. Si el primero es mayor, hay al menos dos tareas con el mismo título — y ahí decides si eso es un bug (se insertó la misma tarea dos veces por error) o un caso legítimo (dos tareas distintas que coinciden en el título por casualidad, y por lo tanto el título nunca debió ser la columna de comparación).

## Para verificar que entendiste
- Si `COUNT(*)` da 10 y `COUNT(DISTINCT id)` da 10 pero `COUNT(DISTINCT title)` da 7, ¿qué te dice eso sobre la columna `id` comparada con la columna `title`?
- ¿Por qué `SELECT DISTINCT *` puede ocultar un problema de duplicados en vez de resolverlo?
- Diseña un chequeo adicional (en el mismo estilo que `tiene_al_menos_dos_filas`) que detecte si dos filas de `tasks` tienen exactamente el mismo `title`.

## Caso avanzado
Hay un tipo de duplicado más difícil de detectar que el exacto: el "casi duplicado". Dos filas con `title = "Comprar leche"` y `title = "comprar leche "` (minúscula distinta, un espacio extra al final) son duplicados reales para cualquier persona que lea la tabla, pero `COUNT(DISTINCT title)` las contaría como dos valores diferentes, porque la comparación de texto en SQL es sensible a mayúsculas y a espacios por defecto en la mayoría de motores.

La forma de detectar esto es normalizar antes de comparar:
```sql
SELECT COUNT(*) AS total, COUNT(DISTINCT LOWER(TRIM(title))) AS normalizados FROM tasks;
```
Si `total` es mayor que `normalizados`, hay casi-duplicados que un chequeo ingenuo de `COUNT(DISTINCT title)` dejaría pasar. Este es exactamente el mismo principio que el bug real de `parseSqlGrading` que se corrigió en este proyecto (ver "Método de diagnóstico"): un chequeo que parece correcto en el caso obvio puede fallar en silencio ante una variación que nadie consideró al escribirlo. La disciplina no es solo "escribir el chequeo", es preguntarte qué variación razonable del dato real podría escapársele.

**Para verificar que entendiste (avanzado):** ¿por qué `COUNT(DISTINCT title)` sin `LOWER(TRIM(...))` podría reportar "cero duplicados" en una tabla que, para un humano leyéndola, claramente tiene tareas repetidas?
