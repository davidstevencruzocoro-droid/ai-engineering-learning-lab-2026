---
id: 24
level: 5
xp: 30
title: "Semana 24 · Proyecto final III"
---

# Semana 24: Proyecto final III

## Objetivo
Presentar una solución completa, documentada y evaluable con evidencia de valor real.

## Por qué importa
Una entrega final no es solo una demo; es una historia de problema, solución, decisiones y resultados.

## Conceptos
- demo
- documentación
- evidencia
- cierre de proyecto
- mejora futura

## Arquitectura
```text
Proyecto funcional
  ↓
Documentación y evidencia
  ↓
Demo y valoración
  ↓
Siguientes mejoras
```

## Profundización técnica
Una demo que depende de "espero que no falle nada en vivo" no es una demo confiable — es suerte. La forma real de que una demo sea reproducible es tratarla como código: un script de datos semilla (*seed*) que deja el sistema siempre en el mismo estado conocido antes de presentar:
```javascript
// seed-demo.mjs — deja la base de datos en un estado conocido para la demo
async function seedDemo() {
  await db.exec('DELETE FROM pedidos; DELETE FROM clientes;');
  await db.exec(`INSERT INTO clientes (id, nombre) VALUES
    (1, 'Cliente Demo A'), (2, 'Cliente Demo B')`);
  await db.exec(`INSERT INTO pedidos (id, cliente_id, producto, estado) VALUES
    (1, 1, 'Producto X', 'completado'),
    (2, 2, 'Producto Y', 'pendiente')`);
  console.log('Base de datos lista para demo: 2 clientes, 2 pedidos.');
}
seedDemo();
```
Con esto, `npm run seed:demo && npm run dev` deja el sistema exactamente igual cada vez que practicas o presentas — sin depender de recordar qué datos quedaron de la última sesión de pruebas, y sin el riesgo de que un caso límite real (un pedido corrupto de una prueba anterior) rompa la demo en vivo.

Sobre la narrativa misma, la estructura que de verdad sostiene una presentación técnica frente a preguntas difíciles no es "aquí está mi código" — es, en orden:
1. **El problema**, en una frase que cualquiera entienda sin contexto técnico previo.
2. **La decisión más importante** que tomaste y el trade-off que aceptaste (referencia aquí tu ADR de la semana 22 si lo tienes).
3. **Qué NO funciona todavía**, dicho explícitamente — admitirlo antes de que te lo pregunten demuestra criterio, no debilidad.
4. **Cómo lo verificarías** si tuvieras una semana más.

El punto 3 es el que más gente omite por miedo a "verse mal" — y es exactamente el que un entrevistador o evaluador técnico va a notar si falta, porque todo sistema real tiene límites conocidos, y no mencionarlos suena a que no los conoces.

## Laboratorio
Preparar la presentación final del proyecto con una narrativa clara y evidencias reales.

## Preparación
- flujo principal probado,
- documento de decisiones,
- demo funcional,
- evidencias de impacto o valor

## Paso 1
Muestra el problema resuelto y el contexto del proyecto.

## Paso 2
Explica la arquitectura, decisiones y trade-offs clave.

## Paso 3
Presenta la evidencia: resultado, prueba y aprendizaje futuro.

## Verificación
- solución funcional,
- documentación clara,
- explicación de decisiones y errores,
- demo comprendida por el público.

## Errores comunes
- demostración sin contexto,
- explicación técnica excesiva sin valor,
- una solución sin evidencia,
- falta de cierre y próximos pasos.

## Debugging
Si cuesta explicar el proyecto, probablemente el problema o la solución no está suficientemente claro.

## Reto
Explicar la solución en una narrativa entendible sin perder rigor técnico.

## BREAK THE SYSTEM
Probar si la presentación explica la solución real y no solo la intención.

## RECOVERY
Corregir la narrativa, reforzar la evidencia y preparar una mejor entrega final.

## Evaluación
- ¿El proyecto resuelve el problema planteado?
- ¿La evidencia es clara?
- ¿Se entiende la solución y su sentido?

## Evidencia
Guardar presentación, resumen, artefactos y notas de cierre.

## Criterio de aprobación
El estudiante debe poder mostrar una solución terminada con argumentos, pruebas y entendimiento real del problema.
