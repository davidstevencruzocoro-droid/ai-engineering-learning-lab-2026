---
id: 3
level: 2
xp: 25
title: "Semana 3 · Spring Boot"
---

# Semana 3: Spring Boot y APIs REST

## Objetivo
Aprender a construir APIs robustas con Java usando Spring Boot, validación y manejo claro de errores.

## Por qué importa
La mayoría de productos reales dependen de servicios HTTP que se comunican entre clientes, frontends, integraciones y datos.

## Conceptos
- REST
- controladores
- servicios
- repositorios
- DTO
- validación
- manejo de errores

## Arquitectura
```text
Cliente HTTP
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Base de datos / persistencia
```

## Ejemplo
```java
@RestController
@RequestMapping("/api/clientes")
public class ClienteController {
  @GetMapping
  public List<ClienteDto> listar() {
    return List.of();
  }
}
```

## Laboratorio
Crear una API con CRUD para clientes, productos o tareas, con validaciones y respuestas estandarizadas.

## Preparación
- JDK 17+
- Maven o Gradle
- IDE con soporte Java
- conocimiento de REST

## Paso 1
Definir entidades y DTOs para las operaciones del negocio.

## Paso 2
Implementar controladores, servicios y validaciones.

## Paso 3
Añadir pruebas para casos de éxito y de error.

## Verificación
```bash
./mvnw test
./mvnw spring-boot:run
```

## Errores comunes
- mezclar DTO y entidad,
- no validar entradas,
- devolver errores ambiguos,
- ignorar pruebas de integración.

## Debugging
Revisa el flujo de request → controller → service → repository y los logs de validación.

## Reto
Crear una API con malas prácticas y luego refactorizarla con capas limpias.

## BREAK THE SYSTEM
Forzar errores en validación y ver cómo responde la API.

## RECOVERY
Corregir el contrato, documentar el error y volver a probar la ruta principal.

## Evaluación
- ¿El API expone endpoints coherentes?
- ¿La validación evita entradas inválidas?
- ¿Los errores son explicativos y manejados?

## Evidencia
Guardar la API final, tests ejecutados y notas de refactorización.

## Criterio de aprobación
El estudiante debe poder explicar cada capa y justificar la separación entre dominio, servicio y transporte.
