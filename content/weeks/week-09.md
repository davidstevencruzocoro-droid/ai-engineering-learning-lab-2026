---
id: 9
level: 3
xp: 25
title: "Semana 9 · Linux + Cloud"
---

# Semana 9: Linux, infraestructura y cloud

## Objetivo
Adquirir la base operativa para desplegar y mantener sistemas en entornos reales.

## Por qué importa
La ingeniería moderna no termina en el código: también requiere operar entornos, servicios y recursos de forma segura.

## Conceptos
- Linux
- shell
- servicios
- cloud
- despliegue
- permisos

## Arquitectura
```text
Aplicación
  ↓
Servidor / VM / contenedor
  ↓
Sistema operativo
  ↓
Red, permisos, logs y observabilidad
```

## Ejemplo
```bash
ls -la
chmod +x script.sh
sudo systemctl status nginx
```

## Laboratorio
Desplegar una aplicación en un entorno basado en Linux o nube y documentar el procedimiento completo.

## Preparación
- entorno Linux o VM
- acceso a un servidor o cloud
- conocimiento básico de permisos y procesos

## Paso 1
Preparar el entorno con dependencias mínimas.

## Paso 2
Configurar la aplicación para ejecutarse de forma estable.

## Paso 3
Verificar accesos, puertos y funcionamiento real desde fuera.

## Verificación
```bash
ps aux
ss -tulpn
curl http://localhost:8080
```

## Errores comunes
- permisos incorrectos,
- puertos no abiertos,
- servicios sin reinicio,
- configuración que funciona solo localmente.

## Debugging
Comprueba proceso, puerto, logs y usuario con permisos correctos antes de cambiar el código.

## Reto
Mover una aplicación local a un entorno remoto y documentar cada paso.

## BREAK THE SYSTEM
Romper una configuración de servicio o permisos y corregirla con evidencia.

## RECOVERY
Revisar la causa raíz, ajustar la configuración y verificar la estabilidad.

## Evaluación
- ¿El sistema funciona fuera del entorno local?
- ¿La infraestructura está documentada?
- ¿Se ha validado el servicio en ejecución real?

## Evidencia
Guardar comandos, configuraciones, acceso y notas de despliegue.

## Criterio de aprobación
El estudiante debe poder explicar qué hace el sistema operativo y cómo se gestiona un servicio real.
