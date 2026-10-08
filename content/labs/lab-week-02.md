---
id: lab-02
week: 2
xp: 25
title: "Sistema de gestión con Java"
---

# Laboratorio 2: Sistema de gestión con Java

## Objetivo
Aplicar fundamentos de programación con separación de responsabilidades.

## Resultado esperado
- entidades con datos y validación,
- servicios con lógica de negocio,
- colecciones bien manejadas,
- código legible y refactorizable.

## Instrucciones
1. Diseña entidades principales y sus relaciones.
2. Implementa operaciones básicas de gestión.
3. Añade validación y manejo de errores con excepciones.
4. Refactoriza para reducir acoplamiento.

## Pista
Primero define los datos, luego la lógica y por último la salida.

## Pista 2
Modela cada entidad con campos y responsabilidades claras; concentra las operaciones de alta, consulta y actualización en una capa de servicio.

## Pista 3
Prueba datos válidos, IDs inexistentes y duplicados. Mantén las reglas del dominio fuera de la entrada/salida y verifica que los errores no dejen colecciones en un estado parcial.

## Solución
Utiliza clases de dominio separadas de la capa de servicio y deja una interfaz clara para cada operación.

## Penalización XP
Si mezclas lógica y presentación, pierdes 12 XP.

## Criterio de aprobación
Debe haber claridad de modelo y flujo principal ejecutado.
