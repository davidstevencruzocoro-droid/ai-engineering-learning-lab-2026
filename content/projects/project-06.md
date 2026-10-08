---
id: project-06
title: "Proyecto 6: SaaS con IA"
weekStart: 19
weekEnd: 21
xp: 220
---

# Proyecto 6: SaaS con IA

## Visión
Convertir los componentes construidos hasta ahora (API, automatización, RAG, agente) en un producto mínimo viable con valor de negocio definido, resiliente a fallos y con rendimiento medido.

## Problema
Tener piezas técnicas impresionantes no es lo mismo que tener un producto. Este proyecto fuerza a priorizar, medir valor real, y asegurar que el sistema sigue funcionando cuando algo falla.

## Stack
Todo lo anterior + patrón circuit breaker, caching, herramientas de profiling y carga (reutilizando labs 19-21).

## Entregables
- Documento de MVP de una página: problema, usuario, métrica de éxito, alcance de máximo 3 funcionalidades (plantilla del lab 21).
- Circuit breaker implementado ante al menos una dependencia externa real (el LLM, el RAG, o una API del Proyecto 3).
- Benchmark de rendimiento antes/después de una optimización dirigida (lab 20), con números concretos.
- El MVP funcionando de extremo a extremo con las 3 funcionalidades priorizadas, ni más ni menos.

## Criterios de éxito
- Existe una métrica de éxito medible y medida (no solo definida).
- El sistema degrada con un mensaje claro, sin caerse completamente, cuando una dependencia falla deliberadamente.
- La mejora de rendimiento está cuantificada con datos de antes y después bajo la misma carga.

## Conexión con el proyecto final
Este MVP, con su resiliencia y su enfoque de producto, es la versión inmediatamente anterior al proyecto final — en las semanas 22-24 se documenta su arquitectura, se termina de construir y se despliega a producción con demo.
