'use strict';

const fs = require('fs');
const path = require('path');
const { build } = require('./build-content');

const root = path.join(__dirname, '..');

const errors = [];
const warnings = [];

// --- Estructura base ------------------------------------------------------

const requiredDirs = [
  'content/roadmap',
  'content/weeks',
  'content/lessons',
  'content/labs',
  'content/challenges',
  'content/projects',
  'content/glossary',
  'content/resources',
  'content/terminal',
  'docs',
  'scripts',
  'tests'
];

for (const dir of requiredDirs) {
  if (!fs.existsSync(path.join(root, dir))) {
    errors.push(`Falta el directorio: ${dir}`);
  }
}

const requiredFiles = [
  'README.md',
  'index.html',
  'package.json',
  'docs/ARCHITECTURE.md',
  'docs/CURRICULUM.md',
  'docs/LAB-RULES.md',
  'docs/CONTRIBUTING.md',
  'docs/SECURITY.md',
  'docs/OPERATIONS.md',
  'docs/TESTING.md',
  'docs/AI-EVALUATION.md',
  'docs/COSTS.md',
  'docs/POSTMORTEM.md'
];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    errors.push(`Falta el archivo: ${file}`);
  }
}

// --- Contenido real (semanas, labs, retos, glosario, recursos) -----------

const content = build();

const REQUIRED_WEEK_FIELDS = ['objective', 'concepts', 'challenge', 'breakSystem', 'recovery', 'evaluation', 'evidence', 'approvalCriteria'];

if (content.weeks.length !== 24) {
  errors.push(`Se esperaban 24 semanas, se encontraron ${content.weeks.length}.`);
}

const seenWeekIds = new Set();
for (const week of content.weeks) {
  if (!week.id || Number.isNaN(week.id)) {
    errors.push(`Semana con id inválido en ${week.source}`);
    continue;
  }
  if (seenWeekIds.has(week.id)) {
    errors.push(`Semana duplicada: id ${week.id} (${week.source})`);
  }
  seenWeekIds.add(week.id);

  for (const field of REQUIRED_WEEK_FIELDS) {
    const value = week[field];
    const isEmpty = value === undefined || value === '' || (Array.isArray(value) && value.length === 0);
    if (isEmpty) {
      errors.push(`Semana ${week.id} (${week.source}): falta la sección "${field}".`);
    }
  }
}
for (let id = 1; id <= 24; id++) {
  if (!seenWeekIds.has(id)) {
    errors.push(`Falta content/weeks/week-${String(id).padStart(2, '0')}.md (semana ${id}).`);
  }
}

const seenLabIds = new Set();
let labsPendingCount = 0;
for (const lab of content.labs) {
  if (seenLabIds.has(lab.id)) {
    errors.push(`Laboratorio duplicado: id ${lab.id}`);
  }
  seenLabIds.add(lab.id);

  if (lab.pending) {
    labsPendingCount++;
    warnings.push(`Lab semana ${lab.week} (${lab.id}) sin archivo Markdown propio — usando fallback de data.js. Pendiente: Fase B.`);
    continue;
  }

  if (!lab.hint) errors.push(`Lab ${lab.id} (${lab.source}): falta "Pista".`);
  if (!Array.isArray(lab.hints) || lab.hints.length !== 3 || lab.hints.some((hint) => !hint)) {
    errors.push(`Lab ${lab.id} (${lab.source}): se requieren tres pistas progresivas no vacías.`);
  }
  if (!lab.solution) errors.push(`Lab ${lab.id} (${lab.source}): falta "Solución".`);
  if (!lab.criteria) errors.push(`Lab ${lab.id} (${lab.source}): falta "Criterio de aprobación".`);
  if (lab.steps.length === 0) errors.push(`Lab ${lab.id} (${lab.source}): falta lista de instrucciones/tareas.`);
}

for (const challenge of content.challenges) {
  if (challenge.pending) {
    warnings.push(`Reto "${challenge.title}" sin archivo Markdown propio — usando fallback de data.js. Pendiente: Fase B.`);
    continue;
  }
  if (!challenge.objective && !challenge.statement) {
    errors.push(`Reto ${challenge.id}: falta objetivo/enunciado.`);
  }
}

