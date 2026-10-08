export const SANDBOX_IMAGE = 'ai-lab-sandbox:local';
export const MAX_SOURCE_LENGTH = 16_000;
export const MAX_MENTOR_TEXT_LENGTH = 1_800;
export const MAX_MENTOR_HISTORY = 8;

export const LANGUAGE_PROFILES = Object.freeze({
  javascript: 'JavaScript (Node.js)',
  python: 'Python',
  java: 'Java',
  sql: 'SQL (SQLite en memoria)'
});

export function validateRunPayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new TypeError('El cuerpo debe ser un objeto JSON.');
  }
  if (!Object.hasOwn(LANGUAGE_PROFILES, payload.language)) {
    throw new RangeError('Lenguaje no permitido. Usa JavaScript, Python, Java o SQL.');
  }
  if (typeof payload.source !== 'string' || payload.source.trim().length === 0) {
    throw new TypeError('Escribe código antes de ejecutarlo.');
  }
  if (payload.source.length > MAX_SOURCE_LENGTH) {
    throw new RangeError(`El código supera el límite de ${MAX_SOURCE_LENGTH} caracteres.`);
  }
  if (payload.source.includes('\0')) {
    throw new TypeError('El código contiene caracteres no permitidos.');
  }

  return { language: payload.language, source: payload.source };
}

export function validateMentorPayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new TypeError('El cuerpo debe ser un objeto JSON.');
  }
  if (typeof payload.question !== 'string' || payload.question.trim().length === 0) {
    throw new TypeError('Escribe una pregunta para el mentor.');
  }
  if (payload.question.length > MAX_MENTOR_TEXT_LENGTH) {
    throw new RangeError(`La pregunta supera el límite de ${MAX_MENTOR_TEXT_LENGTH} caracteres.`);
  }
  if (!Object.hasOwn(LANGUAGE_PROFILES, payload.language)) {
    throw new RangeError('Selecciona un lenguaje permitido.');
  }

  const history = payload.history ?? [];
  if (!Array.isArray(history) || history.length > MAX_MENTOR_HISTORY) {
    throw new RangeError(`El historial puede contener como máximo ${MAX_MENTOR_HISTORY} mensajes.`);
  }
  const messages = history.map((message) => {
    if (
      !message ||
      !['user', 'assistant'].includes(message.role) ||
      typeof message.content !== 'string' ||
      message.content.length > MAX_MENTOR_TEXT_LENGTH
    ) {
      throw new TypeError('El historial del mentor no tiene un formato válido.');
    }
    return { role: message.role, content: message.content };
  });

  const code = typeof payload.source === 'string' ? payload.source.slice(0, 6_000) : '';
  const output = typeof payload.output === 'string' ? payload.output.slice(0, 4_000) : '';
  messages.push({
    role: 'user',
    content: [
      `Lenguaje: ${LANGUAGE_PROFILES[payload.language]}`,
      code ? `Código compartido por el estudiante:\n${code}` : '',
      output ? `Salida compartida por el estudiante:\n${output}` : '',
      `Pregunta del estudiante:\n${payload.question.trim()}`
    ].filter(Boolean).join('\n\n')
  });
  return messages;
}

export function buildDockerArgs(language, containerName) {
  if (!Object.hasOwn(LANGUAGE_PROFILES, language)) {
    throw new RangeError('Lenguaje no permitido.');
  }

  return [
    'run', '--rm', '--init', '-i',
    '--name', containerName,
    '--pull=never',
    '--network=none',
    '--memory=512m',
    '--memory-swap=512m',
    '--cpus=1',
    '--pids-limit=64',
    '--read-only',
    '--tmpfs=/tmp:rw,noexec,nosuid,size=32m',
    '--user=65532:65532',
    '--cap-drop=ALL',
    '--security-opt=no-new-privileges:true',
    '--ulimit=cpu=10:10',
    '--ulimit=nofile=128:128',
    '--ulimit=fsize=10485760:10485760',
    '--env=HOME=/tmp',
    '--env=TMPDIR=/tmp',
    '--log-driver=none',
    SANDBOX_IMAGE,
    language
  ];
}
