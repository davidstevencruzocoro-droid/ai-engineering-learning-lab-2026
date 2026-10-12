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

## Profundización técnica
`sudo systemctl status nginx` te dice si un servicio está corriendo, pero no es así como se mantiene un servicio propio corriendo de forma confiable en un servidor Linux real. Un *unit file* de systemd define cómo arrancar, reiniciar y limitar un proceso tuyo como si fuera un servicio del sistema operativo:

```ini
# /etc/systemd/system/mi-api.service
[Unit]
Description=Mi API Node.js
After=network.target

[Service]
Type=simple
User=appuser
WorkingDirectory=/opt/mi-api
ExecStart=/usr/bin/node /opt/mi-api/server.js
Restart=on-failure
RestartSec=5
EnvironmentFile=/opt/mi-api/.env
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
```

`User=appuser` evita correr el proceso como root. `Restart=on-failure` + `RestartSec=5` hace que systemd reinicie el proceso solo si murió por un error (no si lo detuviste tú a propósito), esperando 5 segundos — sin esto, un crash a las 3am se queda caído hasta que alguien lo note. `NoNewPrivileges=true` impide que el proceso escale privilegios aunque algo dentro de él lo intente.

Comandos reales para operarlo:
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now mi-api
sudo systemctl status mi-api
journalctl -u mi-api -f --since "10 min ago"
```
`journalctl -u mi-api -f` es el equivalente real a "ver los logs del contenedor" pero para un servicio systemd — sin esto, diagnosticar por qué un servicio se reinició a medianoche es adivinar a ciegas.

Sobre permisos (`chmod +x script.sh` del ejemplo anterior): el error más común en servidores reales no es olvidar el `+x`, es usar `chmod -R 777` para "que funcione de una vez" — eso da permiso de escritura y ejecución a cualquier usuario del sistema sobre esos archivos, incluyendo procesos comprometidos de otras aplicaciones. El principio correcto es el mínimo permiso necesario: `750` o `640` según si el archivo necesita ejecutarse, y nunca escritura para "otros" en archivos de un servicio expuesto a red.

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