if (content.glossary.length === 0) {
  errors.push('El glosario está vacío.');
}
const seenTerms = new Set();
for (const entry of content.glossary) {
  const key = entry.term.toLowerCase();
  if (seenTerms.has(key)) {
    errors.push(`Término de glosario duplicado: ${entry.term}`);
  }
  seenTerms.add(key);
  if (!entry.definition) {
    errors.push(`Término de glosario sin definición: ${entry.term}`);
  }
}
if (content.glossary.length > 0 && content.glossary.length < 15) {
  warnings.push(`Glosario con solo ${content.glossary.length} términos. El manifiesto sugiere ~24 términos clave. Pendiente: Fase B.`);
}

if (content.resources.length === 0) {
  errors.push('No hay recursos definidos.');
}
for (const resource of content.resources) {
  if (!/^https:\/\//.test(resource.url)) {
    errors.push(`Recurso "${resource.title}" no usa HTTPS o no tiene URL válida: ${resource.url}`);
  }
}

if (content.projects.length !== 6) {
  errors.push(`Se esperaban 6 proyectos acumulativos, se encontraron ${content.projects.length}.`);
}
for (const project of content.projects) {
  if (!project.vision) errors.push(`Proyecto ${project.id} (${project.source}): falta "Visión".`);
  if (!project.stack) errors.push(`Proyecto ${project.id} (${project.source}): falta "Stack".`);
  if (project.deliverables.length === 0) errors.push(`Proyecto ${project.id} (${project.source}): falta lista de "Entregables".`);
  if (project.successCriteria.length === 0) errors.push(`Proyecto ${project.id} (${project.source}): falta lista de "Criterios de éxito".`);
}
if (!content.finalProject) {
  errors.push('Falta content/projects/project-final.md (proyecto final del programa).');
} else if (!content.finalProject.vision || content.finalProject.deliverables.length === 0) {
  errors.push('El proyecto final está incompleto (falta visión o entregables).');
}

const seenCommandIds = new Set();
for (const cmd of content.terminalCommands) {
  if (seenCommandIds.has(cmd.id)) errors.push(`Comando de terminal duplicado: ${cmd.id}`);
  seenCommandIds.add(cmd.id);
  if (!cmd.whatItDoes) errors.push(`Comando ${cmd.command} (${cmd.source}): falta "Qué hace".`);
  if (!cmd.example) errors.push(`Comando ${cmd.command} (${cmd.source}): falta "Ejemplo".`);
  if (!cmd.commonError) errors.push(`Comando ${cmd.command} (${cmd.source}): falta "Error común".`);
  if (!['alto', 'medio', 'bajo'].includes(cmd.risk)) {
    errors.push(`Comando ${cmd.command} (${cmd.source}): "risk" debe ser alto/medio/bajo, es "${cmd.risk}".`);
  }
}
if (content.terminalCommands.length === 0) {
  errors.push('No hay comandos definidos en content/terminal/ (Terminal Tutor vacío).');
}

// --- Reporte ---------------------------------------------------------------

console.log('--- Resumen de contenido ---');
console.log(`Semanas: ${content.weeks.length}/24 desde Markdown`);
console.log(`Labs: ${content.meta.labsFromMarkdown}/24 desde Markdown, ${content.meta.labsPending} en fallback (Fase B)`);
console.log(`Retos: ${content.meta.challengesFromMarkdown} desde Markdown, ${content.meta.challengesPending} en fallback (Fase B)`);
console.log(`Proyectos acumulativos: ${content.meta.projectsTotal}/6, proyecto final: ${content.meta.hasFinalProject ? 'OK' : 'FALTA'}`);
console.log(`Terminal Tutor: ${content.meta.terminalCommandsTotal} comandos`);
console.log(`Glosario: ${content.glossary.length} términos`);
console.log(`Recursos: ${content.resources.length} enlaces`);

if (warnings.length > 0) {
  console.log('\n--- Avisos (no bloquean el build, son deuda conocida de Fase B) ---');
  warnings.forEach((w) => console.warn(`  ⚠ ${w}`));
}

if (errors.length > 0) {
  console.error('\n--- Errores (bloquean el build) ---');
  errors.forEach((e) => console.error(`  ✖ ${e}`));
  console.error(`\nSe encontraron ${errors.length} error(es) y ${warnings.length} aviso(s).`);
  process.exit(1);
}

console.log(`\nValidación de contenido: OK (${warnings.length} aviso(s) pendiente(s) de Fase B).`);
process.exit(0);
