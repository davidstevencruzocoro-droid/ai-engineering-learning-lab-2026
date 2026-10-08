# AI Evaluation — Cómo evaluar sistemas de IA con criterio

Referencia para las semanas 14 (prompt engineering), 15 (RAG), 16 (agentes) y especialmente 17 (evaluación de IA) y 18 (LLMOps).

## 1. El principio central

**Un modelo más grande o más caro no es automáticamente mejor para tu caso de uso.** La única forma de saberlo es medir sobre tus propios casos, con tus propios criterios. "Se ve bien" no es una métrica.

## 2. Métricas que importan, y qué miden realmente

| Métrica | Qué responde | Cómo medirla |
|---|---|---|
| Exactitud (accuracy) | ¿Cuántas respuestas fueron correctas? | % de casos donde la salida coincide con lo esperado (exacto o por criterio definido) |
| Precisión / Recall | De lo que el sistema afirmó, ¿cuánto era correcto? / De lo correcto, ¿cuánto encontró? | Útil en clasificación y en recuperación (RAG) |
| Groundedness | ¿La respuesta está respaldada por una fuente real? | % de afirmaciones con cita verificable a un fragmento fuente (lab 15) |
| Alucinación | ¿Con qué frecuencia el sistema inventa algo? | % de respuestas con afirmaciones no verificables en las fuentes |
| Latencia (p50/p95) | ¿Qué tan rápido responde, típico y en el peor caso razonable? | Medir tiempos reales, no solo el promedio |
| Coste por consulta | ¿Cuánto cuesta cada respuesta? | Ver `docs/COSTS.md` |
| Consistencia | ¿Da resultados similares ante entradas similares? | Repetir el mismo caso varias veces y comparar variabilidad |

## 3. Cómo construir un conjunto de evaluación (dataset) propio

1. Reúne entre 15 y 50 casos reales o realistas de tu problema (más casos no siempre es mejor; casos bien elegidos sí).
2. Define la salida esperada o el criterio de aceptación para cada uno — hazlo ANTES de ejecutar el sistema, nunca después (para no ajustar el criterio a lo que el sistema ya respondió).
3. Incluye deliberadamente casos difíciles: ambiguos, fuera de dominio, con datos faltantes o contradictorios.
4. Vuelve a correr el mismo conjunto cada vez que cambies el prompt, el modelo o la arquitectura — esto es lo que te permite comparar versiones de forma justa (ver lab 14).

## 4. Groundedness y alucinación en la práctica (RAG, semana 15)

Una respuesta "grounded" cita exactamente de qué fragmento salió cada afirmación. Para evaluarlo:

1. Por cada respuesta, verifica manualmente (o con un segundo LLM como evaluador, con supervisión humana) si cada afirmación aparece realmente en el fragmento citado.
2. Cuenta como alucinación cualquier afirmación sin respaldo en los fragmentos recuperados, aunque sea verdadera en el mundo real — el sistema no puede saberlo sin evidencia, y afirmar algo sin evidencia es el comportamiento que queremos detectar y corregir.
3. Verifica explícitamente que el sistema sepa decir "no tengo evidencia suficiente" ante preguntas fuera de sus documentos.

## 5. "LLM como juez" (usar un LLM para evaluar a otro LLM)

Técnica común y útil, con una advertencia: un LLM evaluador puede tener sus propios sesgos (preferir respuestas más largas, más "seguras" en tono, etc.). Úsalo como apoyo para escalar la evaluación, nunca como única fuente de verdad — siempre valida una muestra manualmente para confirmar que el juez automático coincide con el criterio humano.

## 6. Qué entregar en el lab 17

- Un conjunto de casos de evaluación versionado (no improvisado en el momento).
- Una tabla comparativa con al menos 3 métricas entre las alternativas evaluadas.
- Una recomendación explícita con las condiciones bajo las que cambiarías de opinión.
