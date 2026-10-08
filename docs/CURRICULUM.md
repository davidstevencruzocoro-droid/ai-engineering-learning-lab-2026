# AI Engineering Learning Lab 2026 - Curriculum

## 1. Propósito del curso

Este programa no busca enseñar únicamente conceptos aislados. Su objetivo es formar a una persona capaz de:

- construir software real,
- integrar IA de forma útil,
- automatizar procesos,
- operar sistemas con rigor,
- evaluar rendimiento y costes,
- documentar decisiones y riesgos,
- desplegar soluciones con seguridad y control.

La filosofía central es:

`Aprender → Construir → Probar → Romper → Diagnosticar → Corregir → Medir → Documentar → Desplegar`

---

## 2. Ruta profesional
a

El programa se organiza en 24 semanas distribuidas en niveles progresivos.

### Nivel 1 - Fundamentos
- Semana 1: Entorno profesional
- Semana 2: Java y fundamentos de programación

### Nivel 2 - Ingeniería de software
- Semana 3: Spring Boot
- Semana 4: Bases de datos
- Semana 5: Arquitectura
- Semana 6: Testing

### Nivel 3 - Backend y datos
- Semana 7: Docker
- Semana 8: CI/CD
- Semana 9: Linux + Cloud
- Semana 10: Ciberseguridad defensiva
- Semana 11: Integraciones
- Semana 12: n8n

### Nivel 4 - IA aplicada
- Semana 13: IA aplicada
- Semana 14: Prompt engineering
- Semana 15: RAG
- Semana 16: Agentes
- Semana 17: Evaluación de IA
- Semana 18: LLMOps

### Nivel 5 - Arquitectura y producción
- Semana 19: Sistemas distribuidos
- Semana 20: Performance
- Semana 21: Producto
- Semana 22: Proyecto final I
- Semana 23: Proyecto final II
- Semana 24: Proyecto final III

---

## 3. Plan detallado de 24 semanas

### Semana 1 - Entorno profesional
**Objetivo:** preparar el entorno de trabajo profesional.

Temas:
- terminal y shell
- Linux y WSL
- Git y GitHub
- VS Code
- variables de entorno
- estructura de proyectos

Laboratorio:
- crear un proyecto desde cero
- añadir README
- hacer commits
- documentar cómo ejecutar el proyecto

Reto:
- recrear el proyecto en una máquina limpia

Break the system:
- romper la configuración del entorno y diagnosticarla

---

### Semana 2 - Java / fundamentos de programación
**Objetivo:** reforzar los fundamentos de ingeniería de software.

Temas:
- POO
- interfaces
- herencia
- composición
- SOLID
- excepciones
- colecciones
- streams
- concurrencia básica

Laboratorio:
- construir un sistema de gestión sencillo

Reto:
- refactorizar código mal diseñado

Break the system:
- introducir bugs y localizarlos con debugging estructurado

---

### Semana 3 - Spring Boot
**Objetivo:** dominar APIs REST con Java.

Temas:
- REST
- controllers
- services
- repositories
- DTO
- validación
- manejo de excepciones
- configuración

Laboratorio:
- crear una API con CRUD completo
- validación y manejo de errores
- tests y documentación

Reto:
- mejorar una API con mala estructuración de capas

---

### Semana 4 - Bases de datos
**Objetivo:** construir sistemas de almacenamiento robustos.

Temas:
- SQL
- PostgreSQL
- relaciones
- índices
- transacciones
- constraints
- normalización
- migraciones

Laboratorio:
- diseñar una base de datos de negocio

Reto:
- optimizar consultas lentas

Break the system:
- simular condiciones de carrera y diagnósticar la causa

---

### Semana 5 - Arquitectura
**Objetivo:** entender cómo organizar software de forma mantenible.

Temas:
- capas
- clean architecture
- hexagonal architecture
- DDD básico
- SOLID
- patrones de diseño

Laboratorio:
- refactorizar una aplicación con mala arquitectura

