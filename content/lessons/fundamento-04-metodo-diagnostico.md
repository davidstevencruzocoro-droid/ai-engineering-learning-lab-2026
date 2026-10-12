---
id: fundamento-04
week: 1
order: 4
category: "Método y pensamiento crítico"
title: "Método de diagnóstico: observar, formular hipótesis, probar, concluir"
---

# Método de diagnóstico: observar, formular hipótesis, probar, concluir

## Pregunta de diagnóstico
Describe el método que usarías para diagnosticar un problema en un sistema que no entiendes bien todavía.

## Modelo mental
El método científico aplicado a sistemas, en cuatro pasos disciplinados:

1. **Observar**: reúne hechos verificables, sin interpretarlos todavía. ¿Qué mensaje de error exacto apareció? ¿Qué comando lo produjo? Etiqueta esto como `Observado`.
2. **Formular una hipótesis**: una explicación posible y específica, no una lista vaga de sospechas. Etiqueta como `Inferido` — es una suposición razonada, no un hecho.
3. **Probar UNA hipótesis a la vez**: diseña un experimento mínimo que confirme o refute esa hipótesis específica, y solo esa. Si pruebas varias cosas a la vez y algo cambia, no sabrás cuál de ellas fue la causa.
4. **Concluir**: si el experimento confirma la hipótesis, corriges la causa real (no el síntoma) y vuelves a probar para confirmar que quedó resuelto. Si la refuta, descartas esa hipótesis y formulas la siguiente — sin mezclar ambas rondas.

## En este proyecto
Este método no es teoría abstracta — es exactamente lo que se usó esta sesión para encontrar y corregir el bug real de calificación de SQL:

1. **Observado**: `parseSqlGrading` contaba líneas `GRADE_CHECK:` en la salida de un proceso sandbox, sin verificar si ya había visto ese mismo nombre de chequeo antes.
2. **Hipótesis (inferido)**: si un estudiante imprime líneas `GRADE_CHECK:` falsas *antes* de que corra el arnés real de pruebas, el parser podría contarlas como si fueran el resultado real.
3. **Experimento**: se construyó deliberadamente una entrada con chequeos falsos impresos antes del arnés real, y se ejecutó contra el código sin corregir — confirmado: mostraba 4/6 "aprobados" sin que la tabla `tasks` existiera de verdad.
4. **Conclusión y corrección**: la causa raíz no era "el estudiante hizo trampa", era que el parser confiaba en la *primera* aparición de cada chequeo en vez de la *última* (que siempre es la del arnés real, porque se ejecuta después del código del estudiante). Se corrigió usando un `Map` que se queda con la última aparición por nombre, y se volvió a correr el mismo experimento — ahora mostraba el conteo correcto, menor. Se agregó una prueba de regresión para que ese experimento quede repetible para siempre.

Nota el orden: no se "arregló" nada hasta que el experimento confirmó la hipótesis con evidencia verificable — no por intuición de que "algo estaba raro".

## Para verificar que entendiste
- ¿Por qué cambiar dos cosas a la vez en el experimento del paso 3 habría arruinado la conclusión, aunque el bug se hubiera corregido igual?
- ¿Qué diferencia hay entre "corregir la causa raíz" (el parser confía en la primera aparición) y "corregir el síntoma" (por ejemplo, prohibir la palabra `GRADE_CHECK` en el código del estudiante)?
- La próxima vez que veas un error nuevo en este proyecto, ¿qué sería exactamente tu "Observado" antes de inferir nada?

## Caso avanzado
El método científico no siempre termina en una solución perfecta — a veces termina en un riesgo residual *conocido y documentado*, que es muy distinto de un riesgo ignorado. La corrección del bug de `parseSqlGrading` es un ejemplo real: la causa raíz (confiar en la primera aparición de un chequeo en vez de la última) se corrigió y se verificó con un experimento reproducible. Pero durante esa misma investigación apareció un caso límite más estrecho: si `sqlite3` se ejecutara con la bandera `-bail` (detenerse en el primer error) y el arnés real de verificación se interrumpiera a mitad de camino porque una tabla genuinamente no existe, algunos chequeos posteriores nunca llegarían a re-ejecutarse con el arnés real — y en teoría podrían quedarse con un valor "spoofed" de una ejecución anterior.

Arreglar *ese* caso límite por completo habría requerido tocar `runner.py` y el `Dockerfile` del sandbox (fuera del alcance de ese cambio, y territorio de otro agente trabajando en este mismo repo). La decisión documentada fue aceptar ese riesgo residual explícitamente — mucho más estrecho que el bug original — en vez de ampliar el alcance del cambio sin autorización.

Esto ilustra algo que la gente que recién aprende el método científico aplicado a sistemas suele pasar por alto: una conclusión válida no es "ya no hay ningún riesgo", es "esto es lo que se verificó, esto es lo que queda por verificar, y esto es por qué se aceptó así por ahora".

**Para verificar que entendiste (avanzado):** ¿por qué documentar un riesgo residual conocido (con su alcance exacto) es más confiable a largo plazo que quedarte callado hasta encontrar una solución perfecta?
