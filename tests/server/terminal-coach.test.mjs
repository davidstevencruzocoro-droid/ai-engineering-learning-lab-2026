import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getCoachCommandCatalog,
  validateCoachPayload
} from '../../server/terminal-coach.mjs';

test('el catálogo contiene solo diagnósticos documentados de lectura', () => {
  const commands = getCoachCommandCatalog();
  assert.ok(commands.length >= 5);
  assert.ok(commands.some((command) => command.id === 'docker-ps'));
  for (const command of commands) {
    assert.ok(command.id);
    assert.ok(command.command);
    assert.ok(command.verification);
    assert.ok(Array.isArray(command.commonErrors));
    assert.ok(command.recovery);
  }
});

test('la ejecución exige predicción acotada y acepta únicamente ids del catálogo', () => {
  assert.deepEqual(
    validateCoachPayload({ commandId: 'git-version', prediction: ' Espero Git 2.x ' }),
    { commandId: 'git-version', prediction: 'Espero Git 2.x' }
  );
  assert.throws(() => validateCoachPayload({ commandId: 'git-version', prediction: '' }), /Escribe primero/);
  assert.throws(
    () => validateCoachPayload({ commandId: 'git-version', prediction: 'x'.repeat(501) }),
    /supera el límite/
  );
  assert.throws(
    () => validateCoachPayload({ commandId: 'git-version; whoami', prediction: 'algo' }),
    /catálogo/
  );
});