Reto:
- comparar tres enfoques arquitectónicos y justificar la elección

---

### Semana 6 - Testing
**Objetivo:** crear confianza mediante validación sistemática.

Temas:
- unit tests
- integration tests
- contract tests
- mocking
- test doubles
- E2E
- Cypress

Laboratorio:
- crear una suite completa que compruebe tanto éxito como fallo controlado

Reto:
- detectar regresiones en un sistema con pruebas insuficientes

Break the system:
- introducir un defecto que haga fallar la suite y corregirlo

---

### Semana 7 - Docker
**Objetivo:** aprender a encapsular y desplegar aplicaciones reproducibles.

Temas:
- Dockerfile
- imágenes
- contenedores
- redes
- volúmenes
- Compose
- healthchecks

Laboratorio:
- dockerizar frontend, backend y base de datos

Reto:
- diagnosticar un contenedor que no arranca correctamente

---

### Semana 8 - CI/CD
**Objetivo:** automatizar validación y entregas.

Temas:
- GitHub Actions
- pipelines
- builds
- tests
- artefactos
- releases
- secretos

Laboratorio:
- construir un pipeline de commit → build → test → docker → deploy

Reto:
- detectar un pipeline que falla por secretos o entorno incorrecto

---

### Semana 9 - Linux + Cloud
**Objetivo:** preparar infraestructura real para despliegue.

Temas:
- SSH
- Nginx
- DNS
- HTTPS
- certificados
- firewall
- procesos
- systemd
- VPS

Laboratorio:
- desplegar una aplicación real en un entorno personal o autorizado

Reto:
- corregir un problema de servicio no disponible

---

### Semana 10 - Ciberseguridad defensiva
**Objetivo:** aprender a proteger sistemas y detectar riesgos.

Temas:
- OWASP
- autenticación
- autorización
- sesiones
- JWT
- secretos
- SQL injection
- XSS
- CSRF
- SSRF
- rate limiting
- logs y auditoría

Laboratorio:
- crear una app vulnerable controlada y luego corregirla tras vulnerabilidad detectada

Reto:
- evaluar una aplicación con riesgo de acceso no autorizado

Break the system:
- ejecutar pruebas sobre entornos propios o autorizados únicamente

---

### Semana 11 - Integraciones
**Objetivo:** aprender a conectar sistemas externos.

Temas:
- APIs
- webhooks
- OAuth
- API keys
- rate limits
- retries
- idempotencia
- colas

Laboratorio:
- integrar varios servicios y manejar errores de red y de negocio

Reto:
- implementar un flujo robusto con reintentos controlados

---

### Semana 12 - n8n
**Objetivo:** automatizar flujos empresariales.

Temas:
- triggers
- webhooks
- HTTP
- workflows
- credenciales
- condiciones
- loops
- errores
- retries

Laboratorio:
- crear una automatización con cliente, validación, IA, CRM y notificación

Reto:
- detectar y corregir un flujo con condiciones mal definidas

---

### Semana 13 - IA aplicada
**Objetivo:** construir servicios de IA con criterio y control.

Temas:
- LLM
- tokens
- contexto
- temperatura
- structured output
- function calling
- tool calling
- embeddings
- coste
- latencia

Laboratorio:
- construir un servicio con timeout, retry, validación, logging y control de costes

Reto:
- reducir el consumo sin perder calidad funcional

---

### Semana 14 - Prompt engineering
**Objetivo:** desarrollar prompting útil, no mágico.

Temas:
- system instructions
- contexto
- restricciones
- ejemplos
- schemas
- evaluación
- adversarial prompts

Laboratorio:
- construir un conjunto de 50 casos de evaluación comparando prompt A/B/C

Reto:
- medir la diferencia entre varios enfoques de prompting

---

### Semana 15 - RAG
**Objetivo:** construir recuperación de conocimiento grounded y verificable.

Temas:
- embeddings
- vector stores
- chunking
- retrieval
- reranking
- metadata
- grounding
- citations

