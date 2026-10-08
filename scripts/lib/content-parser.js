'use strict';

/**
 * Parser minimalista de contenido educativo: frontmatter (clave: valor) + secciones `## Titulo`.
 * No se usa una librería externa (js-yaml, markdown-it) porque el formato real de los archivos
 * es plano (clave: valor, listas con "-") y no requiere YAML completo ni render HTML.
 */

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    return { data: {}, body: raw };
  }

  const data = {};
  const lines = match[1].split(/\r?\n/);

  for (const line of lines) {
    if (!line.trim()) continue;
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((item) => item.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else if (/^-?\d+$/.test(value)) {
      value = Number(value);
    } else {
      value = value.replace(/^["']|["']$/g, '');
    }

    data[key] = value;
  }

  return { data, body: raw.slice(match[0].length) };
}

/**
 * Divide el cuerpo Markdown en secciones usando encabezados `## Titulo`.
 * Devuelve un mapa { "titulo normalizado": "contenido en texto plano" } y
 * preserva el texto original de cada sección para el PDF.
 */
function parseSections(body) {
  const lines = body.split(/\r?\n/);
  const sections = {};
  let currentKey = null;
  let buffer = [];

  const flush = () => {
    if (currentKey) {
      sections[currentKey] = buffer.join('\n').trim();
    }
    buffer = [];
  };

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+?)\s*$/);
    if (headingMatch) {
      flush();
      currentKey = normalizeKey(headingMatch[1]);
      continue;
    }
    if (currentKey) {
      buffer.push(line);
    }
  }
  flush();

  return sections;
}

/**
 * Igual que parseSections pero conserva el texto original del encabezado.
 * Se usa cuando el encabezado ES el dato (glosario, categorías de recursos),
 * a diferencia de weeks/labs donde el encabezado es solo una ranura semántica fija.
 */
function parseSectionsWithLabels(body) {
  const lines = body.split(/\r?\n/);
  const entries = [];
  let current = null;
  let buffer = [];

  const flush = () => {
    if (current) {
      entries.push({ heading: current, content: buffer.join('\n').trim() });
    }
    buffer = [];
  };

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+?)\s*$/);
    if (headingMatch) {
      flush();
      current = headingMatch[1].trim();
      continue;
    }
    if (current) {
      buffer.push(line);
    }
  }
  flush();

  return entries;
}

function normalizeKey(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

function sectionToList(sectionText) {
  if (!sectionText) return [];
  return sectionText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('-') || /^\d+\./.test(line))
    .map((line) => line.replace(/^-\s*/, '').replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean);
}

function sectionToText(sectionText) {
  if (!sectionText) return '';
  return sectionText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join(' ');
}

function parseDocument(raw) {
  const { data, body } = parseFrontmatter(raw);
  const titleMatch = body.match(/^#\s+(.+?)\s*$/m);
  const sections = parseSections(body);
  return {
    frontmatter: data,
    title: titleMatch ? titleMatch[1].trim() : data.title || null,
    sections
  };
}

module.exports = {
  parseFrontmatter,
  parseSections,
  parseSectionsWithLabels,
  parseDocument,
  sectionToList,
  sectionToText,
  normalizeKey
};
