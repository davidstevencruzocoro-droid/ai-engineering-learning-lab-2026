# Evaluación inicial de Ingeniería de Sistemas

## Cómo puntuar
Por cada ejercicio, usa una escala de 0 a 4:
- **0:** no logra comenzar o la respuesta es incorrecta.
- **1:** reconoce términos, pero no explica el mecanismo.
- **2:** resuelve con pistas frecuentes.
- **3:** resuelve y verifica de forma independiente.
- **4:** resuelve, explica límites/riesgos y transfiere el método a otro caso.

No uses la puntuación para etiquetar a la persona. Úsala para elegir el siguiente ejercicio. Si la respuesta parece memorizada, pide que la adapte a un escenario nuevo.

## Retos prácticos

### 1. Terminal y archivos
**Tarea:** explicar cómo comprobar el directorio actual, listar archivos ocultos y buscar un archivo llamado `application.yml` dentro de un proyecto concreto. Debe distinguir PowerShell de Bash y evitar búsquedas innecesarias en todo el disco.
**Evidencia:** comandos correctos, ruta clara y explicación de cada opción.

### 2. Procesos y puertos
**Tarea:** una API debería escuchar en el puerto 8080, pero la conexión falla. Diseña una secuencia de diagnóstico sin matar procesos ni cambiar firewall.
**Evidencia:** comprueba proceso, escucha local, logs y respuesta HTTP; no asume que el puerto es la causa.

### 3. Git
**Tarea:** hay archivos modificados y no confirmados. Explica cómo inspeccionarlos y cómo revisar el diff antes de decidir qué incluir en un commit.
**Evidencia:** usa `git status`, `git diff` y `git diff --staged`; explica por qué no usaría `reset --hard`.

### 4. HTTP y API
**Tarea:** diferencia errores 400, 401, 403, 404, 409 y 500 con un ejemplo de cada uno. Describe cómo probar un endpoint con `curl` sin filtrar tokens ni crear datos involuntariamente.
**Evidencia:** semántica correcta, request mínima y cuidado con efectos secundarios.

### 5. SQL
**Tarea:** diseña tablas `clientes` y `pedidos` con PK/FK; explica cómo encontrar pedidos sin cliente válido y por qué las transacciones importan.
**Evidencia:** integridad referencial, consulta razonada y reconocimiento de diferencias entre motores SQL.

### 6. Programación y pruebas
**Tarea:** escribe pseudocódigo para validar que una lista no tenga IDs duplicados. Propón pruebas para lista vacía, un elemento, duplicados y valores límite.
**Evidencia:** casos normales, extremos y fallos; diferencia test unitario de integración.

### 7. Docker
**Tarea:** explica imagen, contenedor, volumen, red y puerto publicado. Diagnostica un contenedor que se detiene sin borrar nada.
**Evidencia:** inspección de estado/logs/configuración y ninguna limpieza destructiva.

### 8. Seguridad
**Tarea:** se subió accidentalmente un token a un repositorio. Describe la respuesta inmediata y por qué borrar el archivo no basta.
**Evidencia:** revocar/rotar, evaluar exposición, limpiar historial solo con plan coordinado y evitar repetir el secreto.

### 9. Diseño de sistemas
**Tarea:** diseña a alto nivel una API de citas con clientes, profesionales, horarios y reservas. Incluye validación de solapamientos, autorización, errores y pruebas.
**Evidencia:** requisitos, modelo de datos, concurrencia, seguridad y observabilidad.

### 10. IA como herramienta
**Tarea:** la IA genera una función y afirma que es segura. Define cómo verificar comportamiento, seguridad, licencias/dependencias y pruebas antes de aceptarla.
**Evidencia:** revisión independiente, pruebas, análisis de riesgos y rechazo de afirmaciones sin evidencia.

## Umbral para decidir el plan
No sumes las áreas como si todas tuvieran el mismo peso. Marca cada dominio como:
- **Base por reforzar:** 0–1.
- **En desarrollo:** 2.
- **Operativo:** 3.
- **Transferible:** 4.

Las brechas en terminal, Git, redes, SQL, pruebas y seguridad afectan a muchas otras áreas; priorízalas si aparecen. Repite los retos después de cuatro semanas con variantes nuevas.
