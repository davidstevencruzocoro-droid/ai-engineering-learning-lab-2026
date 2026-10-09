---
id: lab-04
week: 4
xp: 30
title: "Base de datos y diseño de dominio"
---

# Lab 04: Persistencia con base de datos

## Objetivo
Comenzar a estructurar datos persistentes y entender la diferencia entre memoria y almacenamiento real.

## Duración
2 sesiones

## Requisitos
- base de datos local
- conexión desde la aplicación
- migración o esquema simple

## Tareas
1. Crear una entidad con al menos dos campos importantes.
2. Guardar y recuperar datos desde la base de datos.
3. Validar la existencia de registros.
4. Evitar duplicados o fallos de integridad.

## Pista
Empieza con un modelo simple: usuario, tarea o proyecto.

## Pista 2
Define primero la identidad y las restricciones del dominio; usa una clave estable y una restricción única para que la integridad no dependa solo de la UI.

## Pista 3
Guarda y recupera un registro después de reiniciar la aplicación. Prueba ID inexistente y duplicado, y comprueba que la base de datos rechaza el estado inválido.

## Solución
```sql
CREATE TABLE tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT false
);
```

## Penalización XP
-3 XP por guardar datos sin validación, sin constraints o sin pruebas mínimas.

## Evidencia
Captura de la tabla, consulta de inserción y resultados de lectura.

## Criterio de aprobación
La aplicación guarda y recupera datos de forma consistente con integridad mínima.

## Ejercicio calificado
Disponible en la consola de práctica (sección "Calificar mi código", lenguaje SQL/SQLite). Escribe SQL que, al ejecutarse en SQLite:

```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT 0
);
INSERT INTO tasks (title, completed) VALUES ('ejemplo', 0);
INSERT INTO tasks (title, completed) VALUES ('otro ejemplo', 1);
```

El corrector verifica, consultando la base real tras ejecutar tu SQL: que la tabla `tasks` existe, que la columna `title` es `NOT NULL`, que hay al menos 2 filas, y que al menos una tiene `completed = 1`. Nota: el perfil SQL del sandbox es SQLite, no MySQL — usa `INTEGER PRIMARY KEY` en vez de `AUTO_INCREMENT`.
