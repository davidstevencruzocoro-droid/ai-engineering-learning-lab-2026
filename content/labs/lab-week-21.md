---
id: lab-21
week: 21
xp: 60
title: "MVP con valor de negocio"
---

# Lab 21: Convertir una función técnica en un MVP con valor medible

## Objetivo
Tomar algo que ya construiste en semanas anteriores y recortarlo hasta un MVP (producto mínimo viable) que resuelva un problema real de un usuario concreto, no una demostración técnica de lo que sabes hacer.

## Duración
2 sesiones

## Requisitos
- uno de tus proyectos de laboratorios anteriores (API, RAG, agente, automatización)
- un usuario o escenario concreto en mente (aunque sea hipotético pero específico: "una persona que gestiona pedidos de una tienda pequeña")

## Tareas
1. Escribe una sola frase de problema: "Como [usuario], necesito [acción] para [beneficio]". Si necesitas más de una frase, el alcance todavía es demasiado amplio.
2. Lista todas las funcionalidades que "serían geniales" y tacha todas menos las 1-3 que resuelven directamente esa frase.
3. Define una métrica de éxito medible (no "que a la gente le guste", sino algo como "reduce de 10 a 2 minutos crear un pedido").
4. Implementa solo el camino principal (happy path) de esas 1-3 funcionalidades, sin casos extremos que no afecten a la métrica.

## Pista
Si tu lista de "funcionalidades imprescindibles" tiene más de 3 elementos, no has priorizado — has hecho una lista de deseos.

## Pista 2
Asocia cada funcionalidad a un usuario y a la métrica de éxito. Descarta lo que no contribuya directamente a reducir el problema definido.

## Pista 3
Implementa solo el camino principal de las 1-3 funciones elegidas y mide el flujo completo desde la acción del usuario hasta el resultado de negocio.

## Solución
Plantilla de una página para el MVP:
```markdown
## Problema
Como dueño de una tienda pequeña, necesito registrar pedidos rápido
para no perder ventas por errores de anotación manual.

## Métrica de éxito
Reducir el tiempo de registrar un pedido de ~10 min (papel) a <2 min (app).

## Alcance del MVP (y SOLO esto)
1. Formulario de pedido con producto, cantidad, cliente.
2. Lista de pedidos del día.
3. Marcar un pedido como entregado.

## Explícitamente fuera de alcance (por ahora)
- reportes, múltiples usuarios, facturación, inventario automático.
```

## Penalización XP
-9 XP por construir tecnología sin un problema bien definido (empezar por "qué puedo hacer" en vez de "qué necesita resolver alguien").

## Evidencia
La plantilla completa, el MVP funcionando con el camino principal, y una medición (aunque sea estimada) de si se cumple la métrica de éxito definida.

## Criterio de aprobación
Existe un problema de una frase, una métrica medible, un alcance de máximo 3 funcionalidades, y el MVP implementado cubre exactamente esas funcionalidades — ni más ni menos.
