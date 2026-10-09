// Autocalificación: combina el código del estudiante con un arnés de pruebas oculto
// y lo ejecuta en el MISMO sandbox que /api/run (sin tocar runner.py ni el Dockerfile).
// El arnés nunca se expone al cliente: solo vive aquí, en el proceso del servidor.

const JS_CIRCUIT_BREAKER_HARNESS = `
async function __runGrading() {
  const results = [];
  const record = (name, pass, detail) => { results.push({ name, pass: Boolean(pass), detail: detail || '' }); };

  try {
    const cb = new CircuitBreaker(3, 60);
    let intentosReales = 0;
    const fallando = async () => { intentosReales++; throw new Error('fallo simulado'); };

    for (let i = 0; i < 3; i++) {
      try { await cb.ejecutar(fallando); } catch (e) {}
    }
    record('abre el circuito tras 3 fallos consecutivos', cb.estado === 'abierto', 'estado actual: ' + cb.estado);

    const intentosAntesDeAbrir = intentosReales;
    let rechazoSinLlamar = false;
    try {
      await cb.ejecutar(fallando);
    } catch (e) {
      rechazoSinLlamar = intentosReales === intentosAntesDeAbrir;
    }
    record('mientras está abierto, rechaza sin ejecutar la función real', rechazoSinLlamar);

    await new Promise((r) => setTimeout(r, 90));
    const exitosa = async () => 'ok';
    let seRecupero = false;
    try {
      const salida = await cb.ejecutar(exitosa);
      seRecupero = salida === 'ok' && cb.estado === 'cerrado';
    } catch (e) {}
    record('se recupera a "cerrado" tras una ejecución exitosa pasado el tiempo de espera', seRecupero, 'estado final: ' + cb.estado);
  } catch (error) {
    record('la clase CircuitBreaker existe y es instanciable con (umbralFallos, tiempoEsperaMs)', false, String((error && error.message) || error));
  }

  const passed = results.filter((r) => r.pass).length;
  for (const r of results) console.log('GRADE_RESULT:' + JSON.stringify(r));
  console.log('GRADE_SUMMARY:' + JSON.stringify({ passed, total: results.length }));
}
__runGrading();
`;

const SQL_TASKS_SCHEMA_HARNESS = `
.print GRADE_CHECK:tabla_tasks_existe
SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='tasks';
.print GRADE_CHECK:columna_title_not_null
SELECT COUNT(*) FROM pragma_table_info('tasks') WHERE name='title' AND "notnull"=1;
.print GRADE_CHECK:tiene_al_menos_dos_filas
SELECT COUNT(*) FROM tasks;
.print GRADE_CHECK:tiene_alguna_completada
SELECT COUNT(*) FROM tasks WHERE completed = 1;
`;

const SQL_TASKS_CHECKS = [
  { name: 'tabla_tasks_existe', label: 'La tabla "tasks" existe', expect: (v) => Number(v) >= 1 },
  { name: 'columna_title_not_null', label: 'La columna "title" es NOT NULL', expect: (v) => Number(v) >= 1 },
  { name: 'tiene_al_menos_dos_filas', label: 'Hay al menos 2 filas insertadas', expect: (v) => Number(v) >= 2 },
  { name: 'tiene_alguna_completada', label: 'Al menos una fila tiene completed = 1', expect: (v) => Number(v) >= 1 }
];

function parseJsonGrading(stdout, expectedTotal) {
  const results = [];
  let summary = null;
  for (const line of stdout.split(/\r?\n/)) {
    if (line.startsWith('GRADE_RESULT:')) {
      try { results.push(JSON.parse(line.slice('GRADE_RESULT:'.length))); } catch {}
    } else if (line.startsWith('GRADE_SUMMARY:')) {
      try { summary = JSON.parse(line.slice('GRADE_SUMMARY:'.length)); } catch {}
    }
  }
  if (!summary) {
    return { results: [], summary: { passed: 0, total: expectedTotal }, executionFailed: true };
  }
  return { results, summary };
}

