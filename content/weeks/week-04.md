---
id: 4
level: 2
xp: 25
title: "Semana 4 · Bases de datos"
---

# Semana 4: Bases de datos y persistencia

## Objetivo
Diseñar almacenamiento confiable para aplicaciones reales con integridad, consultas útiles y migraciones.

## Por qué importa
Sin una base de datos bien estructurada, la aplicación crece con errores, duplicación y fallos ocultos.

## Conceptos
- SQL
- PostgreSQL
- relaciones
- índices
- transacciones
- constraints
- normalización

## Arquitectura
```text
Aplicación
  ↓
ORM / consultas SQL
  ↓
Base de datos relacional
  ↓
Índices, restricciones y migraciones
```

## Ejemplo
```sql
CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL
);
```

## Laboratorio
Diseñar un esquema de negocio con clientes, pedidos y productos, y documentar las reglas de integridad.

## Preparación
- PostgreSQL instalado
- herramientas SQL
- esquema de negocio claro

## Paso 1
Definir entidades y relaciones clave.

## Paso 2
Crear tablas con constraints y claves foráneas.

## Paso 3
Validar consultas con datos reales y revisar rendimiento básico.

## Verificación
```sql
SELECT * FROM clientes;
EXPLAIN ANALYZE SELECT * FROM pedidos WHERE cliente_id = 1;
```

## Errores comunes
- no definir constraints,
- duplicar filas,
- consultar sin índice,
- ignorar transacciones.

## Debugging
Revisa cuántas filas se leen, qué índices existen y dónde se rompe la integridad.

## Reto
Optimizar una consulta lenta con análisis de esquema y uso de índices.

## BREAK THE SYSTEM
Introducir datos inconsistentes para detectar qué falla en la aplicación.

## RECOVERY
Corregir la estructura, añadir validación y reforzar la migración.

## Evaluación
- ¿El esquema refleja el dominio real?
- ¿Las reglas de negocio están protegidas?
- ¿Se entiende cómo cambiar la base de datos sin romper datos?

## Evidencia
Guardar el esquema SQL, migraciones y notas de diagnóstico.

## Criterio de aprobación
El estudiante debe poder explicar por qué cada relación y restricción existe.
