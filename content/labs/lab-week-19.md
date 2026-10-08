---
id: lab-19
week: 19
xp: 55
title: "Sistemas distribuidos resilientes"
---

# Lab 19: Circuit breaker ante una dependencia que falla

## Objetivo
Evitar que el fallo de un componente (una API externa, una base de datos) tumbe todo tu sistema, implementando un patrón de circuit breaker simple.

## Duración
2 sesiones

## Requisitos
- un sistema propio con al menos una dependencia externa (reutiliza el del lab 11)
- forma de simular que esa dependencia falla (apagarla, bloquear el puerto, forzar error)

## Tareas
1. Implementa un circuit breaker simple con 3 estados: cerrado (normal), abierto (deja de intentar, falla rápido) y semi-abierto (prueba de nuevo tras un tiempo).
2. Define el umbral: después de N fallos consecutivos, el circuito se abre.
3. Mientras el circuito está abierto, las llamadas deben fallar inmediatamente con un mensaje claro, sin ni siquiera intentar la llamada real (esto protege al sistema que falla de recibir más carga).
4. Verifica que, tras el tiempo de espera, el circuito pasa a semi-abierto, prueba una llamada, y se cierra de nuevo si tiene éxito.

## Pista
El punto del circuit breaker no es evitar el error — es evitar que miles de reintentos simultáneos saturen aún más a un servicio que ya está caído.

## Pista 2
Modela el breaker como una máquina de estados explícita. Cuenta fallos consecutivos, abre al alcanzar el umbral y rechaza llamadas sin invocar el servicio mientras siga abierto.

## Pista 3
Inyecta un reloj o controla el tiempo en las pruebas: valida fallo rápido, transición a semi-abierto tras la espera, cierre tras éxito y reapertura tras fallo.

## Solución
```javascript
class CircuitBreaker {
  constructor(umbralFallos = 3, tiempoEsperaMs = 10000) {
    this.estado = 'cerrado';
    this.fallosConsecutivos = 0;
    this.umbralFallos = umbralFallos;
    this.tiempoEsperaMs = tiempoEsperaMs;
  }

  async ejecutar(funcion) {
    if (this.estado === 'abierto') {
      if (Date.now() - this.ultimoFallo < this.tiempoEsperaMs) {
        throw new Error('Circuito abierto: servicio marcado como no disponible');
      }
      this.estado = 'semi-abierto';
    }

    try {
      const resultado = await funcion();
      this.fallosConsecutivos = 0;
      this.estado = 'cerrado';
      return resultado;
    } catch (err) {
      this.fallosConsecutivos++;
      this.ultimoFallo = Date.now();
      if (this.fallosConsecutivos >= this.umbralFallos) {
        this.estado = 'abierto';
      }
      throw err;
    }
  }
}
```

## Penalización XP
-10 XP por ignorar fallos del sistema y dependencias críticas (reintentar indefinidamente sin circuit breaker ni límite).

## Evidencia
Logs mostrando la transición cerrado → abierto tras los fallos consecutivos, el rechazo rápido mientras está abierto, y la recuperación a cerrado cuando la dependencia vuelve.

## Criterio de aprobación
El sistema deja de llamar a una dependencia caída después de N fallos, responde rápido mientras está caída, y se recupera sola cuando la dependencia vuelve a estar disponible.
