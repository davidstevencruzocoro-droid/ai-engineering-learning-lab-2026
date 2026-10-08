---
id: challenge-03
xp: 40
level: "Avanzado"
title: "Reto: reducir coste de una solución IA"
---

# Reto 3: Reducir el coste de una solución de IA sin perder calidad

## Enunciado
Toma el servicio de IA del lab 13 (o cualquier integración propia con un LLM) y redúcele el coste por consulta en al menos un 50%, midiendo que la calidad de las respuestas no se degrade de forma inaceptable.

## Objetivo
Aplicar técnicas reales de optimización de coste: acortar el prompt sin perder instrucciones esenciales, usar un modelo más pequeño cuando el caso lo permite, cachear respuestas repetidas, o procesar en lote (batching) en vez de uno por uno.

## Puntuación
+40 XP si demuestras, con el mismo conjunto de casos de prueba del lab 14 o 17, que el coste bajó al menos 50% y la tasa de acierto se mantuvo dentro de un margen razonable (defínelo y documéntalo tú mismo antes de medir).

## Penalización
-10 XP si la reducción de coste se logra simplemente quitando validaciones o control de errores (eso no es optimización, es quitar seguridad).
