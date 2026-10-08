---
id: lab-05
week: 5
xp: 30
title: "Refactorización de arquitectura"
---

# Lab 05: Arquitectura modular

## Objetivo
Separar responsabilidades para hacer una aplicación más mantenible, testeable y extensible.

## Duración
2 sesiones

## Requisitos
- aplicación con varias clases o servicios
- trazabilidad de dependencias
- pruebas de flujo básico

## Tareas
1. Identificar una responsabilidad mal mezclada.
2. Extraer la lógica a un servicio o capa separada.
3. Reducir acoplamiento entre componentes.
4. Validar que el flujo principal sigue funcionando.

## Pista
Si una clase hace mucho más de lo que parece, probablemente está mezclando responsabilidades.

## Pista 2
Busca una razón concreta para cambiar en cada bloque: acceso a datos, regla de negocio y presentación suelen evolucionar por motivos distintos.

## Pista 3
Extrae una responsabilidad por vez detrás de una interfaz pequeña y ejecuta las mismas pruebas antes y después para confirmar que el comportamiento observable no cambió.

## Solución
```java
public class OrderService {
    private final OrderRepository repository;

    public OrderService(OrderRepository repository) {
        this.repository = repository;
    }

    public Order createOrder(Order order) {
        return repository.save(order);
    }
}
```

## Penalización XP
-3 XP por mezclar lógica de negocio con acceso a datos o presentación.

## Evidencia
Guardar el diagrama de componentes, screenshots del flujo y notas de refactorización.

## Criterio de aprobación
La aplicación respeta responsabilidades claras y el flujo sigue siendo fácil de probar.
