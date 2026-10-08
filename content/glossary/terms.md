# Glosario

## API
Interfaz de programación que permite que dos sistemas se comuniquen entre sí mediante un contrato definido (endpoints, formatos de entrada/salida). Ejemplo: una tienda online expone una API REST para que una app móvil consulte productos sin acceder directamente a la base de datos. Se relaciona con REST, Webhook y Rate Limit.

## REST
Estilo arquitectónico para diseñar APIs basado en recursos (sustantivos, no verbos), métodos HTTP estándar (GET, POST, PUT, DELETE) y respuestas sin estado entre peticiones. Ejemplo: `GET /pedidos/42` obtiene el pedido 42; `DELETE /pedidos/42` lo elimina. Se relaciona con API e Idempotencia (GET y DELETE deberían ser idempotentes).

## JWT
JSON Web Token: un token firmado que transporta información de identidad (claims) entre un servidor y un cliente sin necesidad de consultar una base de datos en cada petición. Ejemplo: tras iniciar sesión, el backend emite un JWT que el frontend envía en cada petición para demostrar quién es sin reenviar la contraseña. Se relaciona con OAuth y autenticación/autorización.

## OAuth
Protocolo de autorización que permite que una aplicación acceda a recursos de un usuario en otro servicio sin conocer su contraseña, mediante tokens de acceso con permisos limitados (scopes). Ejemplo: "Iniciar sesión con Google" usa OAuth para que tu app reciba el email del usuario sin ver su contraseña de Google. Se relaciona con JWT (a menudo el token de acceso es un JWT).

## Docker
Tecnología de contenedores que empaqueta una aplicación junto a sus dependencias exactas para que se ejecute igual en cualquier máquina. Ejemplo: un `Dockerfile` define Node 20 + las dependencias del proyecto, y el mismo contenedor corre igual en tu laptop y en el servidor de producción. Se relaciona con CI/CD (los pipelines suelen construir y desplegar imágenes Docker).

## CI/CD
Integración continua y despliegue continuo: automatizar la validación (tests, build) de cada cambio de código y, opcionalmente, su despliegue automático. Ejemplo: cada `push` a GitHub dispara un pipeline que instala dependencias, corre tests y solo si todo pasa, construye y despliega. Se relaciona con Docker y con el patrón de pipelines definido en GitHub Actions.

## RAG
Retrieval-Augmented Generation (recuperación aumentada por generación): arquitectura donde un LLM responde apoyándose en fragmentos de documentos reales recuperados en el momento de la consulta, en vez de depender solo de lo que "memorizó" en su entrenamiento. Ejemplo: un chatbot de soporte que busca en el manual de la empresa antes de responder, y cita la sección exacta. Se relaciona con Embedding, Vector Database y Grounding.

## Embedding
Representación numérica (vector) de un texto que captura su significado semántico, de forma que textos con significado similar tienen vectores cercanos entre sí. Ejemplo: los embeddings de "coche" y "automóvil" están más cerca entre sí que los de "coche" y "plátano". Se relaciona con Vector Database y RAG.

## LLM
Large Language Model (modelo grande de lenguaje): un modelo de IA entrenado con grandes cantidades de texto, capaz de generar, resumir, clasificar o razonar sobre lenguaje natural. Ejemplo: usar un LLM para extraer el total y la fecha de una factura en texto libre y devolverlos en JSON estructurado. Se relaciona con Prompt, Tool Calling y Alucinación.

## Agente
Sistema que usa un LLM para decidir qué acción tomar (entre un conjunto de herramientas disponibles) en función de un objetivo, en vez de seguir un flujo fijo predefinido. Ejemplo: un agente que, ante "¿tenemos stock del producto X?", decide por sí mismo llamar a la herramienta `consultarInventario` en vez de responder de memoria. Se relaciona con Tool Calling y con la regla de "least privilege" (permisos mínimos).

## Tool Calling
Capacidad de un LLM de solicitar la ejecución de una función específica (con parámetros estructurados) en vez de solo devolver texto libre. Ejemplo: el modelo responde con una llamada a `consultarCliente` con `id: 42` como parámetro, y el código de la aplicación ejecuta esa función real. Se relaciona con Agente y con la necesidad de validar entradas/salidas de cada herramienta.

## Vector Database
Base de datos optimizada para almacenar embeddings y buscar los más similares a una consulta dada (búsqueda por similitud, no por coincidencia exacta). Ejemplo: guardar el embedding de cada párrafo de un manual y, ante una pregunta, recuperar los 3 párrafos más similares semánticamente. Se relaciona con Embedding y RAG.

