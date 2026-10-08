---
id: lab-10
week: 10
xp: 40
title: "Seguridad y control de acceso"
---

# Lab 10: Romper y corregir una aplicación vulnerable

## Objetivo
Construir deliberadamente una aplicación con al menos dos vulnerabilidades del OWASP Top 10, explotarlas tú mismo en tu propio entorno, y corregirlas con evidencia del antes/después.

## Duración
2 sesiones

## Requisitos
- una app propia con un formulario y una consulta a base de datos (puede ser la del lab 3 o 4)
- entorno local o contenedor propio (nunca un sistema de terceros)

## Tareas
1. Introduce una inyección SQL deliberada: concatena el input del usuario directamente en la query en vez de usar parámetros.
2. Introduce un XSS reflejado: imprime un parámetro de la URL directamente en el HTML sin escaparlo.
3. Explota ambas tú mismo con inputs de prueba y documenta qué conseguiste ver o ejecutar.
4. Corrige ambas vulnerabilidades y vuelve a intentar la explotación para confirmar que ya no funciona.

## Pista
Las dos vulnerabilidades más comunes y más fáciles de introducir sin darte cuenta son: concatenar strings en SQL y confiar en que el input del usuario "nunca tendrá HTML".

## Pista 2
Usa únicamente datos y un entorno propio. Para SQL, compara concatenación con consultas parametrizadas; para XSS, identifica el contexto de salida y escapa el dato antes de insertarlo.

## Pista 3
Conserva el mismo caso de prueba de explotación antes y después del arreglo. Repite ambos ataques al final y documenta qué control impide cada uno sin probar sistemas de terceros.

## Solución
```java
// Vulnerable: concatenación directa
String query = "SELECT * FROM users WHERE email = '" + input + "'";

// Corregido: consulta parametrizada
PreparedStatement stmt = connection.prepareStatement(
    "SELECT * FROM users WHERE email = ?"
);
stmt.setString(1, input);
```
```javascript
// Vulnerable: HTML sin escapar
el.innerHTML = `Hola ${nombreDesdeURL}`;

// Corregido: texto plano, nunca HTML desde input no confiable
el.textContent = `Hola ${nombreDesdeURL}`;
```

## Penalización XP
-10 XP si la corrección no incluye evidencia de que la explotación original funcionaba y de que dejó de funcionar.

## Evidencia
Captura del ataque funcionando (antes), captura del mismo intento fallando (después), y una lista de qué otra categoría del OWASP Top 10 revisarías a continuación en una auditoría real.

## Criterio de aprobación
Las dos vulnerabilidades quedan corregidas con consultas parametrizadas y output correctamente escapado, y puedes explicar por qué cada corrección funciona (no solo que "ya no da error").
