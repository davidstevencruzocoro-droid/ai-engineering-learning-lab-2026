'use strict';

const fs = require('fs');
const path = require('path');
const { parseDocument, parseSectionsWithLabels, parseFrontmatter, sectionToList, sectionToText } = require('./lib/content-parser');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'generated');
const OUT_FILE = path.join(OUT_DIR, 'content.json');

function pick(sections, ...keys) {
  for (const key of keys) {
    if (sections[key] !== undefined && sections[key] !== '') return sections[key];
  }
  return '';
}

function readDir(relDir) {
  const full = path.join(ROOT, relDir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((file) => file.endsWith('.md'))
    .map((file) => ({
      file,
      fullPath: path.join(full, file),
      raw: fs.readFileSync(path.join(full, file), 'utf8')
    }));
}

// --- Semanas -----------------------------------------------------------

function buildWeeks() {
  const files = readDir('content/weeks');
  const weeks = files.map(({ file, raw }) => {
    const doc = parseDocument(raw);
    const s = doc.sections;
    const id = Number(doc.frontmatter.id);

    return {
      id,
      level: Number(doc.frontmatter.level),
      xp: Number(doc.frontmatter.xp),
      title: doc.frontmatter.title || doc.title,
      objective: sectionToText(pick(s, 'objetivo')),
      whyItMatters: sectionToText(pick(s, 'por que importa')),
      concepts: sectionToList(pick(s, 'conceptos')),
      architecture: pick(s, 'arquitectura'),
      example: pick(s, 'ejemplo'),
      labSummary: sectionToText(pick(s, 'laboratorio')),
      preparation: sectionToList(pick(s, 'preparacion')),
      steps: [pick(s, 'paso 1'), pick(s, 'paso 2'), pick(s, 'paso 3')]
        .map(sectionToText)
        .filter(Boolean),
      verification: pick(s, 'verificacion'),
      commonErrors: sectionToList(pick(s, 'errores comunes')),
      debugging: sectionToText(pick(s, 'debugging')),
      challenge: sectionToText(pick(s, 'reto')),
      advancedChallenge: sectionToText(pick(s, 'reto avanzado')),
      breakSystem: sectionToText(pick(s, 'break the system')),
      recovery: sectionToText(pick(s, 'recovery')),
      evaluation: sectionToList(pick(s, 'evaluacion')),
      evidence: sectionToText(pick(s, 'evidencia')),
      approvalCriteria: sectionToText(pick(s, 'criterio de aprobacion')),
      source: `content/weeks/${file}`
    };
  });

  weeks.sort((a, b) => a.id - b.id);
  return weeks;
}

// --- Laboratorios --------------------------------------------------------

function buildLabs() {
  const files = readDir('content/labs');
  const labs = files.map(({ file, raw }) => {
    const doc = parseDocument(raw);
    const s = doc.sections;
    const hints = [
      sectionToText(pick(s, 'pista')),
      sectionToText(pick(s, 'pista 2')),
      sectionToText(pick(s, 'pista 3'))
    ];

    return {
      id: doc.frontmatter.id,
      week: Number(doc.frontmatter.week),
      xp: Number(doc.frontmatter.xp),
      title: doc.frontmatter.title || doc.title,
      description: sectionToText(pick(s, 'objetivo')),
      expectedOutcome: sectionToList(pick(s, 'resultado esperado')),
      duration: sectionToText(pick(s, 'duracion')),
      requirements: sectionToList(pick(s, 'requisitos')),
      steps: sectionToList(pick(s, 'instrucciones', 'tareas')),
      hint: hints[0],
      hints,
      solution: pick(s, 'solucion'),
      penalty: sectionToText(pick(s, 'penalizacion xp')),
      evidence: sectionToText(pick(s, 'evidencia')),
      criteria: sectionToText(pick(s, 'criterio de aprobacion')),
      gradedExercise: pick(s, 'ejercicio calificado'),
      type: 'laboratorio',
      source: `content/labs/${file}`,
      pending: false
    };
  });

  return labs.sort((a, b) => a.week - b.week);
}

// --- Retos ---------------------------------------------------------------

function buildChallenges() {
  const files = readDir('content/challenges');
  return files.map(({ file, raw }) => {
    const doc = parseDocument(raw);
    const s = doc.sections;

    return {
      id: doc.frontmatter.id,
      title: doc.frontmatter.title || doc.title,
      xp: Number(doc.frontmatter.xp),
      level: doc.frontmatter.level,
      statement: sectionToText(pick(s, 'enunciado')),
      objective: sectionToText(pick(s, 'objetivo')),
      scoring: sectionToText(pick(s, 'puntuacion')),
      penalty: sectionToText(pick(s, 'penalizacion')),
      source: `content/challenges/${file}`,
      pending: false
    };
  });
}

// --- Glosario --------------------------------------------------------------

function buildGlossary() {
  const file = path.join(ROOT, 'content/glossary/terms.md');
  if (!fs.existsSync(file)) return [];
  const raw = fs.readFileSync(file, 'utf8');
  const { body } = parseFrontmatter(raw);
  return parseSectionsWithLabels(body).map(({ heading, content }) => ({
    term: heading,
    definition: sectionToText(content)
  }));
}

// --- Recursos ----------------------------------------------------------

function buildResources() {
  const file = path.join(ROOT, 'content/resources/essential-resources.md');
  if (!fs.existsSync(file)) return [];
  const raw = fs.readFileSync(file, 'utf8');
  const { body: docBody } = parseFrontmatter(raw);

  const resources = [];
  for (const { heading: category, content } of parseSectionsWithLabels(docBody)) {
    const lines = content.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.startsWith('-'));
    for (const line of lines) {
      const match = line.match(/^-\s*(.+?):\s*(https?:\/\/\S+)/);
      if (match) {
        resources.push({ category, title: match[1].trim(), url: match[2].trim() });
      }
    }
  }
  return resources;
}

