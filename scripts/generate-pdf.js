'use strict';

const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { build } = require('./build-content');

const content = build();

const outputDir = path.join(__dirname, '..', 'generated');
const outputPath = path.join(outputDir, 'AI-Engineering-Lab-2026.pdf');
fs.mkdirSync(outputDir, { recursive: true });

const PAGE_MARGIN = 56;
const doc = new PDFDocument({ margin: PAGE_MARGIN, size: 'A4', bufferPages: true, autoFirstPage: false });
const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

const toc = [];
let indexPageNumber = null;

function currentPageNumber() {
  return doc.bufferedPageRange().count;
}

function newPage() {
  doc.addPage();
  return currentPageNumber();
}

function addTocEntry(label, level = 0) {
  toc.push({ label, page: currentPageNumber(), level });
}

function heading(text, size = 18) {
  doc.font('Helvetica-Bold').fontSize(size).fillColor('#111827').text(text);
  doc.moveDown(0.4);
  doc.fillColor('#1f2933');
}

function subheading(text) {
  doc.moveDown(0.3);
  doc.font('Helvetica-Bold').fontSize(12).fillColor('#374151').text(text);
  doc.moveDown(0.15);
  doc.font('Helvetica').fontSize(10).fillColor('#1f2933');
}

function paragraph(text) {
  if (!text) return;
  doc.font('Helvetica').fontSize(10).fillColor('#1f2933').text(text, { align: 'left' });
  doc.moveDown(0.3);
}

function bulletList(items) {
  if (!items || items.length === 0) return;
  doc.font('Helvetica').fontSize(10).fillColor('#1f2933');
  for (const item of items) {
    doc.text(`•  ${item}`, { indent: 10 });
  }
  doc.moveDown(0.3);
}

const FENCE_RE = /^```(\w*)\r?\n([\s\S]*?)\r?\n```$/;

function codeOrText(label, raw) {
  if (!raw) return;
  const match = raw.match(FENCE_RE);
  if (label) subheading(label);
  if (match) {
    doc.font('Courier').fontSize(9).fillColor('#0f172a');
    for (const line of match[2].split(/\r?\n/)) {
      doc.text(line);
    }
    doc.font('Helvetica').fontSize(10).fillColor('#1f2933');
    doc.moveDown(0.3);
  } else {
    paragraph(raw);
  }
}

function ensureSpace(minHeight) {
  const bottom = doc.page.height - doc.page.margins.bottom;
  if (doc.y + minHeight > bottom) {
    newPage();
  }
}

// --- Portada ---------------------------------------------------------------

newPage();
doc.font('Helvetica-Bold').fontSize(30).fillColor('#111827').text('AI Engineering Learning Lab 2026', { align: 'center' });
doc.moveDown(1);
doc
  .font('Helvetica')
  .fontSize(13)
  .fillColor('#374151')
  .text('Ruta profesional práctica para ingeniería de software, inteligencia artificial, automatización, cloud, DevOps, seguridad y arquitectura.', {
    align: 'center'
  });
doc.moveDown(2);
doc
  .font('Helvetica-Oblique')
  .fontSize(11)
  .fillColor('#4b5563')
  .text('Aprender → Construir → Probar → Romper → Diagnosticar → Corregir → Medir → Documentar → Desplegar', { align: 'center' });
doc.moveDown(4);
doc
  .font('Helvetica')
  .fontSize(9)
  .fillColor('#6b7280')
  .text(`Documento generado automáticamente desde el contenido fuente (content/) el ${new Date().toISOString().slice(0, 10)}.`, {
    align: 'center'
  });

// --- Índice (reservado, se escribe al final) --------------------------------

indexPageNumber = newPage();
doc.font('Helvetica-Bold').fontSize(18).fillColor('#111827').text('Índice');

// --- Objetivo y filosofía ----------------------------------------------------

newPage();
addTocEntry('Objetivo del programa');
heading('Objetivo del programa');
paragraph(
  'Formar a una persona capaz de entender fundamentos de ingeniería, diseñar sistemas, construir software, integrar modelos de IA, construir RAG y agentes, automatizar procesos, operar infraestructura y resolver problemas reales de negocio usando la IA como multiplicador de productividad, no como sustituto del criterio técnico.'
);

subheading('Filosofía del laboratorio');
paragraph('Aprender → Construir → Probar → Romper → Diagnosticar → Corregir → Medir → Documentar → Desplegar');

subheading('Regla de seguridad');
paragraph('Los ejercicios ofensivos de ciberseguridad se ejecutan únicamente sobre sistemas propios, contenedores locales o entornos explícitamente autorizados (CTFs). Nunca contra sistemas de terceros sin autorización.');

