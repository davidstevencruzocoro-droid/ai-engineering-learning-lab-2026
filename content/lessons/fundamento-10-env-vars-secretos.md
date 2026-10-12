---
id: fundamento-10
week: 3
order: 2
category: "Seguridad"
title: "Verificar una variable de entorno sin exponer el secreto"
---

# Verificar una variable de entorno sin exponer el secreto

## Pregunta de diagnóstico
¿Cómo verificarías que una variable de entorno sensible está configurada, sin exponer su valor?

## Modelo mental
El error más común es depurar "a lo rápido" con `console.log(process.env.LO_QUE_SEA)` o `echo $LO_QUE_SEA` — eso imprime el secreto completo en la terminal, en los logs, o potencialmente en una captura de pantalla o en un log centralizado que otra gente puede leer. Una vez impreso, hay que tratarlo como comprometido: lo correcto después de una fuga así es **rotarlo** (generar uno nuevo e invalidar el viejo), no solo "tener más cuidado" la próxima vez.

La forma segura de verificar sin exponer:
- **Existencia, no valor**: `if (process.env.CLAVE) { ... }` te dice si está definida, sin imprimirla.
- **Longitud o forma, no contenido**: imprimir `process.env.CLAVE.length` o los primeros/últimos 2-3 caracteres (`sk-...ab12`) confirma que "algo con la forma esperada" está ahí, sin revelar el secreto completo.
- **Un hash, no el valor**: comparar un hash del valor esperado contra un hash del valor real, si necesitas confirmar que es *exactamente* el valor correcto sin jamás tenerlo en texto plano en un log.

## En este proyecto
Este Lab ya aplica esta regla de forma consistente, no solo en teoría: el archivo `.gitignore` excluye explícitamente artefactos que podrían contener datos sensibles o generados (`node_modules/`, `dist/`, `generated/`, `*.log`), y en ningún punto del código de `server/index.mjs` o `server/security.mjs` se imprime el valor de una variable de entorno completa a los logs — cuando el servidor arranca, imprime cosas como el modelo de Ollama configurado (`OLLAMA_MODEL`, que no es un secreto) pero nunca una clave o token.

Si este proyecto llegara a necesitar una clave de API real en el futuro (por ejemplo, para un proveedor de IA en la nube en vez de Ollama local), la forma correcta de verificar que quedó bien configurada en tu `.env` sería algo como `console.log('API key configurada:', Boolean(process.env.API_KEY))` — confirma presencia sin imprimir el valor — y nunca commitear el archivo `.env` al repositorio (por eso herramientas como este mismo flujo de trabajo escanean en busca de secretos antes de cada commit).

## Para verificar que entendiste
- ¿Por qué imprimir `process.env.CLAVE.length` es más seguro que imprimir `process.env.CLAVE`, pero sigue dando información útil para depurar?
- Si accidentalmente hiciste `git commit` de un archivo `.env` con una clave real y ya hiciste `git push`, ¿alcanza con borrar el archivo en un commit nuevo? ¿Por qué sí o por qué no?
- ¿Qué verificarías primero si una aplicación falla diciendo "falta configurar la clave de API", sin necesitar ver el valor real de esa clave?

## Caso avanzado
Este Lab no compara claves secretas en su código hoy (usa Ollama local, sin API key), así que esto es una extensión conceptual más allá de lo que hace este proyecto — pero es el error de seguridad real detrás de vulnerabilidades bien documentadas en sistemas de producción: comparar un secreto con el operador normal `===` (o `==`) puede filtrar información a través del **tiempo** que tarda la comparación.

`"abc" === "abd"` falla en la primera posición distinta; `"abc" === "xyz"` también falla rápido si la primera letra ya difiere, pero una comparación que coincide en los primeros caracteres antes de fallar tarda, en teoría, una fracción de nanosegundo más. Si un atacante puede medir con precisión cuánto tarda tu servidor en responder "clave incorrecta", y puede probar muchísimas veces, podría ir adivinando la clave carácter por carácter observando qué intento tarda ligeramente más — un "timing attack". Por eso, para comparar secretos (tokens, hashes de contraseñas, firmas HMAC), Node.js ofrece `crypto.timingSafeEqual()`, que siempre tarda el mismo tiempo sin importar en qué posición difieren los datos.

Es un ataque difícil de ejecutar en la práctica (requiere medir tiempos de red con mucha precisión), pero es la razón por la que ningún sistema serio de autenticación compara secretos con `===` directamente.

**Para verificar que entendiste (avanzado):** ¿por qué una comparación de cadenas que termina "en cuanto encuentra la primera diferencia" puede filtrar información útil para un atacante, aunque nunca revele el valor del secreto directamente?
