---
id: fundamento-09
week: 3
order: 1
category: "Pruebas y calidad"
title: "Qué es (y qué NO garantiza) un test unitario"
---

# Qué es (y qué NO garantiza) un test unitario

## Pregunta de diagnóstico
¿Qué es un test unitario y qué garantiza (y qué NO garantiza) que pase?

## Modelo mental
Un **test unitario** verifica una unidad pequeña de código (una función, normalmente) de forma aislada, con entradas controladas y una salida esperada conocida de antemano. Si pasa, te dice: *"para estas entradas concretas, esta función produce esta salida concreta, en este momento."*

Lo que un test unitario en verde **NO garantiza**:
- Que la función funcione para entradas que el test no probó (casos límite no cubiertos).
- Que el sistema completo funcione — un test unitario prueba una pieza aislada, no cómo se integra con las demás (para eso existen pruebas de integración/end-to-end).
- Que el diseño sea correcto si el propio test tiene una idea equivocada de cuál es el comportamiento correcto — un test mal escrito puede pasar en verde validando un comportamiento erróneo.
- Que no haya una forma de "hacer trampa" para pasarlo sin cumplir realmente el requisito que pretendía verificar — un test que solo mide la forma de la salida, no su contenido real, puede ser engañado.

## En este proyecto
Este Lab tiene un ejemplo real y documentado de exactamente ese último punto. La función `parseSqlGrading()` (en `server/grading.mjs`) tenía pruebas que pasaban en verde — pero esas pruebas solo comprobaban el caso "normal" (código correcto del estudiante, arnés corre limpio). Lo que esas pruebas NO cubrían era: ¿qué pasa si el estudiante imprime líneas `GRADE_CHECK:` falsas *antes* de que corra el arnés real? La función tenía un bug real (contaba la primera aparición de cada chequeo, no la última) que ningún test existente detectaba, porque ningún test probaba ese caso límite.

La corrección no fue solo arreglar el código — fue agregar un test nuevo (`tests/server/grading.test.mjs`, el test de "regresión" sobre el spoofing) que reproduce exactamente ese caso límite. Ahora, si alguien vuelve a introducir ese bug por accidente en el futuro, ese test específico fallará y lo detectará — pero solo porque alguien pensó deliberadamente en ese caso y lo escribió. Los tests anteriores, aunque estaban en verde, nunca iban a detectarlo porque no era parte de lo que medían.

## Para verificar que entendiste
- ¿Por qué todos los tests de `grading.test.mjs` podían estar en verde mientras el bug de spoofing seguía vivo en el código?
- Si una función de calificación de código solo revisara que la salida contenga la palabra `"PASS"` sin verificar quién la imprimió, ¿qué estrategia de trampa sería posible?
- Piensa en una función de este proyecto (por ejemplo `isLoopback` o `recordGradingAttempt`) y describe un caso límite que un test "obvio" probablemente no cubriría a la primera.

## Caso avanzado
Hay una métrica que mucha gente confunde con "mis tests son buenos": la cobertura de líneas (qué porcentaje de líneas de código se ejecutó al menos una vez durante los tests). El bug real de `parseSqlGrading` de este proyecto es la prueba perfecta de por qué esa métrica engaña: antes de la corrección, **todas las líneas** de esa función ya se ejecutaban en los tests existentes — el bucle que recorre `GRADE_CHECK:`, la búsqueda del chequeo, la asignación del resultado. 100% de cobertura de líneas, con un bug real y explotable adentro.

Lo que faltaba no era ejecutar más líneas — era ejecutar la función con una *entrada* que ningún test anterior había probado: una salida con chequeos falsos impresos antes del arnés real. Esto se llama a veces "cobertura de casos" o se verifica con mutation testing (una técnica que cambia deliberadamente una línea de tu código — por ejemplo invierte una condición `if` — y comprueba si *algún* test falla; si ningún test falla, esa línea no estaba realmente puesta a prueba, aunque se haya "cubierto").

La lección práctica: cuando revises si un conjunto de tests es suficiente, no preguntes solo "¿se ejecutó esta línea?" — pregunta "¿qué entrada rara, maliciosa o inesperada podría pasar por esta línea sin que ningún test actual lo note?".

**Para verificar que entendiste (avanzado):** explica por qué una función puede tener 100% de cobertura de líneas en sus tests y aun así tener un bug de seguridad explotable, usando el caso real de `parseSqlGrading` como ejemplo.
