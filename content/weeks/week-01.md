---
id: 1
level: 1
xp: 20
title: "Semana 1 · Entorno profesional"
---

# Semana 1: Entorno profesional

## Objetivo

Preparar el entorno de trabajo profesional para desarrollar software, colaborar online y operar el proyecto con disciplina.

## Por qué importa

Antes de construir software de calidad, el estudiante necesita herramientas sólidas: terminal, control de versiones, documentación, entorno reproducible y disciplina de trabajo.

## Conceptos

- terminal y shell
- Linux / WSL
- Git y GitHub
- variables de entorno
- estructura de proyectos
- control de cambios

## Arquitectura

```text
Desarrollador
  ↓
Terminal + editor
  ↓
Git + GitHub
  ↓
Proyecto versionado
  ↓
Documentación + ejecución reproducible
```

## Ejemplo

```bash
git init
mkdir proyecto
cd proyecto
code .
```

## Laboratorio

Crear un proyecto desde cero con:

- README claro,
- estructura base,
- commits con sentido,
- documentación de ejecución,
- script inicial de arranque.

## Preparación

- VS Code
- Git instalado
- acceso a GitHub
- terminal funcional

## Paso 1

Crear la estructura del proyecto y un README con objetivo, requisitos y pasos.

## Paso 2

Inicializar Git y realizar el primer commit.

## Paso 3

Evidenciar la ejecución del proyecto con una comprobación final.

## Verificación

```bash
git status
ls -la
cat README.md
```

## Errores comunes

- no documentar cómo ejecutar,
- no separar carpetas,
- no hacer commits con mensajes útiles,
- ignorar el entorno del proyecto.

## Debugging

Revisar la estructura del repositorio y asegurar que cada archivo tenga un propósito claro.

## Reto

Recrear el proyecto desde una máquina limpia siguiendo únicamente la documentación.

## Reto avanzado

Asegurar que un compañero pueda clonar, instalar y ejecutar el proyecto sin ayuda adicional.

## BREAK THE SYSTEM

Romper la configuración del entorno por error y diagnosticar la causa: variable de entorno incorrecta, ruta rota o dependencia faltante.

## RECOVERY

Corregir la configuración, documentar la causa y volver a compilar o ejecutar el proyecto.

## Evaluación

- ¿El proyecto se ejecuta sin instrucciones ocultas?
- ¿La documentación describe el flujo de instalación?
- ¿Existe evidencia de control de versiones?

## Evidencia

Guardar README, historial de commits y notas de diagnóstico.

## Criterio de aprobación

El estudiante debe poder clonar, entender y ejecutar el proyecto desde cero sin ayuda de terceros.