// --- Roadmap -----------------------------------------------------------------

newPage();
addTocEntry('Roadmap de 24 semanas');
heading('Roadmap de 24 semanas');

const levelLabels = {
  1: 'Nivel 1 · Fundamentos',
  2: 'Nivel 2 · Ingeniería de software',
  3: 'Nivel 3 · Infraestructura y automatización',
  4: 'Nivel 4 · IA aplicada',
  5: 'Nivel 5 · Producción y producto'
};

let lastLevel = null;
for (const week of content.weeks) {
  if (week.level !== lastLevel) {
    ensureSpace(40);
    subheading(levelLabels[week.level] || `Nivel ${week.level}`);
    lastLevel = week.level;
  }
  ensureSpace(20);
  doc.font('Helvetica').fontSize(10).fillColor('#1f2933').text(`Semana ${week.id} — ${week.title.replace(/^Semana \d+\s*[·:]?\s*/, '')}  (+${week.xp} XP)`);
}

// --- Semanas completas ---------------------------------------------------

for (const week of content.weeks) {
  newPage();
  addTocEntry(`Semana ${week.id}: ${week.title}`, 1);
  heading(`Semana ${week.id} — ${week.title}`, 16);

  subheading('Objetivo');
  paragraph(week.objective);

  subheading('Por qué importa');
  paragraph(week.whyItMatters);

  subheading('Conceptos clave');
  bulletList(week.concepts);

  if (week.architecture) codeOrText('Arquitectura', week.architecture);
  if (week.example) codeOrText('Ejemplo', week.example);

  subheading('Laboratorio de la semana');
  paragraph(week.labSummary);

  if (week.preparation.length) {
    subheading('Preparación');
    bulletList(week.preparation);
  }

  if (week.steps.length) {
    subheading('Pasos');
    week.steps.forEach((step, i) => paragraph(`${i + 1}. ${step}`));
  }

  if (week.verification) codeOrText('Verificación', week.verification);

  if (week.commonErrors.length) {
    subheading('Errores comunes');
    bulletList(week.commonErrors);
  }

  if (week.debugging) {
    subheading('Debugging');
    paragraph(week.debugging);
  }

  subheading('Reto');
  paragraph(week.challenge);

  if (week.advancedChallenge) {
    subheading('Reto avanzado');
    paragraph(week.advancedChallenge);
  }

  subheading('BREAK THE SYSTEM');
  paragraph(week.breakSystem);

  subheading('RECOVERY');
  paragraph(week.recovery);

  if (week.evaluation.length) {
    subheading('Evaluación');
    bulletList(week.evaluation);
  }

  subheading('Evidencia a guardar');
  paragraph(week.evidence);

  subheading('Criterio de aprobación');
  paragraph(week.approvalCriteria);
}

// --- Laboratorios ----------------------------------------------------------

newPage();
addTocEntry('Laboratorios');
heading('Laboratorios');
paragraph('Los 24 laboratorios del programa proceden de archivos Markdown en content/labs/. Cada laboratorio incluye objetivo, instrucciones, tres pistas progresivas y criterios de aprobación.');

for (const lab of content.labs) {
  ensureSpace(90);
  subheading(`Semana ${lab.week} — ${lab.title}${lab.pending ? '  [PENDIENTE: Fase B]' : ''}`);
  paragraph(lab.description);
  if (lab.steps.length) bulletList(lab.steps);
  for (const [index, hint] of (lab.hints || []).entries()) {
    paragraph(`Pista ${index + 1} (${[90, 75, 60][index]}% del XP): ${hint}`);
  }
  if (lab.criteria) paragraph(`Criterio de aprobación: ${lab.criteria}`);
  if (lab.penalty) paragraph(`Nota de evaluación (informativa): ${lab.penalty}`);
}

// --- Retos -------------------------------------------------------------------

newPage();
addTocEntry('Retos');
heading('Retos');
for (const challenge of content.challenges) {
  ensureSpace(60);
  subheading(`${challenge.title}${challenge.pending ? '  [PENDIENTE: Fase B]' : ''}`);
  if (challenge.statement) paragraph(challenge.statement);
  if (challenge.objective) paragraph(`Objetivo: ${challenge.objective}`);
  paragraph(`XP: +${challenge.xp}  ·  Nivel: ${challenge.level || 'N/D'}`);
  if (challenge.scoring) paragraph(`Puntuación: ${challenge.scoring}`);
  if (challenge.penalty) paragraph(`Penalización: ${challenge.penalty}`);
}

// --- Terminal Tutor ------------------------------------------------------

