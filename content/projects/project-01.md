---
id: project-01
title: "Proyecto 1: API profesional"
weekStart: 1
weekEnd: 4
xp: 150
---

# Proyecto 1: API profesional

## Visión
Construir y documentar una API REST profesional con persistencia real, que cualquier otra persona pueda clonar, instalar y ejecutar siguiendo solo el README.

## Problema
La mayoría de proyectos de aprendizaje funcionan "en la cabeza de quien los hizo" pero no se pueden reproducir. Este proyecto obliga a cerrar esa brecha desde el principio.

## Stack
Git/GitHub, Java, Spring Boot, PostgreSQL (o la base de datos relacional que prefieras), JUnit.

## Entregables
- Repositorio con README real (objetivo, requisitos, instalación, ejecución, pruebas).
- API REST con CRUD completo sobre al menos un recurso de dominio propio (no un "hello world").
- Validación de entrada y manejo de errores consistente en todos los endpoints.
- Modelo de datos persistente con al menos una relación y restricciones de integridad.
- Suite de tests que cubra el flujo principal y al menos un caso de error por endpoint.

## Criterios de éxito
- Una persona ajena al proyecto puede clonarlo y ejecutarlo siguiendo solo el README, sin preguntarte nada.
- Los tests pasan en una ejecución limpia (`git clone` + instalación + comando de test).
- Los endpoints devuelven errores claros y consistentes ante entradas inválidas.

## Conexión con el proyecto final
Esta API es la base de datos/dominio de negocio que se reutilizará y ampliará en los Proyectos 2 y 3, y finalmente se integrará en el proyecto final (semana 22-24).
