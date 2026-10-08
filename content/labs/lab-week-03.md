---
id: lab-03
week: 3
xp: 25
title: "API REST con Spring Boot"
---

# Lab 03: APIs y Spring Boot

## Objetivo
Construir una API REST mínima con una ruta clara, validación y contratos simples.

## Duración
2 sesiones

## Requisitos
- Java 17+
- Maven o Gradle
- navegador para probar endpoints

## Tareas
1. Crear un proyecto Spring Boot con endpoint raíz.
2. Añadir un recurso con al menos dos rutas REST.
3. Definir una respuesta JSON consistente.
4. Añadir validación básica de entrada.

## Pista
Usa `@RestController`, `@GetMapping` y un DTO para mantener contratos claros.

## Pista 2
Divide el endpoint en controlador, servicio y DTO: el controlador valida/recibe la petición y delega el caso de uso sin exponer entidades internas.

## Pista 3
Prueba una respuesta exitosa y entradas inválidas con sus códigos HTTP. Mantén el mismo esquema JSON de error para que los clientes puedan manejarlo.

## Solución
```java
@RestController
@RequestMapping("/api")
public class DemoController {

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }
}
```

## Penalización XP
-2 XP por omitir validación o trabajar con un contrato ambiguo.

## Evidencia
Guardar el proyecto, screenshots del endpoint y notas de errores corregidos.

## Criterio de aprobación
La API responde con JSON válido y se puede explicar el flujo de petición.
