---
id: lab-16
week: 16
xp: 50
title: "Agente con herramientas"
---

# Lab 16: Agente con herramientas y límites explícitos

## Objetivo
Construir un agente que decida qué herramienta usar según la pregunta del usuario, con un conjunto de herramientas limitado y permisos explícitos — no acceso libre a "hacer lo que haga falta".

## Duración
2-3 sesiones

## Requisitos
- acceso a una API de LLM con soporte de tool calling / function calling
- 2-3 "herramientas" simuladas propias (funciones que consultan datos de prueba: un cliente, un inventario, una agenda)

## Tareas
1. Define 2 o 3 herramientas con un esquema de entrada claro (nombre, descripción, parámetros) — por ejemplo `consultarCliente(id)`, `consultarInventario(producto)`.
2. Implementa cada herramienta como una función real que devuelve datos de prueba (no hace falta una base de datos real).
3. Haz que el agente reciba una pregunta del usuario, decida qué herramienta llamar, ejecute la función real, y use el resultado para responder.
4. Añade una herramienta deliberadamente "peligrosa" (ej. `borrarCliente(id)`) y bloquéala explícitamente: el agente puede proponerla, pero tu código debe exigir una confirmación humana antes de ejecutarla.

## Pista
El riesgo real de los agentes no es que "se vuelvan inteligentes"; es dar acceso directo a una acción irreversible sin ningún punto de control humano en medio.

## Pista 2
Define para cada herramienta nombre, parámetros y permisos mínimos. Enruta la decisión del modelo a una lista permitida y valida los argumentos antes de ejecutar la función.

## Pista 3
Prueba una herramienta de consulta y la acción peligrosa. La segunda debe detenerse antes de ejecutarse y devolver una solicitud de confirmación humana verificable.

## Solución
```javascript
const herramientas = {
  consultarCliente: (id) => BASE_CLIENTES.find((c) => c.id === id) ?? null,
  consultarInventario: (producto) => BASE_INVENTARIO[producto] ?? 0,
  borrarCliente: (id) => { throw new Error('ACCION_REQUIERE_CONFIRMACION_HUMANA'); }
};

async function ejecutarAgente(pregunta) {
  const decision = await llamarLLMConTools(pregunta, Object.keys(herramientas));

  if (decision.herramienta === 'borrarCliente') {
    return { requiereConfirmacion: true, accion: decision };
  }

  const resultado = herramientas[decision.herramienta](...decision.parametros);
  return await llamarLLM(`Pregunta: ${pregunta}\nResultado de la herramienta: ${JSON.stringify(resultado)}`);
}
```

## Penalización XP
-9 XP por dejar un agente sin control de decisiones (ninguna acción irreversible pasa por confirmación, o el agente tiene acceso a más herramientas de las que necesita).

## Evidencia
Un flujo completo donde el agente consulta datos y responde correctamente, y un flujo donde intenta la acción "peligrosa" y queda bloqueada hasta confirmación explícita.

## Criterio de aprobación
El agente solo tiene acceso a las herramientas que su tarea requiere (least privilege), y ninguna acción irreversible se ejecuta sin un punto de control humano.
