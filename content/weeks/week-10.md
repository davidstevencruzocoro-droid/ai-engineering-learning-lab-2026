---
id: 10
level: 3
xp: 25
title: "Semana 10 · Seguridad"
---

# Semana 10: Seguridad y resiliencia

## Objetivo
Entender cómo proteger una aplicación desde el diseño, no solo desde el parche final.

## Por qué importa
La seguridad no es un lujo ni un detalle opcional: es una propiedad del sistema.

## Conceptos
- OWASP
- autenticación
- autorización
- secrets
- validación de entradas
- resiliencia

## Arquitectura
```text
Cliente
  ↓
API
  ↓
Validación + auth + policy
  ↓
Datos y servicios externos
```

## Profundización técnica
Tres implementaciones concretas que separan "sé lo que es seguridad" de "sé construirla":

**Contraseñas — nunca `===`, nunca sin salt.** Comparar contraseñas en texto plano o con un hash sin salt (como MD5 directo) es vulnerable a tablas rainbow. La forma correcta usa un algoritmo diseñado para ser lento a propósito:
```javascript
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash(plainPassword, 12); // 12 = cost factor
const matches = await bcrypt.compare(plainPassword, hash);
```
El "cost factor" (12) controla cuánto tarda el hash — a propósito lento, para que probar millones de contraseñas por segundo (fuerza bruta) sea económicamente inviable, aunque para un solo login la demora sea imperceptible.

**SQL — parametrizar, nunca concatenar.** Esta es la diferencia entre código seguro y una inyección SQL de libro de texto:
```javascript
// VULNERABLE: el input del usuario se concatena directo al SQL
db.query(`SELECT * FROM users WHERE email = '${email}'`);
// Un email malicioso: ' OR '1'='1 devuelve TODOS los usuarios

// SEGURO: el driver trata el valor como dato, nunca como código SQL
db.query('SELECT * FROM users WHERE email = ?', [email]);
```
El placeholder (`?` o `$1` según el driver) hace que la base de datos reciba el valor por un canal separado del texto de la consulta — no importa qué caracteres especiales traiga `email`, nunca se interpretan como SQL.

**Rate limiting — limitar intentos, no solo validar credenciales.** Sin límite de intentos, un endpoint de login es vulnerable a fuerza bruta aunque las contraseñas estén bien hasheadas:
```javascript
const attempts = new Map(); // en producción: Redis, no memoria del proceso
function checkLoginAttempts(ip) {
  const record = attempts.get(ip) || { count: 0, resetAt: Date.now() + 60_000 };
  if (Date.now() > record.resetAt) { record.count = 0; record.resetAt = Date.now() + 60_000; }
  record.count += 1;
  attempts.set(ip, record);
  return record.count <= 5; // máximo 5 intentos por minuto
}
```

## Laboratorio
Revisar un servicio con fallos comunes y corregir la causa raíz en lugar de aplicar soluciones superficiales.

## Preparación
- entorno seguro de pruebas
- acceso a endpoints con datos sensibles
- análisis de logs y respuestas

## Paso 1
Mapear los puntos de entrada y las rutas más críticas.

## Paso 2
Aplicar validación y control de acceso mínimo necesario.

## Paso 3
Medir el impacto real mediante pruebas de seguridad y observación del comportamiento.

## Verificación
```bash
curl -i http://localhost:8080/api/admin
```

## Errores comunes
- falta de validación,
- tokens expuestos,
- secretos en repositorio,
- permisos demasiado amplios.

## Debugging
Asume que la vulnerabilidad es un problema de diseño, no solo de código.

## Reto
Cambiar una política de seguridad para comprobar si un flujo protegido se rompe de forma predecible.

## BREAK THE SYSTEM
Forzar un caso límite con entrada anómala o permisos incorrectos.

## RECOVERY
Corregir el control de acceso y documentar la decisión para evitar regresiones.

## Evaluación
- ¿La aplicación valida entradas?
- ¿Se minimiza el alcance de permisos?
- ¿La evidencia demuestra la corrección?

## Evidencia
Guardar pull requests, notas de seguridad y tests de validación.

## Criterio de aprobación
El estudiante debe poder explicar los riesgos principales y cómo evaluar su impacto.
