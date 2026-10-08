import generatedContent from '../../generated/content.json';

// El contenido real (semanas, labs, retos, glosario, recursos) vive en content/**/*.md.
// generated/content.json se reconstruye con `npm run content:build` a partir de ese Markdown
// (ver scripts/build-content.js). No dupliques aquí lo que ya existe como Markdown: evita que
// el sitio y el PDF se desincronicen, que fue el problema que tenía esta versión antes de reconectarse.

const labTitleByWeek = new Map(generatedContent.labs.map((lab) => [lab.week, lab.title]));

export const roadmap = generatedContent.weeks.map((week) => ({
  id: week.id,
  title: week.title,
  level: week.level,
  xp: week.xp,
  lab: labTitleByWeek.get(week.id) || week.labSummary
}));

export const labs = generatedContent.labs.map((lab) => ({
  id: lab.id,
  title: lab.title,
  week: lab.week,
  type: lab.type,
  xp: lab.xp,
  description: lab.description,
  pending: lab.pending
}));

export const projectMilestones = [
  {
    id: 'milestone-01',
    title: 'Base profesional',
    description: 'Preparar repo, README, entorno y evidencia de trabajo en equipo.',
    week: 1,
    xp: 120
  },
  {
    id: 'milestone-02',
    title: 'Sistema funcional',
    description: 'Construir una aplicación con dominio claro, flujo de datos y pruebas.',
    week: 6,
    xp: 150
  },
  {
    id: 'milestone-03',
    title: 'Infraestructura real',
    description: 'Docker, CI/CD, despliegue y operaciones básicas con control de riesgos.',
    week: 12,
    xp: 180
  },
  {
    id: 'milestone-04',
    title: 'IA aplicada y evaluada',
    description: 'Implementar prompts, RAG, evaluación y métricas de calidad.',
    week: 18,
    xp: 200
  },
  {
    id: 'milestone-05',
    title: 'Proyecto final listo',
    description: 'Diseñar, construir y presentar una solución con valor y evidencia.',
    week: 24,
    xp: 250
  }
];

export const projectDeliverables = [
  {
    id: 'deliverable-architecture',
    title: 'Arquitectura y alcance',
    description: 'Documenta propósitos, stakeholders, módulo principal y restricciones.',
    xp: 75,
    week: 22
  },
  {
    id: 'deliverable-demo',
    title: 'Demo funcional',
    description: 'Muestra una versión ejecutable con flujo principal validado.',
    xp: 90,
    week: 23
  },
  {
    id: 'deliverable-evidence',
    title: 'Evidencia de aprendizaje',
    description: 'Guarda commit, notas, métricas, decisiones y resultados clave.',
    xp: 60,
    week: 23
  },
  {
    id: 'deliverable-pitch',
    title: 'Pitch y cierre',
    description: 'Presenta problema, solución, impacto, riesgos y próximos pasos.',
    xp: 80,
    week: 24
  }
];

export const finalEvidence = [
  {
    id: 'evidence-readme',
    title: 'README de proyecto',
    description: 'Explica objetivo, cómo arrancar, tecnologías, arquitectura y cómo probar la solución.',
    type: 'documento',
    week: 22,
    xp: 40
  },
  {
    id: 'evidence-demo-checklist',
    title: 'Checklist de demo',
    description: 'Verifica flujo principal, carga de datos, estado de error, métricas básicas y experiencia final.',
    type: 'validación',
    week: 23,
    xp: 50
  },
  {
    id: 'evidence-risks',
    title: 'Riesgos y mitigación',
    description: 'Documenta principales riesgos técnicos, dependencias críticas y estrategia de mitigación.',
    type: 'riesgo',
    week: 23,
    xp: 35
  },
  {
    id: 'evidence-pitch',
    title: 'Pitch y cierre',
    description: 'Resume problema, solución, impacto, evidencia y próxima iteración del producto.',
    type: 'presentación',
    week: 24,
    xp: 45
  }
];

export const projectStatus = {
  title: 'Proyecto final: AI Engineering Lab',
  summary: 'Solución educativa y práctica para aprender ingeniería de IA con objetivos, evidencia, validación y presentación clara.',
  focus: 'Disminuir fricción del aprendizaje, hacer visible el progreso y convertir el curriculum en un sistema ejecutable.',
  risks: [
    'Complejidad técnica sin estrategia de priorización',
    'Pérdida de claridad en la evidencia del aprendizaje',
    'Falta de trazabilidad entre semanas, laboratorios y producto final'
  ],
  nextSteps: [
    'Publicar una vista de demo final con resumen ejecutivo',
    'Evidenciar antes/después del producto',
    'Preparar pitch para stakeholders y cierre del lab'
  ]
};

export const challenges = generatedContent.challenges.map((challenge) => ({
  title: challenge.title,
  xp: challenge.xp,
  level: challenge.level,
  pending: challenge.pending
}));

export const resources = generatedContent.resources.map((resource) => ({
  title: resource.title,
  url: resource.url,
  category: resource.category
}));

export const glossary = generatedContent.glossary.map((entry) => ({
  term: entry.term,
  definition: entry.definition
}));

export const weekDetails = generatedContent.weeks.map((week) => ({
  id: week.id,
  title: week.title,
  objective: week.objective,
  concepts: week.concepts,
  challenge: week.challenge,
  breakSystem: week.breakSystem,
  recovery: week.recovery,
  evidence: week.evidence
}));

export const labDetails = generatedContent.labs.map((lab) => ({
  id: lab.id,
  objective: lab.description,
  steps: lab.steps,
  hint: lab.hint,
  hints: lab.hints,
  solution: lab.solution,
  penalty: lab.penalty,
  criteria: lab.criteria,
  pending: lab.pending
}));

export const programProjects = generatedContent.projects.map((project) => ({
  id: project.id,
  title: project.title,
  weekStart: project.weekStart,
  weekEnd: project.weekEnd,
  xp: project.xp,
  vision: project.vision,
  stack: project.stack,
  deliverables: project.deliverables,
  successCriteria: project.successCriteria
}));

export const finalProject = generatedContent.finalProject
  ? {
      id: generatedContent.finalProject.id,
      title: generatedContent.finalProject.title,
      weekStart: generatedContent.finalProject.weekStart,
      weekEnd: generatedContent.finalProject.weekEnd,
      xp: generatedContent.finalProject.xp,
      vision: generatedContent.finalProject.vision,
      stack: generatedContent.finalProject.stack,
      deliverables: generatedContent.finalProject.deliverables,
      successCriteria: generatedContent.finalProject.successCriteria
    }
  : null;

export const terminalCommands = generatedContent.terminalCommands.map((cmd) => ({
  id: cmd.id,
  command: cmd.command,
  category: cmd.category,
  risk: cmd.risk,
  whatItDoes: cmd.whatItDoes,
  whenToUse: cmd.whenToUse,
  risks: cmd.risks,
  example: cmd.example,
  exercise: cmd.exercise,
  commonError: cmd.commonError,
  recovery: cmd.recovery
}));
