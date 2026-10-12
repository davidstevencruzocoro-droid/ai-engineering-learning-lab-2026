---
id: 16
level: 4
xp: 25
title: "Semana 16 · Agentes"
---

# Semana 16: Agentes y herramientas

## Objetivo
Crear sistemas capaces de ejecutar pasos con herramientas, contexto y estrategia de decisión.

## Por qué importa
Los agentes amplían la capacidad de un sistema para actuar, no solo responder.

## Conceptos
- agente
- tool calling
- planificación
- iteración
- memoria operativa

## Arquitectura
```text
Usuario
  ↓
Agente
  ├─ plan
  ├─ herramientas
  └─ respuesta
```

## Profundización técnica
El mentor de este Lab es, a propósito, **no** un agente: `askMentor()` solo genera texto, nunca ejecuta nada. Esto sirve como línea base para entender qué añade exactamente un agente: la capacidad de que el modelo *decida* invocar una función real, observe su resultado, y decida el siguiente paso con esa nueva información.

El patrón más usado para esto (a veces llamado ReAct: *Reasoning + Acting*) funciona en un bucle explícito, no en una sola llamada:
```javascript
async function ejecutarAgente(objetivo, herramientas, maxPasos = 6) {
  const historial = [{ role: 'user', content: objetivo }];
  for (let paso = 0; paso < maxPasos; paso++) {
    const respuesta = await llamarModelo(historial, herramientas);
    if (respuesta.tipo === 'respuesta_final') return respuesta.contenido;

    // El modelo decidió usar una herramienta: ejecutarla y devolver el resultado
    const herramienta = herramientas.find((h) => h.nombre === respuesta.herramienta);
    const resultado = await herramienta.ejecutar(respuesta.argumentos);
    historial.push(
      { role: 'assistant', content: `Usé ${respuesta.herramienta} con ${JSON.stringify(respuesta.argumentos)}` },
      { role: 'tool', content: JSON.stringify(resultado) }
    );
  }
  throw new Error('El agente no llegó a una respuesta final dentro del límite de pasos.');
}
```
`maxPasos` no es un detalle menor: sin un límite explícito, un agente mal diseñado puede entrar en un ciclo donde sigue "pensando" indefinidamente sin converger — consumiendo tiempo y, si el modelo es de pago, dinero sin límite.

Cada `herramienta.ejecutar()` de ese bucle es exactamente el tipo de función que debe seguir el principio de mínimo privilegio de la lección de Fundamentos sobre agentes de IA: una herramienta de "ejecutar código" bien diseñada se parece mucho a `runSandbox()` de este mismo proyecto — aislada, sin red, con límites de tiempo y memoria — no a un `eval()` directo sobre lo que el modelo decidió escribir.

## Laboratorio
Diseñar un agente simple que use herramientas e interprete resultados para completar una tarea.

## Preparación
- herramientas mínimas:
  - buscador,
  - calculadora,
  - validación de datos
- objetivo claro y medible

## Paso 1
Definir el trabajo que el agente debe hacer.

## Paso 2
Añadir herramientas y política de decisión.

## Paso 3
Observar si el agente actúa con intención y hace seguimiento de resultados.

## Verificación
- se ejecutan las herramientas correctas,
- se revisan resultados intermedios,
- se documenta la ruta de decisión.

## Errores comunes
- herramientas mal descritas,
- demasiada autonomía sin validación,
- ambigüedad en el objetivo,
- sin registro de decisiones.

## Debugging
Si un agente hace cosas raras, revisa la calidad de sus instrucciones y la definición de herramientas.

## Reto
Crear un agente para una tarea de análisis y validación concretas.

## BREAK THE SYSTEM
Dar instrucciones conflictivas o ambigüas para ver cómo reacciona.

## RECOVERY
Clarificar objetivos, restringir herramientas y volver a probar con observabilidad.

## Evaluación
- ¿Puede completar el objetivo con herramientas?
- ¿Tiene una estrategia observable?
- ¿Se valida la salida final?

## Evidencia
Guardar logs de ejecución, decisiones y salidas finalizadas.

## Criterio de aprobación
El estudiante debe entender que un agente no es una caja mágica: es una combinación de instrucciones, herramientas y control.
