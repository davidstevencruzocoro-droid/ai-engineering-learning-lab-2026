---
id: lab-09
week: 9
xp: 35
title: "Despliegue Linux y cloud"
---

# Lab 09: Desplegar en un servidor real

## Objetivo
Llevar una aplicación que solo corría en local a un servidor Linux real, accesible por dominio y con HTTPS.

## Duración
2 sesiones

## Requisitos
- una VPS o máquina Linux (puede ser una instancia gratuita/de bajo coste de cualquier proveedor, o una VM local con Vagrant/VirtualBox)
- acceso SSH
- un dominio o subdominio propio (puede ser gratuito)

## Tareas
1. Conectarte por SSH y crear un usuario sin privilegios de root para operar la aplicación.
2. Instalar el runtime necesario (Node, Java, lo que use tu app) y copiar el proyecto al servidor.
3. Crear un servicio `systemd` para que la aplicación se mantenga viva y arranque sola tras un reinicio.
4. Configurar Nginx como proxy inverso hacia el puerto de la aplicación y emitir un certificado HTTPS.

## Pista
Un servicio que "funciona porque lo dejé corriendo en una terminal con `nohup`" no es un despliegue real: si el servidor se reinicia, se cae y nadie se entera.

## Pista 2
Ejecuta la aplicación como usuario dedicado sin privilegios, define el directorio de trabajo y guarda secretos/configuración fuera del repositorio y de la unidad de servicio.

## Pista 3
Verifica por separado `systemctl status`, los logs, el proxy Nginx y HTTPS. Reinicia el servicio y el servidor de prueba para demostrar que el arranque no depende de una sesión SSH abierta.

## Solución
```ini
# /etc/systemd/system/mi-app.service
[Unit]
Description=Mi aplicación
After=network.target

[Service]
User=deploy
WorkingDirectory=/opt/mi-app
ExecStart=/usr/bin/node server.js
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```
```nginx
server {
    listen 80;
    server_name mi-dominio.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
Después: `sudo systemctl enable --now mi-app` y `certbot --nginx -d mi-dominio.com` (Certbot/Let's Encrypt; verifica el comando exacto en la documentación oficial de Certbot para tu distribución).

## Penalización XP
-9 XP si la app no funciona fuera del entorno local o depende de que dejes una terminal abierta.

## Evidencia
Captura del servicio activo (`systemctl status mi-app`), de la respuesta HTTPS del dominio, y notas de qué puertos/firewall tuviste que abrir.

## Criterio de aprobación
La aplicación responde por HTTPS en un dominio real, sobrevive a un `reboot` del servidor y los logs son consultables con `journalctl`.
