---
id: 6
level: 2
xp: 25
title: "Semana 6 · Testing"
---

# Semana 6: Testing y calidad de software

## Objetivo
Generar confianza mediante pruebas diseñadas para detectar regresiones y validar comportamientos críticos.

## Por qué importa
La velocidad de entregas no sirve si cada cambio pone en riesgo el sistema.

## Conceptos
- unit tests
- integration tests
- mock
- test doubles
- E2E

## Arquitectura
```text
Cambio de código
  ↓
Pruebas automatizadas
  ↓
Regresión detectada o evitada
  ↓
Entrega segura
```

## Ejemplo
```java
@Test
void debeCrearClienteCuandoDatosSonValidos() {
  assertDoesNotThrow(() -> servicio.crearCliente("Ana"));
}
```

## Laboratorio
Crear una suite de pruebas para un flujo de negocio con éxito, error controlado y casos límite.

## Preparación
- framework de pruebas
- casos de negocio claros
- criterios de aceptación definidos

## Paso 1
Especificar qué debe pasar y qué debe fallar.

## Paso 2
Implementar pruebas unitarias e integración ligera.

## Paso 3
Revisar cobertura y eliminar pruebas frágiles o redundantes.

## Verificación
```bash
./mvnw test
```

## Errores comunes
- probar solo el camino feliz,
- usar mocks sin propósito,
- no validar errores esperados,
- pruebas demasiado acopladas al código.

## Debugging
Revisa qué prueba falló, qué suposición estaba rota y cuánta evidencia hay sobre la causa.

## Reto
Detectar una regresión que no estaba cubierta en suite anterior.

## BREAK THE SYSTEM
Introducir un defecto que rompa la validación y corregirlo con evidencia.

## RECOVERY
Documentar la causa raíz y reforzar la prueba para impedir la regresión en el futuro.

## Evaluación
- ¿La prueba cubre tanto el éxito como el fallo?
- ¿La suite detecta cambios peligrosos?
- ¿La documentación de errores y contratos es útil?

## Evidencia
Guardar el listado de pruebas, ejecuciones y patrones de regresión.

## Criterio de aprobación
El estudiante debe poder defender por qué cada prueba tiene valor real.
