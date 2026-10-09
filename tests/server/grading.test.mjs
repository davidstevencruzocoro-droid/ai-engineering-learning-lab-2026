import test from 'node:test';
import assert from 'node:assert/strict';
import { getGradableExercise, listGradableExercises } from '../../server/grading.mjs';

test('el registro expone exactamente los ejercicios calificables definidos', () => {
  const exercises = listGradableExercises();
  assert.deepEqual(
    exercises.map((e) => `${e.labId}:${e.language}`).sort(),
    ['lab-04:sql', 'lab-06:javascript', 'lab-19:javascript']
  );
});

test('build() del ejercicio lab-06 (break the system) añade el arnés tras el código del estudiante', () => {
  const exercise = getGradableExercise('lab-06', 'javascript');
  const combined = exercise.build('function validarPedido(p) { return { valido: true, errores: [] }; }');
  assert.ok(combined.startsWith('function validarPedido'));
  assert.match(combined, /__runGrading/);
});

test('parse() del ejercicio lab-06 detecta cuando una solución con bugs falla varios checks', () => {
  const exercise = getGradableExercise('lab-06', 'javascript');
  const stdout = [
    'GRADE_RESULT:' + JSON.stringify({ name: 'un pedido válido se marca como válido', pass: false, detail: '' }),
    'GRADE_RESULT:' + JSON.stringify({ name: 'cantidad 0 se reporta como inválida', pass: false, detail: '' }),
    'GRADE_SUMMARY:' + JSON.stringify({ passed: 0, total: 2 })
  ].join('\n');
  const graded = exercise.parse(stdout);
  assert.equal(graded.summary.passed, 0);
  assert.ok(graded.results.every((r) => r.pass === false));
});

test('getGradableExercise devuelve null para combinaciones sin arnés', () => {
  assert.equal(getGradableExercise('lab-01', 'javascript'), null);
  assert.equal(getGradableExercise('lab-19', 'python'), null);
});

test('build() del ejercicio lab-19 añade el arnés después del código del estudiante', () => {
  const exercise = getGradableExercise('lab-19', 'javascript');
  const combined = exercise.build('class CircuitBreaker {}');
  assert.ok(combined.startsWith('class CircuitBreaker {}'));
  assert.match(combined, /__runGrading/);
});

test('parse() del ejercicio lab-19 lee GRADE_RESULT/GRADE_SUMMARY desde stdout', () => {
  const exercise = getGradableExercise('lab-19', 'javascript');
  const stdout = [
    'GRADE_RESULT:' + JSON.stringify({ name: 'abre tras 3 fallos', pass: true, detail: '' }),
    'GRADE_RESULT:' + JSON.stringify({ name: 'rechaza mientras está abierto', pass: false, detail: '' }),
    'GRADE_SUMMARY:' + JSON.stringify({ passed: 1, total: 2 })
  ].join('\n');

  const graded = exercise.parse(stdout);
  assert.equal(graded.results.length, 2);
  assert.equal(graded.summary.passed, 1);
  assert.equal(graded.summary.total, 2);
  assert.equal(graded.executionFailed, undefined);
});

test('parse() del ejercicio lab-19 marca executionFailed si no hay GRADE_SUMMARY (p.ej. error de sintaxis)', () => {
  const exercise = getGradableExercise('lab-19', 'javascript');
  const graded = exercise.parse('SyntaxError: Unexpected token');
  assert.equal(graded.executionFailed, true);
  assert.equal(graded.summary.passed, 0);
});

test('parse() del ejercicio lab-04 interpreta los checkpoints GRADE_CHECK y su valor siguiente', () => {
  const exercise = getGradableExercise('lab-04', 'sql');
  const stdout = [
    'GRADE_CHECK:tabla_tasks_existe',
    '1',
    'GRADE_CHECK:columna_title_not_null',
    '1',
    'GRADE_CHECK:tiene_al_menos_dos_filas',
    '2',
    'GRADE_CHECK:tiene_alguna_completada',
    '1'
  ].join('\n');

  const graded = exercise.parse(stdout);
  assert.equal(graded.summary.passed, 4);
  assert.equal(graded.summary.total, 4);
});

test('parse() del ejercicio lab-04 falla los checks cuyo valor no cumple el umbral', () => {
  const exercise = getGradableExercise('lab-04', 'sql');
  const stdout = ['GRADE_CHECK:tabla_tasks_existe', '0'].join('\n');

  const graded = exercise.parse(stdout);
  assert.equal(graded.results[0].pass, false);
});
