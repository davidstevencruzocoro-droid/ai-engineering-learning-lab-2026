import { spawn } from 'node:child_process';
import { access } from 'node:fs/promises';
import path from 'node:path';

const COMMANDS = Object.freeze([
  {
    id: 'docker-ps',
    label: 'Contenedores activos',
    command: 'docker ps',
    executable: 'docker',
    args: ['ps', '--format', '{{.Names}}\t{{.Image}}\t{{.Ports}}'],
    what: 'Muestra los contenedores Docker que están activos ahora.',
    when: 'Úsalo antes de conectar con un servicio local o para comprobar qué levantó Docker Compose.',
    risk: 'Solo consulta el daemon y no inicia, detiene ni modifica contenedores. Los nombres y puertos pueden ser sensibles.',
    example: 'docker ps',
    exercise: 'Identifica en la salida el contenedor PostgreSQL y el puerto que publica en el host.',
    commonErrors: ['Docker Desktop está cerrado o el daemon no responde.', 'El usuario no tiene acceso al daemon Docker.'],
    recovery: 'Abre Docker Desktop y espera a que indique que está listo; vuelve a comprobar servicios. No cambies permisos del daemon sin revisar su impacto.',
    challenge: 'Encuentra qué servicio de base de datos está activo y qué puerto del host utiliza.',
    verification: 'Si terminó con código 0, revisa que cada fila corresponda a un contenedor activo. Compara nombres, imágenes y puertos con tu predicción.'
  },
  {
    id: 'git-version',
    label: 'Versión de Git',
    command: 'git --version',
    executable: 'git',
    args: ['--version'],
    what: 'Muestra la versión del ejecutable Git que resuelve el PATH actual.',
    when: 'Úsalo al preparar un entorno o diagnosticar diferencias entre herramientas.',
    risk: 'Solo consulta la versión; no lee ni cambia repositorios.',
    example: 'git --version',
    exercise: 'Compara la versión que esperas con la salida y localiza qué Git se está ejecutando.',
    commonErrors: ['Git no está instalado.', 'El PATH no contiene el directorio de Git o la terminal conserva un PATH antiguo.'],
    recovery: 'Instala Git desde su fuente oficial si falta, o abre una terminal nueva tras corregir PATH. Repite el diagnóstico antes de usar Git.',
    challenge: 'Confirma la versión de Git disponible sin consultar ni modificar un repositorio.',
    verification: 'La salida debe identificar Git y su versión; no deduzcas que la carpeta actual es un repositorio.'
  },
  {
    id: 'node-version',
    label: 'Versión de Node.js',
    command: 'node --version',
    executable: 'node',
    args: ['--version'],
    what: 'Muestra la versión de Node.js que encuentra esta API local.',
    when: 'Úsalo antes de instalar dependencias o comparar un error de runtime.',
    risk: 'Solo consulta la versión instalada.',
    example: 'node --version',
    exercise: 'Predice si la versión detectada satisface la versión requerida por el proyecto.',
    commonErrors: ['Node.js no está instalado.', 'Hay varias instalaciones y el PATH resuelve una versión distinta a la esperada.'],
    recovery: 'Instala la versión requerida por el proyecto o corrige el PATH; abre una terminal nueva y vuelve a comprobar.',
    challenge: 'Compara esta versión con el campo engines del package.json cuando exista.',
    verification: 'La salida debe ser un número de versión con prefijo v; compárala con la versión documentada por el proyecto.'
  },
  {
    id: 'java-version',
    label: 'Versión de Java',
    command: 'java --version',
    executable: 'java',
    args: ['--version'],
    what: 'Muestra la versión del runtime Java resuelto por el PATH.',
    when: 'Úsalo antes de compilar o ejecutar un proyecto Java.',
    risk: 'Solo consulta la versión del runtime.',
    example: 'java --version',
    exercise: 'Compara la versión mayor detectada con la requerida por tu proyecto.',
    commonErrors: ['Java no está instalado.', 'JAVA_HOME o PATH apunta a otra instalación.'],
    recovery: 'Instala un JDK compatible y configura JAVA_HOME/PATH en la terminal; vuelve a ejecutar el diagnóstico.',
    challenge: 'Verifica si la versión instalada cumple el nivel mínimo que pide el proyecto.',
    verification: 'Busca el número de versión mayor en la salida y compáralo con la configuración del proyecto.'
  },
  {
    id: 'wsl-list',
    label: 'Distribuciones WSL',
    command: 'wsl --list --quiet',
    executable: 'wsl.exe',
    args: ['--list', '--quiet'],
    what: 'Enumera las distribuciones WSL registradas en Windows.',
    when: 'Úsalo para confirmar el nombre de una distribución antes de abrirla.',
    risk: 'Solo enumera distribuciones; no las inicia ni cambia su configuración.',
    example: 'wsl --list --quiet',
    exercise: 'Comprueba si está registrada la distribución Linux que esperabas.',
    commonErrors: ['WSL no está instalado o no está habilitado.', 'La lista puede incluir distribuciones administradas por Docker Desktop.'],
    recovery: 'Comprueba la característica WSL y usa una distribución instalada; no elimines distribuciones para resolver un error de inicio.',
    challenge: 'Distingue tu distribución de trabajo de las distribuciones de infraestructura.',
    verification: 'La salida contiene únicamente nombres registrados; no confirma por sí sola que una distribución esté iniciada.'
  },
  {
    id: 'ollama-models',
    label: 'Modelos de Ollama',
    command: 'ollama list',
    executable: 'ollama',
    args: ['list'],
    what: 'Lista los modelos que Ollama tiene disponibles localmente.',
    when: 'Úsalo antes de iniciar una conversación con un modelo local.',
    risk: 'Solo enumera modelos locales; no envía una petición de inferencia.',
    example: 'ollama list',
    exercise: 'Comprueba si el modelo configurado para el mentor aparece en la lista.',
    commonErrors: ['El CLI no está en PATH.', 'El servicio de Ollama no está disponible.'],
    recovery: 'Inicia Ollama, confirma el estado de su servicio y repite el comando; no descargues modelos sin revisar espacio disponible.',
    challenge: 'Encuentra el modelo local que puede usar el mentor.',
    verification: 'La lista muestra los nombres de los modelos detectados; compáralos con la configuración del mentor.'
  }
]);

