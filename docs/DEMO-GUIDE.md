# Guía de demo — AI Engineering Learning Lab 2026

## Propósito

Presentar el Lab como una experiencia para aprender construyendo y demostrar resultados con evidencia, no como un catálogo de temas. El recorrido recomendado conecta una semana de aprendizaje con un laboratorio y después con los proyectos acumulativos y el cierre final.

## Preparación

Desde la raíz del proyecto:

```bash
npm install
npm run validate
npm test
npm run build
npm run dev
```

Abre la URL local que muestre Vite. Los comandos `dev`, `test` y `build` regeneran primero `generated/content.json` desde Markdown. Usa un perfil o navegador limpio si quieres mostrar el estado inicial.

## Recorrido recomendado

1. **Enmarcar el producto.** Presenta el objetivo: aprender ingeniería de IA con práctica, iteración y evidencia. Usa los accesos del encabezado para mostrar cómo se recorre el programa.
2. **Orientarse.** En “Tu ruta de aprendizaje”, enseña avance, nivel y siguiente paso. Aclara que el progreso se guarda en el navegador actual.
3. **Abrir una semana.** En el roadmap, usa “Ver detalle de semana” para mostrar objetivo, conceptos, reto y evidencia. Completa un objetivo solo si quieres demostrar la persistencia.
4. **Pasar a la práctica.** En laboratorios, abre “Ver guía del laboratorio” para mostrar pasos y criterios. Revela una pista a la vez: pista 1 conserva 90% del XP, pista 2 conserva 75%, pista 3 conserva 60% y la solución conserva 40%. El botón de completar es independiente del botón de detalle.
5. **Revisar el entorno real.** En la consola local, expande “Ver inventario detectado en este equipo”. Compara versiones y servicios disponibles; el inventario solo inspecciona el workspace actual y no se comparte con Ollama. Sus límites y el snapshot están en `docs/ENVIRONMENT.md`.
6. **Ejecutar código y pedir mentoría (modo local).** Inicia el runner en Docker y Ollama según `README.md`; ejecuta un fragmento y consulta el error al mentor. El código y la salida se comparten con Ollama solo al activar el consentimiento explícito. GitHub Pages no ofrece esta capacidad local.
7. **Entrenar el siguiente paso.** Muestra el flujo de práctica sin IA, las guías de mentoría, preguntas de entrevista y el checklist laboral.
8. **Conectar con entregables.** Presenta los seis proyectos acumulativos y el proyecto final; el selector de seguimiento personal registra su estado de forma independiente a las semanas y no concede XP adicional.
9. **Cerrar con la demo.** Explica el indicador de preparación, el sprint sugerido y la narrativa de cierre. Muestra la búsqueda, recursos o notas como apoyo para continuar el trabajo.

## Criterios para una presentación sólida

- La navegación lleva a la sección anunciada y funciona con teclado.
- Una semana y un laboratorio pueden abrirse con sus botones de detalle.
- Las casillas y notas conservan sus cambios al recargar el mismo navegador.
- El progreso de ayuda se conserva por laboratorio; volver a abrir una etapa no aplica otra reducción de XP.
- El estado de hitos/evidencia se entiende como una representación del progreso, no como aprobación automática del entregable.
- El seguimiento personal de proyecto y el checklist laboral se guardan localmente y no modifican XP ni avance de semanas.
- La demo explica el problema, la solución, el trabajo realizado y la evidencia disponible.

## Límites conocidos

- El progreso vive en `localStorage`: no hay cuenta, sincronización entre dispositivos ni respaldo remoto.
- El botón “Reiniciar progreso” borra notas, objetivos, pistas vistas, seguimiento de proyectos y checklist laboral guardados en este navegador para el Lab.
- El porcentaje de preparación es heurístico y no inspecciona código, calidad de entregables ni resultados externos.
- La etapa máxima de ayuda se guarda junto al progreso local. Una guía de evaluación en texto es informativa; no se calcula un descuento automático por falta de evidencia.
- El estado de seguimiento de proyectos es una autoevaluación independiente; cada tarjeta distingue explícitamente ese estado del avance de sus semanas.
- El checklist laboral es una ayuda personal, no una evaluación ni una garantía de empleabilidad.
- La mentoría Ollama es local y opcional; el modelo puede equivocarse, el contenido compartido depende del consentimiento explícito y no hay evaluación automática.
- La ejecución de código requiere Docker y solo admite perfiles limitados; no es una terminal general y los archivos de cada ejecución se descartan.
- La validación, las pruebas unitarias y los tests E2E cubren contenido, lógica local y los flujos principales de navegador; la lista exacta está en [TESTING.md](TESTING.md).

## Cambios de experiencia registrados

- Orden narrativo desde la orientación y práctica hasta proyectos y demo final.
- Accesos de encabezado a la ruta, roadmap, laboratorios, proyectos, demo y notas.
- Acciones explícitas de detalle en tarjetas para no depender del clic en una superficie completa.
- Enlace para saltar al contenido, contorno de foco visible, adaptación a pantallas pequeñas y preferencia de movimiento reducido.
- Ayuda escalonada de tres pistas más solución, con XP proporcional al nivel de asistencia y persistencia compatible con el progreso anterior.

La arquitectura y las decisiones de implementación están en [ARCHITECTURE.md](ARCHITECTURE.md); la ejecución detallada de validadores y pruebas está en [TESTING.md](TESTING.md).
