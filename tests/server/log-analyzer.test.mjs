import test from 'node:test';
import assert from 'node:assert/strict';
import { validateLogAnalysisPayload, MAX_LOG_TEXT_LENGTH, MAX_LOG_CONTEXT_LENGTH } from '../../server/security.mjs';

test('validateLogAnalysisPayload acepta un log con contexto opcional', () => {
  const result = validateLogAnalysisPayload({ logText: 'TypeError: x is not a function', context: 'al ejecutar npm run build' });
  assert.equal(result.logText, 'TypeError: x is not a function');
  assert.equal(result.context, 'al ejecutar npm run build');
});

test('validateLogAnalysisPayload funciona sin contexto', () => {
  const result = validateLogAnalysisPayload({ logText: 'Error 500' });
  assert.equal(result.context, '');
});

test('validateLogAnalysisPayload rechaza texto vacío', () => {
  assert.throws(() => validateLogAnalysisPayload({ logText: '   ' }), TypeError);
  assert.throws(() => validateLogAnalysisPayload({}), TypeError);
});

test('validateLogAnalysisPayload rechaza texto por encima del límite', () => {
  assert.throws(() => validateLogAnalysisPayload({ logText: 'x'.repeat(MAX_LOG_TEXT_LENGTH + 1) }), RangeError);
});

test('validateLogAnalysisPayload recorta el contexto al límite en vez de fallar', () => {
  const result = validateLogAnalysisPayload({ logText: 'err', context: 'y'.repeat(MAX_LOG_CONTEXT_LENGTH + 50) });
  assert.equal(result.context.length, MAX_LOG_CONTEXT_LENGTH);
});

test('validateLogAnalysisPayload rechaza un cuerpo que no es objeto', () => {
  assert.throws(() => validateLogAnalysisPayload(null), TypeError);
  assert.throws(() => validateLogAnalysisPayload('texto'), TypeError);
});