const MAX_PREDICTION_LENGTH = 500;
const MAX_OUTPUT_LENGTH = 8_000;
const COMMAND_TIMEOUT_MS = 8_000;
const WINDOWS_EXTENSIONS = (process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM')
  .split(';')
  .filter(Boolean);

async function resolveExecutable(command) {
  const pathValue = process.env.PATH || process.env.Path || '';
  const candidates = pathValue.split(path.delimiter).filter(Boolean);
  const executableNames = process.platform === 'win32'
    ? WINDOWS_EXTENSIONS.map((extension) => `${command}${extension.toLowerCase()}`)
    : [command];

  for (const directory of candidates) {
    for (const executableName of executableNames) {
      const executablePath = path.join(directory, executableName);
      try {
        await access(executablePath);
        return executablePath;
      } catch {
        continue;
      }
    }
  }
  return null;
}

export function validateCoachPayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new TypeError('El cuerpo debe ser un objeto JSON.');
  }
  if (typeof payload.commandId !== 'string' || !COMMANDS.some((command) => command.id === payload.commandId)) {
    throw new RangeError('Selecciona un comando del catálogo del Terminal Coach.');
  }
  if (typeof payload.prediction !== 'string' || payload.prediction.trim().length === 0) {
    throw new TypeError('Escribe primero qué esperas encontrar.');
  }
  if (payload.prediction.length > MAX_PREDICTION_LENGTH) {
    throw new RangeError(`La predicción supera el límite de ${MAX_PREDICTION_LENGTH} caracteres.`);
  }
  return {
    commandId: payload.commandId,
    prediction: payload.prediction.trim()
  };
}

