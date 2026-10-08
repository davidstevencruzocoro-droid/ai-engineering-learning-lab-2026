---
id: 5
level: 2
xp: 25
title: "Semana 5 · Arquitectura"
---

# Semana 5: Arquitectura y diseño de software

## Objetivo
Organizar una aplicación de forma mantenible y preparar la base para crecer sin caos.

## Por qué importa
La arquitectura no es una moda; es la diferencia entre un proyecto que evoluciona y uno que se vuelve frágil.

## Conceptos
- capas
- clean architecture
- DDD básico
- patrones de diseño
- SOLID

## Arquitectura
```text
Dominio
  ↓
Aplicación
  ↓
Infraestructura
  ↓
Interfaces / UI / API
```

## Ejemplo
```java
public interface ProductoService {
  List<Producto> listar();
}
```

## Laboratorio
Tomar una app con mala separación y refactorizarla para que cada capa responda a un objetivo claro.

## Preparación
- conocer la app actual
- identificar dependencias ocultas
- mapear responsabilidades

## Paso 1
Detectar acoplamientos y responsabilidades mezcladas.

## Paso 2
Extraer una capa de dominio y una de servicios.

## Paso 3
Validar que el cambio mantiene el comportamiento y mejora la legibilidad.

## Verificación
- revisar imports,
- analizar acoplamientos,
- ejecutar pruebas y verificar el comportamiento.

## Errores comunes
- crear capas vacías sin propósito,
- mezclar infraestructura y dominio,
- depender del UI para lógica de negocio.

## Debugging
Haz un mapa de dependencias y revisa qué clase conoce demasiado a otra.

## Reto
Comparar dos arquitecturas y decidir cuál encaja mejor para el caso.

## BREAK THE SYSTEM
Forzar un cambio transversal y ver cómo se rompe el diseño.

## RECOVERY
Reestructurar con un objetivo claro, documentar el porqué y validar el resultado.

## Evaluación
- ¿Las capas tienen responsabilidades claras?
- ¿El código es más fácil de probar?
- ¿La estructura es extensible?

## Evidencia
Guardar la refactorización, notas de diseño y comparación entre enfoques.

## Criterio de aprobación
El estudiante debe poder explicar cómo cambia la arquitectura cuando el sistema crece.