Laboratorio:
- crear un RAG con documentos propios
- mostrar fuentes
- rechazar preguntas sin evidencia

Reto:
- mejorar la calidad y precisión de las respuestas

---

### Semana 16 - Agentes
**Objetivo:** construir agentes con responsabilidad y límites.

Temas:
- tool calling
- planning
- state
- memory
- tools
- permissions
- guardrails

Laboratorio:
- crear un agente que consulte cliente, inventario y agenda con permisos definidos

Reto:
- evitar acciones no autorizadas

---

### Semana 17 - Evaluación de IA
**Objetivo:** valorar sistemas de IA con métricas reales.

Temas:
- datasets
- accuracy
- precision
- recall
- groundedness
- hallucination
- latency
- cost

Laboratorio:
- crear una evaluación automática de calidad y fiabilidad

Reto:
- decidir entre dos modelos evaluando costo y rendimiento

---

### Semana 18 - LLMOps
**Objetivo:** operar IA de forma sostenida.

Temas:
- observabilidad
- tracing
- logging
- versionado de prompts
- versionado de modelos
- coste
- latencia
- evaluaciones

Laboratorio:
- crear un dashboard básico de IA con observabilidad

Reto:
- detectar una degradación de calidad o un aumento de coste inesperado

---

### Semana 19 - Sistemas distribuidos
**Objetivo:** construir soluciones tolerantes a fallos.

Temas:
- queues
- events
- workers
- caching
- retries
- circuit breaker
- consistency

Laboratorio:
- crear una arquitectura resiliente con varias capas de procesamiento

Reto:
- manejar fallos de una dependencia externa sin romper el sistema

---

### Semana 20 - Performance
**Objetivo:** aprender a medir y mejorar rendimiento.

Temas:
- profiling
- load testing
- caching
- índices
- concurrency
- bottlenecks

Laboratorio:
- romper el rendimiento del sistema y optimizarlo

Reto:
- reducir tiempo de respuesta y consumo de recursos

---

### Semana 21 - Producto
**Objetivo:** convertir una solución técnica en un producto con sentido.

Temas:
- requisitos
- UX
- métricas
- coste
- pricing
- usuarios
- MVP

Laboratorio:
- transformar un ejercicio técnico en un producto mínimo viable

Reto:
- definir una propuesta con valor de negocio y mantenibilidad

---

### Semana 22 - Proyecto final I
**Objetivo:** diseño del proyecto final.

Debe incluir:
- problema
- usuarios
- arquitectura
- base de datos
- APIs
- IA
- seguridad
- automatización

---

### Semana 23 - Proyecto final II
**Objetivo:** construir la solución.

Debe incluir:
- frontend
- backend
- base de datos
- IA
- RAG
- agente
- n8n
- Docker
- CI/CD
- observabilidad

---

### Semana 24 - Proyecto final III
**Objetivo:** producción y demostración.

Debe incluir:
- deployment
- HTTPS
- seguridad
- backups
- monitoring
- documentación
- demo
- portfolio
- case study

---

## 4. Formato de cada lección

Cada módulo debe seguir esta estructura:

- Título
- Objetivo
- Por qué importa
- Conceptos
- Arquitectura
- Ejemplo
- Laboratorio
- Preparación
- Paso 1
- Paso 2
- Paso 3
- Verificación
- Errores comunes
- Debugging
- Reto
- Reto avanzado
- Break the system
- Recovery
- Evaluación
- Evidencia
- Criterio de aprobación

---

## 5. Sistema de evaluación

### Ponderación
- Teoría: 20%
- Laboratorio: 40%
- Debugging: 15%
- Break the system: 10%
- Documentación: 5%
- Proyecto: 10%

### Niveles
- 0-49: No aprobado
- 50-69: Básico
- 70-79: Competente
- 80-89: Avanzado
- 90-100: Profesional

---

## 6. Sistema XP

- +10 XP: concepto
- +25 XP: laboratorio
- +40 XP: reto
- +50 XP: break system
- +100 XP: proyecto