export function getCoachCommandCatalog() {
  return COMMANDS.map(({
    id,
    label,
    command,
    what,
    when,
    risk,
    example,
    exercise,
    commonErrors,
    recovery,
    challenge,
    verification
  }) => ({
    id,
    label,
    command,
    what,
    when,
    risk,
    example,
    exercise,
    commonErrors,
    recovery,
    challenge,
    verification
  }));
}

function runReadOnlyCommand(command, executablePath) {
  return new Promise((resolve) => {
    const launchCommand = process.platform === 'win32' && /\.(cmd|bat)$/i.test(executablePath)
      ? 'cmd.exe'
      : executablePath;
    const args = launchCommand === 'cmd.exe'
      ? ['/d', '/s', '/c', `${command.executable} ${command.args.join(' ')}`]
      : command.args;
    let child;
    try {
      child = spawn(launchCommand, args, {
        cwd: process.cwd(),
        shell: false,
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'pipe']
      });
    } catch (error) {
      resolve({ exitCode: null, stdout: '', stderr: error.message, timedOut: false });
      return;
    }

    const stdout = [];
    const stderr = [];
    let stdoutLength = 0;
    let stderrLength = 0;
    let settled = false;
    const capture = (chunks, chunk, length) => {
      const remaining = MAX_OUTPUT_LENGTH - length;
      if (remaining <= 0) return length;
      const data = chunk.subarray(0, remaining);
      chunks.push(data);
      return length + data.length;
    };
    child.stdout.on('data', (chunk) => { stdoutLength = capture(stdout, chunk, stdoutLength); });
    child.stderr.on('data', (chunk) => { stderrLength = capture(stderr, chunk, stderrLength); });

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill();
      resolve({
        exitCode: null,
        stdout: Buffer.concat(stdout).toString('utf8'),
        stderr: 'El comando superó el límite de tiempo de 8 segundos.',
        timedOut: true
      });
    }, COMMAND_TIMEOUT_MS);

    child.once('error', (error) => {
      clearTimeout(timer);
      if (settled) return;
      settled = true;
      resolve({
        exitCode: null,
        stdout: Buffer.concat(stdout).toString('utf8'),
        stderr: error.message,
        timedOut: false
      });
    });
    child.once('close', (exitCode) => {
      clearTimeout(timer);
      if (settled) return;
      settled = true;
      resolve({
        exitCode,
        stdout: Buffer.concat(stdout).toString('utf8'),
        stderr: Buffer.concat(stderr).toString('utf8'),
        timedOut: false
      });
    });
  });
}

export async function executeCoachCommand(payload) {
  const { commandId, prediction } = validateCoachPayload(payload);
  const command = COMMANDS.find((item) => item.id === commandId);
  const executablePath = await resolveExecutable(command.executable);
  if (!executablePath) {
    return {
      commandId,
      command: command.command,
      prediction,
      available: false,
      exitCode: null,
      stdout: '',
      stderr: `No se encontró ${command.executable} en PATH. Este comando no se ejecutó.`,
      timedOut: false,
      verification: 'La herramienta no está disponible; no hay resultado que verificar.',
      teaching: command
    };
  }

  const result = await runReadOnlyCommand(command, executablePath);
  const success = result.exitCode === 0;
  return {
    commandId,
    command: command.command,
    prediction,
    available: true,
    exitCode: result.exitCode,
    stdout: result.stdout,
    stderr: result.stderr,
    timedOut: result.timedOut,
    verification: success
      ? command.verification
      : result.timedOut
        ? 'El proceso excedió el tiempo límite. Usa el diagnóstico y la recuperación de abajo; no se afirma que el comando haya funcionado.'
        : `El proceso terminó con código ${result.exitCode}. El comando no se confirmó como exitoso; compara el error real con las causas comunes.`,
    teaching: command
  };
}