// --- Proyectos acumulativos ------------------------------------------------

function buildProjects() {
  const files = readDir('content/projects');
  const projects = files
    .filter(({ file }) => file !== 'project-final.md')
    .map(({ file, raw }) => {
      const doc = parseDocument(raw);
      const s = doc.sections;

      return {
        id: doc.frontmatter.id,
        title: doc.frontmatter.title || doc.title,
        weekStart: Number(doc.frontmatter.weekStart),
        weekEnd: Number(doc.frontmatter.weekEnd),
        xp: Number(doc.frontmatter.xp),
        vision: sectionToText(pick(s, 'vision')),
        problem: sectionToText(pick(s, 'problema')),
        stack: sectionToText(pick(s, 'stack')),
        deliverables: sectionToList(pick(s, 'entregables')),
        successCriteria: sectionToList(pick(s, 'criterios de exito')),
        finalProjectLink: sectionToText(pick(s, 'conexion con el proyecto final')),
        source: `content/projects/${file}`
      };
    });

  const finalFile = files.find(({ file }) => file === 'project-final.md');
  let finalProject = null;
  if (finalFile) {
    const doc = parseDocument(finalFile.raw);
    const s = doc.sections;
    finalProject = {
      id: doc.frontmatter.id,
      title: doc.frontmatter.title || doc.title,
      weekStart: Number(doc.frontmatter.weekStart),
      weekEnd: Number(doc.frontmatter.weekEnd),
      xp: Number(doc.frontmatter.xp),
      vision: sectionToText(pick(s, 'vision')),
      problem: sectionToText(pick(s, 'problema')),
      stack: sectionToText(pick(s, 'stack')),
      deliverables: sectionToList(pick(s, 'entregables')),
      successCriteria: sectionToList(pick(s, 'criterios de exito')),
      relation: sectionToText(pick(s, 'relacion con el resto del laboratorio')),
      source: `content/projects/${finalFile.file}`
    };
  }

  return { projects: projects.sort((a, b) => a.weekStart - b.weekStart), finalProject };
}

// --- Terminal Tutor (comandos reales explicados) --------------------------

function buildTerminalCommands() {
  const files = readDir('content/terminal');
  const commands = files.map(({ file, raw }) => {
    const doc = parseDocument(raw);
    const s = doc.sections;

    return {
      id: doc.frontmatter.id,
      command: doc.frontmatter.command || doc.title,
      category: doc.frontmatter.category || 'General',
      risk: doc.frontmatter.risk || 'bajo',
      whatItDoes: sectionToText(pick(s, 'que hace')),
      whenToUse: sectionToText(pick(s, 'cuando usarlo')),
      risks: sectionToText(pick(s, 'riesgos')),
      example: pick(s, 'ejemplo'),
      exercise: sectionToText(pick(s, 'ejercicio')),
      commonError: sectionToText(pick(s, 'error comun')),
      recovery: sectionToText(pick(s, 'recovery')),
      source: `content/terminal/${file}`
    };
  });

  const order = { alto: 0, medio: 1, bajo: 2 };
  return commands.sort((a, b) => (order[a.risk] ?? 9) - (order[b.risk] ?? 9) || a.command.localeCompare(b.command));
}

// --- Main ----------------------------------------------------------------

function build() {
  const weeks = buildWeeks();
  const labs = buildLabs();
  const challenges = buildChallenges();
  const glossary = buildGlossary();
  const resources = buildResources();
  const { projects, finalProject } = buildProjects();
  const terminalCommands = buildTerminalCommands();

  const content = {
    generatedAt: new Date().toISOString(),
    weeks,
    labs,
    challenges,
    glossary,
    resources,
    projects,
    finalProject,
    terminalCommands,
    meta: {
      weeksTotal: weeks.length,
      labsFromMarkdown: labs.filter((l) => !l.pending).length,
      labsPending: labs.filter((l) => l.pending).length,
      challengesFromMarkdown: challenges.filter((c) => !c.pending).length,
      challengesPending: challenges.filter((c) => c.pending).length,
      projectsTotal: projects.length,
      hasFinalProject: Boolean(finalProject),
      terminalCommandsTotal: terminalCommands.length
    }
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(content, null, 2), 'utf8');

  return content;
}

if (require.main === module) {
  const content = build();
  console.log(`generated/content.json escrito: ${content.weeks.length} semanas, ${content.meta.labsFromMarkdown} labs desde Markdown + ${content.meta.labsPending} pendientes (Fase B), ${content.meta.challengesFromMarkdown} retos desde Markdown + ${content.meta.challengesPending} pendientes.`);
}

module.exports = { build };
