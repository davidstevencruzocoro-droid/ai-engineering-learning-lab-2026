---
id: project-04
title: "Proyecto 4: RAG"
weekStart: 13
weekEnd: 15
xp: 180
---

# Proyecto 4: RAG

## Visión
Construir un sistema de recuperación aumentada por generación (RAG) sobre documentos propios, con control de coste y respuestas que solo afirman lo que pueden justificar con una fuente.

## Problema
Los sistemas de IA que "suenan bien" pero inventan datos son un riesgo de negocio real (decisiones basadas en información falsa). Este proyecto obliga a construir el control contrario: evidencia antes que fluidez.

## Stack
API de LLM, API de embeddings, almacenamiento de vectores (en memoria o una base de datos vectorial), el servicio de control de coste del lab 13.

## Entregables
- Ingesta y chunking de al menos 5-10 documentos propios.
- Recuperación por similitud semántica con citas explícitas a la fuente en cada respuesta.
- Rechazo explícito de preguntas fuera del dominio de los documentos ("no tengo evidencia suficiente").
- Registro de coste y latencia por consulta (reutilizando el lab 18).

## Criterios de éxito
- Toda afirmación en una respuesta puede rastrearse a un fragmento real de un documento.
- El sistema rechaza correctamente al menos un caso de prueba fuera de dominio.
- Existe una medición de coste por consulta, no una estimación a ojo.

## Conexión con el proyecto final
Este RAG puede convertirse en una de las herramientas del agente del Proyecto 5, y en una fuente de conocimiento del proyecto final.
