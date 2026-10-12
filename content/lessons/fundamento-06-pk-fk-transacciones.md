---
id: fundamento-06
week: 2
order: 2
category: "Bases de datos"
title: "Clave primaria, clave foránea y transacciones"
---

# Clave primaria, clave foránea y transacciones

## Pregunta de diagnóstico
Explica qué es una clave primaria, una clave foránea, y por qué existen las transacciones.

## Modelo mental
- **Clave primaria (PK)**: la columna (o combinación de columnas) que identifica de forma única cada fila de una tabla. No puede repetirse ni ser nula. Es el "DNI" de la fila.
- **Clave foránea (FK)**: una columna en una tabla que referencia la clave primaria de otra tabla, para expresar una relación ("este pedido pertenece a este cliente"). La base de datos puede rechazar insertar una FK que apunte a una PK que no existe — eso se llama integridad referencial.
- **Transacción**: un grupo de operaciones que se ejecutan como una sola unidad indivisible — o pasan *todas*, o no pasa *ninguna*. Existen porque muchas operaciones reales requieren varios pasos (restar saldo de una cuenta, sumarlo a otra) y un fallo a mitad de camino dejaría los datos en un estado inconsistente si no hubiera una forma de "deshacer todo" automáticamente.

## En este proyecto
El ejercicio calificado de SQL de este Lab (`content/labs/lab-week-04.md`, sección "Ejercicio calificado") usa exactamente esto: el arnés de verificación (`SQL_TASKS_SCHEMA_HARNESS` en `server/grading.mjs`) comprueba con `GRADE_CHECK:tabla_tasks_existe` que la tabla fue creada, y con `GRADE_CHECK:columna_title_not_null` que la restricción `NOT NULL` sobre `title` quedó bien definida — es decir, valida el diseño de la tabla, no solo que "algo" se insertó.

Sobre transacciones: este Lab no las ejercita todavía en su propio código (el sandbox ejecuta sentencias SQL simples, no secuencias multi-paso que necesiten atomicidad), pero el concepto aparece en la arquitectura del servidor de otra forma: `runSandbox()` trata la ejecución completa de un contenedor Docker como una unidad — o el contenedor corre y produce una salida completa, o falla y se descarta por completo (gracias a `--rm`); no hay un estado intermedio donde "medio contenedor" quedó corriendo. La misma idea de "todo o nada" que motiva las transacciones en bases de datos.

## Para verificar que entendiste
- Si intentas insertar una fila en una tabla `pedidos` con `cliente_id = 999` pero no existe ningún cliente con `id = 999`, ¿qué debería hacer la base de datos si la columna `cliente_id` es una FK bien definida?
- ¿Por qué el chequeo `columna_title_not_null` del arnés de este Lab es una prueba sobre el *diseño* de la tabla y no sobre los *datos* que contiene?
- Describe una operación de dos pasos (por ejemplo, transferir dinero entre dos cuentas) donde NO usar una transacción podría dejar los datos corruptos si el proceso se interrumpe a mitad de camino.

## Caso avanzado
Esto va más allá de lo que usa este proyecto hoy (el sandbox SQL de este Lab ejecuta sentencias simples, no transacciones multi-paso concurrentes), pero es la razón real por la que las transacciones tienen "niveles de aislamiento": incluso con una transacción bien envuelta en `BEGIN`/`COMMIT`, dos transacciones concurrentes pueden interferirse de formas sutiles si el nivel de aislamiento es débil.

El caso clásico es el "lost update": la transacción A lee el saldo de una cuenta (100), la transacción B lee el mismo saldo (100) antes de que A termine, A resta 30 y guarda 70, B resta 50 sobre su lectura original de 100 y guarda 50 — el descuento de A quedó completamente perdido, aunque cada transacción individualmente parecía correcta. Los niveles de aislamiento más estrictos (como `SERIALIZABLE`) previenen esto obligando a que una de las dos transacciones espere o falle y se reintente; los más débiles (`READ COMMITTED`) son más rápidos pero permiten justamente este tipo de pérdida silenciosa.

Esto conecta con lo que ya viste en "Proceso, hilo, RAM": así como el single-thread de Node evita condiciones de carrera en memoria mientras no haya un `await` entre verificar y actuar, una base de datos necesita mecanismos explícitos (bloqueos, niveles de aislamiento) para la misma garantía cuando el "verificar" y el "actuar" son dos transacciones separadas que pueden intercalarse.

**Para verificar que entendiste (avanzado):** en el ejemplo del "lost update", ¿en qué momento exacto tendría que bloquearse la fila de la cuenta para que la transacción B no pudiera leer un saldo que A está a punto de cambiar?
