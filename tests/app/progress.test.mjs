import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLabXp,
  calculateLevel,
  getLabHelpLevel,
  LAB_HELP_XP_PERCENTAGES,
  recordLabHelp,
  setProjectStatus,
  toggleCareerItem,
  toggleWeek,
  toggleLab,
  toggleObjective,
  defaultProgress
} from '../../app/js/progress.js';

test('calculateLevel devuelve el nivel correcto por umbral de XP', () => {
  assert.equal(calculateLevel(0), '0');
  assert.equal(calculateLevel(299), '0');
  assert.equal(calculateLevel(300), 'Básico');
  assert.equal(calculateLevel(499), 'Básico');
  assert.equal(calculateLevel(500), 'Competente');
  assert.equal(calculateLevel(699), 'Competente');
  assert.equal(calculateLevel(700), 'Avanzado');
  assert.equal(calculateLevel(999), 'Avanzado');
  assert.equal(calculateLevel(1000), 'Profesional');
});

test('toggleWeek suma XP y marca la semana como completada', () => {
  const week = { id: 1, xp: 20 };
  const next = toggleWeek(defaultProgress, week);
  assert.deepEqual(next.completedWeeks, [1]);
  assert.equal(next.xp, 20);
});

test('toggleWeek revierte XP y desmarca al repetirse', () => {
  const week = { id: 1, xp: 20 };
  const once = toggleWeek(defaultProgress, week);
  const twice = toggleWeek(once, week);
  assert.deepEqual(twice.completedWeeks, []);
  assert.equal(twice.xp, 0);
});

test('toggleWeek nunca deja el XP en negativo', () => {
  const progress = { ...defaultProgress, xp: 5, completedWeeks: [1] };
  const next = toggleWeek(progress, { id: 1, xp: 20 });
  assert.equal(next.xp, 0);
});

test('toggleLab suma y revierte XP de forma independiente a las semanas', () => {
  const lab = { id: 'lab-01', xp: 25 };
  const afterComplete = toggleLab(defaultProgress, lab);
  assert.deepEqual(afterComplete.completedLabs, ['lab-01']);
  assert.equal(afterComplete.xp, 25);

  const afterRevert = toggleLab(afterComplete, lab);
  assert.deepEqual(afterRevert.completedLabs, []);
  assert.equal(afterRevert.xp, 0);
});

test('las etapas de ayuda aplican porcentajes de XP redondeados al entero más cercano', () => {
  const lab = { id: 'lab-01', xp: 100 };
  assert.deepEqual(LAB_HELP_XP_PERCENTAGES, [100, 90, 75, 60, 40]);
  assert.deepEqual(
    [0, 1, 2, 3, 4].map((level) => calculateLabXp(lab, level)),
    [100, 90, 75, 60, 40]
  );
  assert.deepEqual(
    [0, 1, 2, 3, 4].map((level) => calculateLabXp({ id: 'lab-02', xp: 25 }, level)),
    [25, 23, 19, 15, 10]
  );
  assert.throws(() => calculateLabXp({ id: 'lab-03', xp: 25 }, 5), /Nivel de ayuda inválido/);
});

test('revelar ayuda se persiste, no se puede saltar etapas y repetir no penaliza de nuevo', () => {
  const lab = { id: 'lab-01', xp: 100 };
  const first = recordLabHelp(defaultProgress, lab, 1);
  assert.equal(getLabHelpLevel(first, lab.id), 1);
  assert.equal(first.xp, 0);
  assert.throws(() => recordLabHelp(first, lab, 3), /debe revelarse en orden/);
  assert.equal(recordLabHelp(first, lab, 1), first);
});

test('completar y cambiar el nivel de ayuda ajusta exactamente el XP del laboratorio', () => {
  const lab = { id: 'lab-01', xp: 100 };
  const helped = recordLabHelp(defaultProgress, lab, 1);
  const completed = toggleLab(helped, lab);
  assert.equal(completed.xp, 90);

  assert.throws(() => recordLabHelp(completed, lab, 3), /debe revelarse en orden/);
  const secondHint = recordLabHelp(completed, lab, 2);
  assert.equal(secondHint.xp, 75);
  const thirdHint = recordLabHelp(secondHint, lab, 3);
  assert.equal(thirdHint.xp, 60);
  const solutionSeen = recordLabHelp(thirdHint, lab, 4);
  assert.equal(solutionSeen.xp, 40);
  assert.equal(recordLabHelp(solutionSeen, lab, 4), solutionSeen);

  const reverted = toggleLab(solutionSeen, lab);
  assert.equal(reverted.xp, 0);
  assert.deepEqual(reverted.completedLabs, []);
  assert.equal(toggleLab(reverted, lab).xp, 40);
});

test('usar una pista después de completar un lab antiguo recalcula la recompensa guardada', () => {
  const lab = { id: 'lab-01', xp: 25 };
  const oldProgress = { ...defaultProgress, xp: 25, completedLabs: [lab.id] };
  const updated = recordLabHelp(oldProgress, lab, 1);
  assert.equal(updated.xp, 23);
  assert.equal(oldProgress.xp, 25);
});

test('toggleObjective alterna un objetivo sin afectar el XP', () => {
  const marked = toggleObjective(defaultProgress, '1-goal-1');
  assert.deepEqual(marked.completedObjectives, ['1-goal-1']);
  assert.equal(marked.xp, defaultProgress.xp);

  const unmarked = toggleObjective(marked, '1-goal-1');
  assert.deepEqual(unmarked.completedObjectives, []);
});

test('el seguimiento de proyectos se guarda independientemente del XP y valida el estado', () => {
  const started = setProjectStatus(defaultProgress, 'project-01', 'in-progress');
  assert.equal(started.projectStatuses['project-01'], 'in-progress');
  assert.equal(started.xp, defaultProgress.xp);
  assert.deepEqual(defaultProgress.projectStatuses, {});
  assert.throws(() => setProjectStatus(started, 'project-01', 'unknown'), /Estado de proyecto inválido/);
  assert.throws(() => setProjectStatus(started, '', 'completed'), /identificador del proyecto es obligatorio/);
});

test('el checklist de empleo alterna elementos de forma inmutable y sin XP', () => {
  const checked = toggleCareerItem(defaultProgress, 'career-project');
  assert.deepEqual(checked.completedCareerItems, ['career-project']);
  assert.equal(checked.xp, defaultProgress.xp);
  assert.deepEqual(defaultProgress.completedCareerItems, []);
  assert.deepEqual(toggleCareerItem(checked, 'career-project').completedCareerItems, []);
  assert.throws(() => toggleCareerItem(checked, ''), /identificador del checklist es obligatorio/);
});

test('toggle* no mutan el objeto de progreso recibido (inmutabilidad)', () => {
  const original = { ...defaultProgress, completedWeeks: [], xp: 0 };
  const originalSnapshot = JSON.stringify(original);
  toggleWeek(original, { id: 1, xp: 20 });
  assert.equal(JSON.stringify(original), originalSnapshot);
});
