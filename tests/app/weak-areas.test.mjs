import test from 'node:test';
import assert from 'node:assert/strict';
import { recordGradingAttempt, getWeakAreas, getMasteredExercises, defaultProgress } from '../../app/js/progress.js';

const failingResult = {
  labId: 'lab-19',
  language: 'javascript',
  results: [
    { name: 'abre tras 3 fallos', pass: false, detail: '' },
    { name: 'rechaza mientras abierto', pass: true, detail: '' }
  ],
  summary: { passed: 1, total: 2 }
};

const passingResult = {
  labId: 'lab-04',
  language: 'sql',
  results: [{ name: 'tabla existe', pass: true, detail: '' }],
  summary: { passed: 1, total: 1 }
};

test('recordGradingAttempt registra un intento con sus checks fallidos', () => {
  const next = recordGradingAttempt(defaultProgress, failingResult);
  const attempt = next.gradingAttempts['lab-19:javascript'];
  assert.equal(attempt.attempts, 1);
  assert.equal(attempt.resolved, false);
  assert.deepEqual(attempt.failingChecks, ['abre tras 3 fallos']);
});

test('recordGradingAttempt marca resolved cuando todo pasa', () => {
  const next = recordGradingAttempt(defaultProgress, passingResult);
  assert.equal(next.gradingAttempts['lab-04:sql'].resolved, true);
});

test('recordGradingAttempt incrementa attempts en intentos sucesivos del mismo ejercicio', () => {
  const once = recordGradingAttempt(defaultProgress, failingResult);
  const twice = recordGradingAttempt(once, failingResult);
  assert.equal(twice.gradingAttempts['lab-19:javascript'].attempts, 2);
});

test('getWeakAreas devuelve solo los ejercicios no resueltos', () => {
  let progress = recordGradingAttempt(defaultProgress, failingResult);
  progress = recordGradingAttempt(progress, passingResult);
  const weak = getWeakAreas(progress);
  assert.equal(weak.length, 1);
  assert.equal(weak[0].labId, 'lab-19');
});

test('getMasteredExercises devuelve solo los ejercicios resueltos', () => {
  let progress = recordGradingAttempt(defaultProgress, failingResult);
  progress = recordGradingAttempt(progress, passingResult);
  const mastered = getMasteredExercises(progress);
  assert.equal(mastered.length, 1);
  assert.equal(mastered[0].labId, 'lab-04');
});

test('un ejercicio que se resuelve tras varios intentos deja de aparecer en weakAreas', () => {
  let progress = recordGradingAttempt(defaultProgress, failingResult);
  assert.equal(getWeakAreas(progress).length, 1);
  progress = recordGradingAttempt(progress, { ...failingResult, results: [{ name: 'x', pass: true }], summary: { passed: 2, total: 2 } });
  assert.equal(getWeakAreas(progress).length, 0);
});

test('recordGradingAttempt no muta el progreso original (inmutabilidad)', () => {
  const snapshot = JSON.stringify(defaultProgress);
  recordGradingAttempt(defaultProgress, failingResult);
  assert.equal(JSON.stringify(defaultProgress), snapshot);
});
