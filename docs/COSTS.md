# Costs — Control de costes de IA

> Última verificación de precios: 2026-10-08, contra la documentación oficial de Anthropic (`platform.claude.com/docs/en/about-claude/pricing`). **Los precios de los proveedores de LLM cambian con frecuencia — antes de tomar una decisión de negocio, vuelve a verificar en la página oficial del proveedor que uses, no confíes en este documento como fuente de precio vigente.**

## 1. Por qué esto es una competencia de ingeniería, no un detalle administrativo

Un sistema de IA que funciona pero cuyo coste nadie midió no es un sistema de IA listo para producción. El coste por consulta determina si un producto es viable, qué modelo elegir, y cuándo usar caché, batch o un modelo más pequeño. Este documento es la referencia de costes para todos los laboratorios de las semanas 13, 14, 17 y 18.

## 2. Cómo se cobra una llamada a un LLM

Casi todos los proveedores cobran por **tokens**, no por caracteres ni por "preguntas":

- **Tokens de entrada (input):** todo lo que envías — system prompt, historial, contexto recuperado (RAG), la pregunta del usuario.
- **Tokens de salida (output):** lo que el modelo genera. Suele costar varias veces más caro que el input.
- Como aproximación en inglés/español: 1 token ≈ 4 caracteres ≈ 0.75 palabras. La cifra exacta varía por idioma y contenido — nunca la asumas como exacta para facturación real, usa el conteo de `usage` que devuelve la propia API.

## 3. Precios reales verificados (Anthropic, API de Claude, octubre 2026)

| Modelo | Input (por millón de tokens) | Output (por millón de tokens) |
|---|---|---|
| Claude Haiku 4.5 | $1 | $5 |
| Claude Sonnet 5 | $2 | $10 |
| Claude Opus 5 | $5 | $25 |
| Claude Fable 5 | $10 | $50 |

Fuente: [platform.claude.com/docs — Pricing](https://platform.claude.com/docs/en/about-claude/pricing). Si usas OpenAI, Google, u otro proveedor, la lógica de este documento es idéntica — solo cambia la tabla de precios, que debes copiar de su documentación oficial, nunca de blogs de terceros (hay muchísimo contenido de precios desactualizado o directamente inventado en internet).

### Ejemplo de cálculo real

Una llamada con 2.000 tokens de entrada y 500 de salida usando Sonnet 5:
```text
costo = (2000 / 1_000_000 * $2) + (500 / 1_000_000 * $10)
      = $0.004 + $0.005
      = $0.009 por llamada
```
1.000 llamadas similares al día ≈ $9/día ≈ ~$270/mes. Esta es exactamente la cuenta que debe hacer tu servicio del lab 13 antes de decidir si el presupuesto diario que definas es razonable.

## 4. Técnicas reales de reducción de coste (en orden de impacto típico)

1. **Elegir el modelo más pequeño que cumpla la tarea.** No todo necesita el modelo más grande — clasificar texto corto o extraer un campo simple casi siempre funciona bien con un modelo pequeño (ej. Haiku) a una fracción del coste de uno grande.
2. **Prompt caching.** Si reenvías el mismo contexto largo (un system prompt extenso, documentos de referencia) en múltiples llamadas, cachear ese prefijo reduce drásticamente el coste de las llamadas repetidas — en la API de Claude, una lectura de caché cuesta una fracción del precio de input estándar (ver la documentación oficial para el multiplicador exacto, varía por modelo).
3. **Batch processing.** Si no necesitas respuesta en tiempo real (evaluaciones masivas, procesamiento nocturno), la API de procesamiento por lotes suele costar la mitad que las llamadas síncronas.
4. **Acortar el prompt sin perder instrucciones esenciales.** Más contexto no es gratis ni siempre mejora la calidad — cada token de "relleno" en el prompt se paga y se reenvía en cada llamada.
5. **Evitar reintentos ciegos.** Reintentar automáticamente una llamada ya cara multiplica el coste; combina reintentos con un circuit breaker (ver `docs/OPERATIONS.md`) para no pagar por una dependencia caída.

## 5. Qué medir siempre (ver también `docs/AI-EVALUATION.md`)

- **Coste por llamada** y **coste por resultado útil** (si el 30% de las respuestas se descartan por mala calidad, el coste real por resultado útil es mayor que el coste por llamada).
- **Latencia p50/p95**, no solo el promedio — un promedio bajo puede esconder un 5% de llamadas lentísimas.
- **Tasa de error/timeout**, que también tiene coste (reintentos, soporte, confianza del usuario).

## 6. Ejercicio de referencia

El reto 3 (`content/challenges/challenge-03.md`) y el lab 13 (`content/labs/lab-week-13.md`) de este laboratorio piden exactamente esto: resolver el mismo problema gastando significativamente menos, con evidencia de la comparación, no por intuición.
