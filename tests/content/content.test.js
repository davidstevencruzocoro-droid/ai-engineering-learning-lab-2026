const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', '..');

test('documentacion principal existe', () => {
  assert.ok(fs.existsSync(path.join(root, 'README.md')));
  assert.ok(fs.existsSync(path.join(root, 'docs', 'ARCHITECTURE.md')));
  assert.ok(fs.existsSync(path.join(root, 'docs', 'CURRICULUM.md')));
});

test('estructura de proyecto base existe', () => {
  assert.ok(fs.existsSync(path.join(root, 'app')));
  assert.ok(fs.existsSync(path.join(root, 'content')));
  assert.ok(fs.existsSync(path.join(root, 'scripts')));
  assert.ok(fs.existsSync(path.join(root, 'tests')));
});

test('la navegación de demo apunta a destinos únicos', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  const links = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);

  assert.equal(new Set(ids).size, ids.length, 'los IDs HTML deben ser únicos');
  assert.ok(ids.includes('main-content'), 'debe existir el destino del enlace para saltar al contenido');
  assert.ok(links.length > 0, 'debe haber navegación por anclas');
  for (const link of links) {
    assert.ok(ids.includes(link), `el enlace #${link} debe tener un destino`);
  }
});
