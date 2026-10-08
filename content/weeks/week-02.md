---
id: 2
level: 1
xp: 25
title: "Semana 2 · Java y fundamentos"
---

# Semana 2: Java y fundamentos de programación

## Objetivo

Reforzar los fundamentos de programación y de diseño de software usando Java como lenguaje de referencia.

## Por qué importa

Muchas decisiones de arquitectura y calidad de software se basan en principios básicos: composición, cohesion, encapsulación y manejo de errores.

## Conceptos

- POO
- interfaces
- herencia
- composición
- excepciones
- colecciones
- streams
- SOLID

## Arquitectura

```text
Clase / entidad
  ↓
Servicio / lógica
  ↓
Repositorio / acceso a datos
  ↓
Controlador / interfaz externa
```

## Ejemplo

```java
public class Cliente {
    private final String nombre;

    public Cliente(String nombre) {
        this.nombre = nombre;
    }

    public String getNombre() {
        return nombre;
    }
}
```

## Laboratorio

Construir un sistema de gestión simple con clientes, productos y tareas básicas, con separación clara entre dominio y servicios.

## Preparación

- JDK instalado
- editor o IDE configurado
- estructura de carpetas clara

## Paso 1

Diseñar las entidades y sus responsabilidades.

## Paso 2

Implementar lógica de negocio con validación y excepciones.

## Paso 3

Refactorizar para mejorar claridad y reducir acoplamiento.

## Verificación

Compilar y ejecutar la aplicación, verificando que los casos principales funcionen.

## Errores comunes

- mezclar lógica de negocio con entrada/salida,
- no validar datos,
- duplicar responsabilidades,
- usar herencia donde basta composición.

## Debugging

Ver el flujo de ejecución y comprobar qué clase está respondiendo a cada operación.

## Reto

Refactorizar una versión con código mal diseñado y convertirla en una estructura más sostenible.

## Reto avanzado

Agregar tests para cubrir casos límite y errores esperados.

## BREAK THE SYSTEM

Introducir errores deliberados y detectar cómo cambian los resultados.

## RECOVERY

Volver al diseño limpio y validar la mejora con pruebas.

## Evaluación

- ¿La aplicación sigue principios claros?
- ¿Se maneja error apropiadamente?
- ¿El código es legible y mantenible?

## Evidencia

Guardar el código final, notas de refactorización y pruebas ejecutadas.

## Criterio de aprobación

El estudiante debe poder explicar qué hace cada capa del sistema y por qué está organizada así.