## Prompt
Instrucción (o conjunto de instrucciones, contexto y ejemplos) que se envía a un LLM para obtener una respuesta determinada. Ejemplo: un prompt con instrucciones claras, un esquema de salida y 2 ejemplos (few-shot) suele ser más consistente que una sola frase vaga. Se relaciona con Alucinación (un prompt ambiguo aumenta el riesgo de respuestas inventadas) y con LLMOps (versionar prompts).

## Grounding
Práctica de anclar las respuestas de un LLM a evidencia verificable (documentos, datos, fuentes citables) en vez de dejar que responda solo de su conocimiento interno. Ejemplo: forzar a un sistema RAG a citar el fragmento exacto del que extrajo cada afirmación. Se relaciona directamente con RAG y es la principal defensa contra la Alucinación.

## Alucinación
Cuando un LLM genera una respuesta que suena coherente y segura pero es objetivamente falsa o no está respaldada por ninguna fuente real. Ejemplo: un modelo que inventa un artículo de ley que no existe porque "suena a lo que debería existir". Se mitiga con Grounding, RAG y evaluación sistemática (ver Evaluación de IA).

## MLOps
Conjunto de prácticas para llevar modelos de machine learning propios (entrenados por el equipo, no solo LLMs de terceros) desde el desarrollo hasta producción de forma reproducible: versionado de datos, versionado de modelos, reentrenamiento, monitoreo de drift. Se relaciona con LLMOps, que es su equivalente específico para sistemas basados en LLMs de terceros.

## LLMOps
Prácticas operativas específicas para sistemas que usan LLMs en producción: versionado de prompts, trazabilidad de llamadas, control de coste y latencia, evaluación continua de calidad. Ejemplo: un dashboard que muestra coste diario, tasa de error y qué versión de prompt está activa. Se relaciona con Observabilidad y con el patrón de circuit breaker ante fallos del proveedor del LLM.

## Observabilidad
Capacidad de entender qué ocurre dentro de un sistema a partir de sus señales externas: métricas, logs y trazas (traces). Ejemplo: poder responder "¿por qué esta petición tardó 4 segundos?" revisando trazas en vez de adivinar. Se relaciona con SLO/SLA y con LLMOps.

## SLO
Service Level Objective (objetivo de nivel de servicio): una meta interna de rendimiento o disponibilidad que el equipo se propone cumplir, usada para tomar decisiones antes de que se convierta en un incumplimiento visible para el cliente. Ejemplo: "el 99% de las peticiones deben responder en menos de 300ms". Se relaciona con SLA (el SLO es la meta interna; el SLA es el compromiso externo, a menudo con penalización).

## SLA
Service Level Agreement (acuerdo de nivel de servicio): compromiso formal, a menudo contractual, sobre disponibilidad o rendimiento de un servicio, con consecuencias si no se cumple. Ejemplo: un proveedor cloud que garantiza 99.9% de disponibilidad mensual o compensa al cliente. Se relaciona con SLO y Observabilidad (sin medir, no puedes saber si cumples tu SLA).

## Rate Limit
Límite impuesto sobre cuántas peticiones puede hacer un cliente a una API en un periodo de tiempo, para proteger el servicio de sobrecarga o abuso. Ejemplo: una API que permite 100 peticiones por minuto y responde con un error "demasiadas peticiones" si se supera. Se relaciona con Idempotencia y con el diseño de reintentos (nunca reintentar inmediatamente ante ese error).

## Idempotencia
Propiedad de una operación que produce el mismo resultado sin importar cuántas veces se ejecute con los mismos parámetros. Ejemplo: eliminar un pedido debería ser idempotente — eliminarlo una vez o diez veces deja el mismo estado final (eliminado). Es clave para poder reintentar operaciones de forma segura ante fallos de red.

## Circuit Breaker
Patrón de diseño que detiene las llamadas a una dependencia que está fallando repetidamente, para evitar saturarla aún más y para que el sistema que la llama falle rápido en vez de quedarse esperando. Ejemplo: tras 3 fallos consecutivos de una API externa, el circuito se "abre" y las siguientes llamadas fallan inmediatamente durante unos segundos antes de volver a intentarlo. Se relaciona con Rate Limit y con sistemas distribuidos resilientes.

## Webhook
Mecanismo mediante el cual un sistema notifica a otro de un evento enviándole una petición HTTP en el momento en que ocurre, en vez de que el segundo sistema tenga que preguntar constantemente ("polling"). Ejemplo: un proveedor de pagos envía un webhook a tu backend cuando un pago se confirma. Se relaciona con API e Idempotencia (un webhook puede llegar duplicado y tu sistema debe manejarlo sin duplicar el efecto).