Se debe mostrar:
- XP total
- nivel
- progreso general
- semanas completadas
- laboratorios completados
- retos completados
- proyectos

---

## 7. Proyectos acumulativos y proyecto final

El programa se construye sobre 6 proyectos acumulativos, cada uno apoyado en el anterior, definidos como contenido real en `content/projects/project-01.md` a `project-06.md` (visión, problema, stack, entregables y criterios de éxito de cada uno):

1. **API profesional** (semanas 1-4) — API REST con persistencia real, reproducible desde el README.
2. **Sistema full stack** (semanas 5-8) — arquitectura en capas, testing de fallos, Docker y CI/CD.
3. **Automatización empresarial** (semanas 9-12) — despliegue real con HTTPS, corrección de vulnerabilidades, automatización con n8n.
4. **RAG** (semanas 13-15) — recuperación aumentada por generación con citas verificables y control de coste.
5. **Agente** (semanas 16-18) — agente con herramientas, permisos mínimos y observabilidad.
6. **SaaS con IA** (semanas 19-21) — MVP con valor de negocio, resiliencia (circuit breaker) y rendimiento medido.

### Proyecto final: AI Business Operations Platform

Definido en `content/projects/project-final.md` (semanas 22-24). Integra los 6 proyectos anteriores — o una selección consciente de sus componentes — en una sola plataforma operativa de negocio con IA:

- Frontend, Backend, Database
- Authentication, Authorization
- AI, RAG, Agent, Tools
- n8n
- Docker, CI/CD
- Security, Observability, Monitoring

El PDF generado (`npm run pdf`) incluye la sección completa "Proyectos del programa" con los 7 proyectos (6 + final), y el dashboard web los muestra en la sección "Proyectos del programa".

---

## 8. Modo sin IA

El dashboard ofrece un flujo de práctica deliberada para usar con cualquier laboratorio: formular el resultado esperado y una prueba, consultar documentación oficial, trabajar en bloques cortos, registrar hipótesis/errores/evidencia y comparar con ayuda solo al final. El acceso al catálogo no abre pistas automáticamente. La plataforma no puede verificar que el estudiante haya desconectado herramientas externas; es una práctica voluntaria, no una restricción técnica.

---

## 9. Modo AI as Mentor

El dashboard ofrece plantillas de prompts para ocho roles: profesor, reviewer, debugger, arquitecto, pair programmer, entrevistador, desafío defensivo y evaluador. Además, la consola local permite conversar con Ollama (`llama3.2:latest` por defecto) sobre conceptos y errores de los fragmentos de JavaScript, Python, Java y SQL.

La mentoría requiere iniciar Ollama y el servicio local. El código y la salida solo se envían al modelo local cuando el estudiante activa el consentimiento explícito. No hay proveedor externo, clave API ni ejecución de comandos devueltos por la IA. El mentor orienta y el estudiante verifica con pruebas y documentación; siempre existe la posibilidad de aprender sin IA.

---

## 10. Práctica de entrevista y preparación laboral

La sección de entrenamiento ofrece preguntas para explicar problema, arquitectura, trade-offs, fallos, seguridad y métricas. Se recomienda responder con contexto, decisión, evidencia y límites, y luego autoevaluar claridad y profundidad.

El checklist laboral permite marcar preparación de proyectos reproducibles, README, pruebas, seguridad, evidencia, CV/perfil, entrevista y siguiente paso. Su estado persiste localmente, es editable y no otorga XP ni representa una evaluación de empleabilidad.

---

## 11. Reglas pedagógicas clave

- Cada tema debe tener práctica y evidencia.
- Cada laboratoriio debe tener verificación.
- Cada reto debe tener pistas y penalización por ayuda.
- Cada módulo debe incluir una fase de ruptura y recuperación.
- Cada proyecto debe terminar en documentación clara.

---

## 12. Siguiente paso

La siguiente iteración consiste en convertir este programa en un esquema concreto de contenido por semanas, una estructura de carpetas en `content/` y un dashboard funcional con progreso, evaluación y navegación.
