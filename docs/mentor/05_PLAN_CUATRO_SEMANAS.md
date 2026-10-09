# Plan de cuatro semanas — 3 horas diarias

## Principios
- Seis días de trabajo y un día de descanso/repaso ligero por semana, ajustable al horario real.
- 3 horas por día; aproximadamente 18 horas de práctica estructurada por semana.
- No avanzar por calendario si no se alcanzan los criterios de aceptación.
- Claude Code debe actuar como tutor y revisor; el estudiante debe predecir, ejecutar, explicar y verificar.
- Las semanas 1–4 son un punto de partida. El diagnóstico puede cambiar el orden.

## Rutina diaria sugerida
- 10 min: recuperación activa.
- 25 min: concepto nuevo.
- 25 min: demostración con predicción previa.
- 70 min: laboratorio.
- 25 min: pruebas y depuración.
- 15 min: explicar lo aprendido sin ayuda.
- 10 min: registro y tarea.

## Semana 1 — terminal, Git, sistemas operativos y método de diagnóstico
**Objetivo:** operar con confianza en PowerShell y Bash, entender rutas/procesos/recursos y trabajar con Git sin perder cambios.

- Día 1: diagnóstico inicial, terminales, rutas y directorios.
- Día 2: archivos, búsqueda, filtros, redirecciones y tuberías; diferenciar lectura de modificación.
- Día 3: procesos, memoria, almacenamiento, permisos y códigos de salida.
- Día 4: Git status/diff/log/branch; modelo mental del área de trabajo, staging y commits.
- Día 5: WSL2: archivos Windows/Linux, rutas, permisos y límites de cada entorno.
- Día 6: reto integrado de diagnóstico; explicar cada paso sin copiar una receta.

**Entregable:** informe de entorno y guía personal de 15 comandos con explicación y ejemplos.
**Aceptación:** completar un reto de navegación, búsqueda y Git sin acciones destructivas; explicar cómo proteger cambios no confirmados.

## Semana 2 — redes, HTTP, SQL y programación comprobable
**Objetivo:** diagnosticar una aplicación desde el cliente hasta la base de datos.

- Día 1: IP, DNS, puertos, TCP/UDP, localhost y firewall.
- Día 2: HTTP, métodos, códigos, cabeceras, JSON y uso prudente de `curl`.
- Día 3: SQL: tablas, tipos, PK/FK, restricciones, joins e índices básicos.
- Día 4: transacciones, atomicidad, consistencia, aislamiento y concurrencia con ejemplos pequeños.
- Día 5: fundamentos de Java o lenguaje principal, excepciones, estructuras de datos y tests unitarios.
- Día 6: laboratorio de API ficticia: diagnosticar un error usando logs y peticiones de lectura.

**Entregable:** esquema SQL pequeño, consultas de comprobación y tests para casos normales y límites.
**Aceptación:** explicar la ruta de una petición HTTP, escribir consultas con relaciones correctas y demostrar pruebas reproducibles.

## Semana 3 — backend, frontend, pruebas y seguridad
**Objetivo:** comprender las capas de una aplicación web y validar el comportamiento.

- Día 1: separación por capas, DTOs, validación y manejo consistente de errores.
- Día 2: REST, autenticación vs. autorización, sesiones/tokens y gestión de secretos.
- Día 3: frontend, componentes, estado, formularios y manejo de errores de API.
- Día 4: pruebas unitarias, integración y contrato; dobles de prueba y límites de cada prueba.
- Día 5: seguridad web básica: inyección, XSS, CORS, CSRF, validación, mínimo privilegio.
- Día 6: revisión guiada de un pequeño flujo de creación/consulta con criterios de aceptación.

**Entregable:** diseño o implementación pequeña con pruebas, errores documentados y revisión de seguridad.
**Aceptación:** el estudiante puede seguir un request desde interfaz a API y datos, y demostrar cómo probaría el flujo y sus fallos.

## Semana 4 — Docker, observabilidad, CI y uso disciplinado de IA
**Objetivo:** ejecutar y diagnosticar un sistema local reproducible, usando IA con control.

- Día 1: imágenes, contenedores, redes, puertos y volúmenes; inspección sin borrar.
- Día 2: levantar un servicio de laboratorio aprobado, leer logs y comprobar health/status.
- Día 3: variables de entorno, configuración local y protección de secretos.
- Día 4: pipeline CI conceptual: formato/lint, pruebas, build y artefactos.
- Día 5: IA aplicada al desarrollo: contexto, hipótesis, generación de tests, revisión y evaluación de respuestas.
- Día 6: ejercicio final: diagnosticar un fallo preparado, proponer corrección, obtener autorización, probar y documentar rollback.

**Entregable:** README de laboratorio con arquitectura, comandos reproducibles, resultados y límites conocidos.
**Aceptación:** ejecutar un flujo de diagnóstico y verificación sin depender de una respuesta no comprobada de la IA.

## Revisión al final de cada semana
1. Repetir dos retos sin mirar la solución.
2. Explicar una decisión técnica y una alternativa descartada.
3. Registrar errores y cómo se detectaron.
4. Actualizar el mapa de competencias con evidencia.
5. Elegir la siguiente semana según las brechas reales.

## Qué no intentar en el primer mes
- No desplegar a producción.
- No publicar puertos en Internet.
- No ejecutar limpiezas masivas de Docker.
- No migrar bases de datos reales.
- No usar credenciales reales en ejercicios.
- No aceptar código generado sin revisión y pruebas.
