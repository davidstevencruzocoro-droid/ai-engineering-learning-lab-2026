const test = require('node:test');
const assert = require('node:assert/strict');
const { build } = require('../../scripts/build-content');

test('el pipeline genera las 24 semanas con campos obligatorios completos', () => {
  const content = build();
  assert.equal(content.weeks.length, 24);

  for (const week of content.weeks) {
    assert.ok(week.objective, `semana ${week.id} sin objetivo`);
    assert.ok(week.breakSystem, `semana ${week.id} sin BREAK THE SYSTEM`);
    assert.ok(week.recovery, `semana ${week.id} sin RECOVERY`);
    assert.ok(week.approvalCriteria, `semana ${week.id} sin criterio de aprobación`);
    assert.ok(week.concepts.length > 0, `semana ${week.id} sin conceptos`);
  }
});

test('ids de semana son 1..24 sin huecos ni duplicados', () => {
  const content = build();
  const ids = content.weeks.map((w) => w.id).sort((a, b) => a - b);
  assert.deepEqual(ids, Array.from({ length: 24 }, (_, i) => i + 1));
});

test('cada lab con Markdown propio tiene pista, solución y criterio', () => {
  const content = build();
  for (const lab of content.labs.filter((l) => !l.pending)) {
    assert.ok(lab.hint, `${lab.id} sin pista`);
    assert.equal(lab.hints.length, 3, `${lab.id} debe tener tres pistas`);
    assert.ok(lab.hints.every(Boolean), `${lab.id} tiene una pista progresiva vacía`);
    assert.equal(lab.hint, lab.hints[0], `${lab.id} debe conservar hint como alias de la pista 1`);
    assert.ok(lab.solution, `${lab.id} sin solución`);
    assert.ok(lab.criteria, `${lab.id} sin criterio de aprobación`);
  }
});

test('labs pendientes de Fase B quedan marcados como tal, no ocultos', () => {
  const content = build();
  const pending = content.labs.filter((l) => l.pending);
  assert.equal(pending.length, content.meta.labsPending);
  for (const lab of pending) {
    assert.match(lab.source, /fallback/);
  }
});

test('el glosario no tiene términos duplicados ni vacíos', () => {
  const content = build();
  const terms = content.glossary.map((g) => g.term.toLowerCase());
  assert.equal(new Set(terms).size, terms.length);
  for (const entry of content.glossary) {
    assert.ok(entry.definition.length > 0, `término sin definición: ${entry.term}`);
  }
});

test('todos los recursos usan HTTPS', () => {
  const content = build();
  assert.ok(content.resources.length > 0);
  for (const resource of content.resources) {
    assert.match(resource.url, /^https:\/\//);
  }
});