newPage();
addTocEntry('Terminal Tutor');
heading('Terminal Tutor');
paragraph('Comandos reales explicados: qué hacen, cuándo usarlos, sus riesgos y cómo recuperarte si algo sale mal.');

for (const cmd of content.terminalCommands) {
  ensureSpace(110);
  subheading(`${cmd.command}  [${cmd.category} · riesgo ${cmd.risk}]`);
  paragraph(cmd.whatItDoes);
  paragraph(`Cuándo usarlo: ${cmd.whenToUse}`);
  paragraph(`Riesgos: ${cmd.risks}`);
  if (cmd.example) codeOrText('Ejemplo', cmd.example);
  paragraph(`Ejercicio: ${cmd.exercise}`);
  paragraph(`Error común: ${cmd.commonError}`);
  paragraph(`Recovery: ${cmd.recovery}`);
}

// --- Glosario ----------------------------------------------------------------

newPage();
addTocEntry('Glosario');
heading('Glosario');
for (const entry of content.glossary) {
  ensureSpace(40);
  subheading(entry.term);
  paragraph(entry.definition);
}

// --- Recursos ------------------------------------------------------------

newPage();
addTocEntry('Biblioteca de recursos');
heading('Biblioteca de recursos');
const byCategory = {};
for (const r of content.resources) {
  byCategory[r.category] = byCategory[r.category] || [];
  byCategory[r.category].push(r);
}
for (const [category, items] of Object.entries(byCategory)) {
  ensureSpace(30);
  subheading(category);
  bulletList(items.map((r) => `${r.title}: ${r.url}`));
}

// --- Checklist de avance -----------------------------------------------------

newPage();
addTocEntry('Checklist de avance por semana');
heading('Checklist de avance por semana');
paragraph('Marca cada semana cuando se cumpla su criterio de aprobación real, no solo cuando el contenido se haya leído.');
for (const week of content.weeks) {
  ensureSpace(20);
  doc.font('Helvetica').fontSize(10).fillColor('#1f2933').text(`☐ Semana ${week.id} — ${week.approvalCriteria}`);
}

// --- Proyectos acumulativos --------------------------------------------------

newPage();
addTocEntry('Proyectos del programa');
heading('Proyectos del programa');
paragraph('Seis proyectos acumulativos, cada uno construido sobre el anterior, que convergen en el proyecto final.');

for (const project of content.projects) {
  ensureSpace(120);
  subheading(`${project.title} (semanas ${project.weekStart}-${project.weekEnd}, +${project.xp} XP)`);
  paragraph(project.vision);
  if (project.stack) paragraph(`Stack: ${project.stack}`);
  if (project.deliverables.length) {
    subheading('Entregables');
    bulletList(project.deliverables);
  }
  if (project.successCriteria.length) {
    subheading('Criterios de éxito');
    bulletList(project.successCriteria);
  }
}

if (content.finalProject) {
  const fp = content.finalProject;
  newPage();
  addTocEntry('Proyecto final', 1);
  heading(fp.title, 16);
  paragraph(fp.vision);
  subheading('Stack');
  paragraph(fp.stack);
  subheading('Entregables');
  bulletList(fp.deliverables);
  subheading('Criterios de éxito');
  bulletList(fp.successCriteria);
  if (fp.relation) {
    subheading('Relación con el resto del laboratorio');
    paragraph(fp.relation);
  }
}

// --- Índice (relleno final) --------------------------------------------------

doc.switchToPage(indexPageNumber - 1);
doc.font('Helvetica-Bold').fontSize(18).fillColor('#111827').text('Índice', PAGE_MARGIN, PAGE_MARGIN);
doc.moveDown(0.6);
let y = doc.y;
for (const entry of toc) {
  const indent = entry.level ? 14 : 0;
  doc
    .font(entry.level ? 'Helvetica' : 'Helvetica-Bold')
    .fontSize(entry.level ? 9 : 11)
    .fillColor('#1f2933')
    .text(entry.label, PAGE_MARGIN + indent, y, { continued: false, width: 380 });
  doc.text(String(entry.page), PAGE_MARGIN + 430, y);
  y += entry.level ? 13 : 16;
}

// --- Numeración de páginas ----------------------------------------------------

const range = doc.bufferedPageRange();
for (let i = range.start; i < range.start + range.count; i++) {
  doc.switchToPage(i);
  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor('#9ca3af')
    .text(`AI Engineering Learning Lab 2026 — Página ${i + 1} de ${range.count}`, PAGE_MARGIN, doc.page.height - 36, {
      width: doc.page.width - PAGE_MARGIN * 2,
      align: 'center'
    });
}

doc.end();

stream.on('finish', () => {
  console.log(`PDF generado en: ${outputPath} (${range.count} páginas)`);
});