function parseSqlGrading(stdout) {
  const lines = stdout.split(/\r?\n/);
  // Mapa por nombre de check, no un array: si el código del estudiante imprime por su cuenta
  // una línea "GRADE_CHECK:<nombre>" (a propósito o por accidente, p.ej. copiando el enunciado),
  // el arnés real se añade SIEMPRE después y debe ser la fuente de verdad — se queda con la
  // última ocurrencia de cada nombre, nunca con un conteo acumulado de apariciones.
  const byName = new Map();
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^GRADE_CHECK:(.+)$/);
    if (!match) continue;
    const check = SQL_TASKS_CHECKS.find((c) => c.name === match[1]);
    if (!check) continue;
    const value = (lines[i + 1] ?? '').trim();
    byName.set(check.name, { name: check.label, pass: check.expect(value), detail: `valor observado: ${value || '(vacío)'}` });
  }

  if (byName.size === 0) {
    return { results: [], summary: { passed: 0, total: SQL_TASKS_CHECKS.length }, executionFailed: true };
  }
  // Se reporta en el orden fijo del arnés, no en el orden de aparición en stdout.
  const results = SQL_TASKS_CHECKS.filter((check) => byName.has(check.name)).map((check) => byName.get(check.name));
  const passed = results.filter((r) => r.pass).length;
  return { results, summary: { passed, total: results.length } };
}

// BREAK THE SYSTEM: el estudiante recibe código con bugs plantados (ver el enunciado
// público en content/labs/lab-week-06.md) y debe corregirlo. Mismo mecanismo de
// calificación que el resto — "romper y arreglar" es una cuestión de contenido, no
// de infraestructura nueva: no se simulan fallos reales del sistema del usuario.
const JS_ORDER_VALIDATOR_HARNESS = `
async function __runGrading() {
  const results = [];
  const record = (name, pass, detail) => { results.push({ name, pass: Boolean(pass), detail: detail || '' }); };

  try {
    const r1 = validarPedido({ producto: 'Teclado', cantidad: 2, cliente: 'Ana' });
    record('un pedido válido se marca como válido', Boolean(r1) && r1.valido === true, 'resultado: ' + JSON.stringify(r1));

    const r2 = validarPedido({ producto: 'Mouse', cantidad: 0, cliente: 'Ana' });
    record('cantidad 0 se reporta como inválida', Boolean(r2) && r2.valido === false && Array.isArray(r2.errores) && r2.errores.includes('cantidad invalida'), 'resultado: ' + JSON.stringify(r2));

    let threw = false;
    let r3;
    try { r3 = validarPedido({ producto: 'Mouse', cantidad: 1 }); } catch (e) { threw = true; }
    record('un pedido sin cliente no lanza una excepción', !threw, threw ? 'lanzó una excepción' : ('resultado: ' + JSON.stringify(r3)));
    record('un pedido sin cliente se reporta inválido con el motivo correcto', !threw && Boolean(r3) && r3.valido === false && Array.isArray(r3.errores) && r3.errores.includes('falta cliente'), threw ? 'no aplica: lanzó excepción' : ('resultado: ' + JSON.stringify(r3)));

    const r4 = validarPedido({ cantidad: 1, cliente: 'Ana' });
    record('un pedido sin producto se reporta como inválido', Boolean(r4) && r4.valido === false && Array.isArray(r4.errores) && r4.errores.includes('falta producto'), 'resultado: ' + JSON.stringify(r4));
  } catch (error) {
    record('la función validarPedido existe y es invocable con (pedido)', false, String((error && error.message) || error));
  }

  const passed = results.filter((r) => r.pass).length;
  for (const r of results) console.log('GRADE_RESULT:' + JSON.stringify(r));
  console.log('GRADE_SUMMARY:' + JSON.stringify({ passed, total: results.length }));
}
__runGrading();
`;

// Registro de ejercicios calificables. Añadir uno nuevo es: una entrada aquí + el runner ya existente.
export const GRADABLE_EXERCISES = {
  'lab-19': {
    javascript: {
      label: 'Circuit breaker (JavaScript)',
      build: (studentSource) => `${studentSource}\n\n${JS_CIRCUIT_BREAKER_HARNESS}`,
      parse: (stdout) => parseJsonGrading(stdout, 3)
    }
  },
  'lab-04': {
    sql: {
      label: 'Esquema de tabla "tasks" (SQL)',
      build: (studentSource) => `${studentSource}\n${SQL_TASKS_SCHEMA_HARNESS}`,
      parse: (stdout) => parseSqlGrading(stdout)
    }
  },
  'lab-06': {
    javascript: {
      label: 'Break the system: corrige validarPedido (JavaScript)',
      build: (studentSource) => `${studentSource}\n\n${JS_ORDER_VALIDATOR_HARNESS}`,
      parse: (stdout) => parseJsonGrading(stdout, 5)
    }
  }
};

export function getGradableExercise(labId, language) {
  return GRADABLE_EXERCISES[labId]?.[language] || null;
}

export function listGradableExercises() {
  return Object.entries(GRADABLE_EXERCISES).flatMap(([labId, byLanguage]) =>
    Object.entries(byLanguage).map(([language, exercise]) => ({ labId, language, label: exercise.label }))
  );
}
