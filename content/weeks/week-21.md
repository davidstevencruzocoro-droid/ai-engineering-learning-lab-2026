---
id: 21
level: 5
xp: 25
title: "Semana 21 · Producto"
---

# Semana 21: Producto y valor de negocio

## Objetivo
Diseñar soluciones centradas en problemas reales y valor entregado al usuario.

## Por qué importa
Un sistema técnicamente bueno que no resuelve una necesidad real no crea impacto durable.

## Conceptos
- problema
- usuario
- solución
- MVP
- feedback

## Arquitectura
```text
Necesidad del usuario
  ↓
Problema real
  ↓
MVP
  ↓
Validación + iteración
```

## Profundización técnica
"Esto parece valioso" no es un criterio — es una opinión. Un framework real y simple para priorizar qué construir primero es el **RICE score**, usado en muchos equipos de producto:
```text
RICE = (Alcance × Impacto × Confianza) / Esfuerzo

Alcance:   ¿cuántos usuarios/eventos toca esto en un período? (número)
Impacto:   ¿cuánto mueve la aguja por usuario? (0.25 mínimo, 0.5 bajo, 1 medio, 2 alto, 3 masivo)
Confianza: ¿qué tan seguro estás de esas estimaciones? (100% alta, 80% media, 50% baja)
Esfuerzo:  persona-semanas estimadas para construirlo
```
Dos ideas con el mismo "me parece buena" pueden tener un RICE muy distinto: una que toca a 10,000 usuarios con impacto medio y 2 semanas de esfuerzo (RICE ≈ 10000×1×0.8/2 = 4000) claramente pesa más que una que toca a 50 usuarios con el mismo esfuerzo (RICE ≈ 50×1×0.8/2 = 20) — el número hace visible una comparación que "la intuición" tiende a ignorar.

Pero ningún score reemplaza medir qué pasó realmente después de construir algo. La forma concreta de validar un MVP con datos (no con "a la gente le gustó en la demo") es instrumentar el embudo real de uso:
```javascript
function registrarEvento(nombreEvento, propiedades = {}) {
  analytics.track({ evento: nombreEvento, propiedades, timestamp: Date.now() });
}

// En los puntos reales del flujo:
registrarEvento('mvp_vista_inicio');
registrarEvento('mvp_intento_accion_principal');
registrarEvento('mvp_accion_completada');
```
Con esto, "¿el MVP encaja con una necesidad real?" deja de ser una impresión y se convierte en una tasa de conversión verificable: de cuántos que vieron el inicio, cuántos intentaron la acción principal, y de esos, cuántos la completaron. Una caída grande entre "intentó" y "completó" te dice, con evidencia, dónde está el problema real — que casi nunca es donde la intuición apuntaba primero.

## Laboratorio
Definir un MVP para un problema concreto y medir si encaja con una necesidad real.

## Preparación
- una necesidad clara,
- público objetivo,
- criterio de valor útil

## Paso 1
Describir el problema con detalle y evitar soluciones prematuras.

## Paso 2
Diseñar una solución mínima con valor observable.

## Paso 3
Validar con descenso de dudas reales y feedback concreto.

## Verificación
- claridad del problema,
- utilidad del MVP,
- receptividad del usuario.

## Errores comunes
- resolver lo que no se necesita,
- crear funcionalidades sin prueba,
- no escuchar a usuarios reales,
- priorizar tecnología sobre problema.

## Debugging
Cuando el producto parece “fuerte” pero no sirve, el problema no está en la tech; está en el problema elegido.

## Reto
Diseñar un MVP para una necesidad concreta con una prueba de valor mínima.

## BREAK THE SYSTEM
Probar si el producto es válido sin la posibilidad de personalizar el caso de uso.

## RECOVERY
Ajustar la solución según la evidencia, no la intuición.

## Evaluación
- ¿El problema es real?
- ¿La solución tiene valor observable?
- ¿El MVP es mínimo pero útil?

## Evidencia
Guardar definición del problema, MVP y comentarios de usuarios.

## Criterio de aprobación
El estudiante debe poder explicar por qué la prioridad no es solo construir, sino resolver con claridad.
