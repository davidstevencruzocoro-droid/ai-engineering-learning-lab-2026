---
id: lab-24
week: 24
xp: 65
title: "Proyecto final: demo y cierre"
---

# Lab 24: Poner el proyecto en producción y presentarlo

## Objetivo
Desplegar el proyecto final a un entorno real, y presentarlo con una narrativa clara de problema, solución y evidencia — el cierre que vas a poder enseñar en una entrevista o portfolio.

## Duración
2-3 sesiones

## Requisitos
- el proyecto construido en el lab 23
- un servidor/entorno de despliegue (reutiliza lo aprendido en la semana 9)

## Tareas
1. Despliega el proyecto a un entorno accesible por URL, con HTTPS, usando lo aprendido en Docker/CI/CD/Linux de semanas anteriores.
2. Verifica un checklist mínimo de producción: variables de entorno fuera del código, logs accesibles, el servicio se recupera solo tras un reinicio.
3. Escribe el README final del proyecto: qué problema resuelve, cómo se ejecuta, arquitectura, y cómo probarlo en 5 minutos.
4. Prepara una demo de 5 minutos: problema (1 min), solución en vivo (3 min), cierre con próximos pasos y aprendizajes (1 min).

## Pista
Una demo que empieza explicando la arquitectura antes que el problema pierde a la audiencia en los primeros 30 segundos — empieza siempre por el dolor que resuelves, no por la tecnología.

## Pista 2
Ensaya el recorrido de cinco minutos con una cuenta y datos preparados. Sigue el checklist de despliegue y comprueba HTTPS, configuración, logs y reinicio antes de grabar o presentar.

## Pista 3
Cronometra el relato de problema, flujo en vivo y cierre. Prepara un plan alternativo para una falla de red y termina mostrando evidencia verificable, aprendizajes y próximos pasos.

## Solución
Checklist mínimo de producción antes de la demo:
```markdown
- [ ] La app responde por HTTPS en una URL pública
- [ ] No hay secretos ni claves de API hardcodeadas en el repositorio
- [ ] El servicio se reinicia solo si el servidor se reinicia (systemd/Docker restart policy)
- [ ] Hay logs que puedes consultar si algo falla durante la demo
- [ ] El README permite a otra persona clonar, instalar y ejecutar en <10 minutos
```
Guion de demo de 5 minutos:
```text
1. Problema (60s): a quién le pasa, por qué importa, qué hacían antes.
2. Solución en vivo (180s): flujo principal completo, sin saltos de pantalla a pantalla sin explicar qué pasó.
3. Cierre (60s): qué aprendiste, qué romperías/mejorarías con más tiempo, próximos pasos reales.
```

## Penalización XP
-10 XP por presentar sin claridad ni pruebas (una demo que no muestra el flujo funcionando en vivo, solo capturas o promesas).

## Evidencia
URL pública funcionando, README final, checklist de producción completado, y grabación o guion de la demo de 5 minutos.

## Criterio de aprobación
El proyecto es accesible públicamente, el README permite a un tercero ejecutarlo sin tu ayuda, y la demo comunica problema → solución → evidencia en menos de 5 minutos.
