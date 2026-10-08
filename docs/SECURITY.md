# Security — Política de seguridad del laboratorio

## 1. Alcance de las prácticas ofensivas

Este laboratorio enseña ciberseguridad defensiva, lo que requiere en algunos ejercicios ejecutar ataques reales para poder defenderse de ellos (semana 10, lab 10). Esas prácticas están limitadas estrictamente a:

- aplicaciones propias, creadas por ti para el ejercicio,
- contenedores o máquinas virtuales locales,
- entornos explícitamente autorizados (CTFs, laboratorios de práctica diseñados para ello).

**Nunca** se debe usar lo aprendido aquí contra un sistema, dominio o red que no sea tuyo ni tengas autorización explícita y por escrito para probar. Escanear, explotar o intentar acceder a sistemas de terceros sin autorización es ilegal en la gran mayoría de jurisdicciones, independientemente de la intención.

## 2. Qué hacer si encuentras una vulnerabilidad real por accidente

Si mientras practicas descubres una vulnerabilidad en un sistema de un tercero (por ejemplo, un servicio que usas y notas que expone datos de forma insegura):

1. No la explotes más allá de lo mínimo para confirmar que es real.
2. No la publiques ni la compartas públicamente.
3. Repórtala de forma responsable al propietario del sistema (muchas empresas tienen una política de "responsible disclosure" o un programa de bug bounty).

## 3. Gestión de secretos en este repositorio y en tus proyectos de laboratorio

- Ninguna clave de API, contraseña o token debe quedar hardcodeada en el código ni comiteada al repositorio.
- Usa variables de entorno (`.env`, excluido vía `.gitignore`) para cualquier credencial.
- Antes de hacer `git push`, revisa el diff: un secreto comiteado por error sigue existiendo en el historial de git incluso si lo borras después en un commit posterior — hay que invalidarlo (rotar la clave), no solo borrar la línea.
- GitHub Secret Scanning (ver `content/resources/essential-resources.md`) puede detectar automáticamente muchos tipos de credenciales filtradas en un repositorio público.

## 4. Modelo de permisos para agentes de IA (aplica a las semanas 16 y 31 del currículum)

Todo agente construido en este laboratorio debe respetar:

- **Least privilege:** el agente solo tiene acceso a las herramientas estrictamente necesarias para su tarea, nunca "por si acaso".
- **Validación de entrada y salida:** nunca ejecutes directamente lo que un LLM devuelve (código, comandos, SQL) sin validar su forma y contenido.
- **Aprobación humana en acciones irreversibles:** borrar, enviar dinero, enviar comunicaciones externas, modificar permisos — todo eso requiere confirmación humana explícita antes de ejecutarse, sin importar cuán "seguro" parezca el agente.
- **Audit logs:** cada acción que un agente ejecuta debe quedar registrada con cuándo, con qué parámetros y con qué resultado.
- **Timeouts y límites de presupuesto:** un agente nunca debe poder ejecutar indefinidamente ni gastar sin límite (ver `docs/COSTS.md`).

## 5. Checklist de seguridad mínima antes de desplegar cualquier proyecto de este laboratorio

- [ ] No hay secretos en el código ni en el historial de git
- [ ] Las entradas de usuario se validan server-side, no solo en el frontend
- [ ] Las consultas a base de datos usan parámetros, nunca concatenación de strings
- [ ] El output que se muestra en HTML está correctamente escapado
- [ ] Hay HTTPS en producción, no solo HTTP
- [ ] Las dependencias del proyecto no tienen vulnerabilidades conocidas sin revisar (`npm audit` o equivalente)
- [ ] Si hay autenticación, las contraseñas se almacenan con hash (nunca en texto plano)
- [ ] Si hay un agente de IA, respeta el modelo de permisos de la sección 4

## 6. Referencia

OWASP Top 10 (`content/resources/essential-resources.md`) es la referencia base para entender las categorías de vulnerabilidad más comunes y debe consultarse en su versión vigente, no memorizarse de este documento.

## 7. Consola local y mentor Ollama

La app publicada en GitHub Pages es estática: no puede ejecutar procesos locales ni conectarse al Ollama del estudiante. Las funciones de consola/mentor requieren iniciar manualmente `npm run lab:server` en este equipo y usar el sitio servido localmente con Vite.

### Ejecución de código

- El servidor Node solo escucha en `127.0.0.1`; rechaza solicitudes de red remotas y orígenes de navegador que no sean localhost en puertos de desarrollo explícitos.
- Solo permite los perfiles JavaScript, Python, Java y SQL/SQLite. No acepta un comando ejecutable enviado por el cliente y nunca usa `shell: true`.
- Cada petición inicia un contenedor efímero, sin red, sin volúmenes del host, como usuario no privilegiado, con sistema de archivos de solo lectura, memoria/CPU/PID limitados y un límite temporal. Los archivos se descartan al terminar.
- La entrada está limitada a 16 000 caracteres, las salidas se truncan y hay límites de ejecuciones simultáneas y frecuencia.
- No se debe considerar un contenedor como una frontera infalible. Mantén Docker actualizado, no expongas el daemon/API y no añadas montajes, red o privilegios al sandbox sin una revisión de seguridad.
- Este runner es para fragmentos educativos, no para ejecutar proyectos completos, instalar paquetes, construir imágenes Docker ni usar shell. No guardes ahí secretos ni código sensible.

### Mentor local

- El servidor solo envía mensajes a Ollama en `127.0.0.1:11434`; el modelo predeterminado es `llama3.2:latest`.
- La conversación es temporal en la pestaña. Código y última salida no se envían salvo que el estudiante active el consentimiento explícito en la interfaz.
- La salida del modelo se representa como texto; no se interpreta como HTML ni se pasa al runner. El mentor no tiene herramientas ni puede ejecutar código.
- Ollama procesa los datos localmente en la instalación del estudiante; consulta y configura la retención de logs/modelos en ese equipo según tus necesidades.

### Inventario local

- `GET /api/environment` está sujeto a la misma restricción loopback/origen y a un límite de frecuencia; su resultado se almacena en memoria por 30 segundos.
- El proceso solo consulta una lista fija de comandos de diagnóstico conocidos. Los argumentos no proceden del navegador; no hay endpoint de shell ni ejecución arbitraria.
- Se enumeran versiones, estado de servicios, contenedores activos, sockets en escucha, extensiones de VS Code y marcadores de proyecto del workspace actual con profundidad máxima de una carpeta. No se leen archivos fuente ni se recorre el perfil del usuario.
- Los nombres de proyectos, procesos, contenedores, extensiones y puertos pueden ser sensibles. Permanecen en la respuesta local y la UI no los comparte con Ollama. Revisa y redacta [ENVIRONMENT.md](ENVIRONMENT.md) antes de publicar un snapshot.
- La detección es orientativa: un ejecutable en `PATH` no prueba que una base de datos esté accesible; una extensión de IDE no instala su CLI, y un alias de Microsoft Store no cuenta como runtime de Python.
