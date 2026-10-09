export const STORAGE_KEY = 'ai-lab-progress-v1';
export const LAB_HELP_XP_PERCENTAGES = Object.freeze([100, 90, 75, 60, 40]);
export const PROJECT_STATUSES = Object.freeze(['not-started', 'in-progress', 'completed']);

export const defaultProgress = {
  xp: 0,
  level: 0,
  notes: '',
  completedWeeks: [],
  completedLabs: [],
  completedObjectives: [],
  labHelpLevels: {},
  projectStatuses: {},
  completedCareerItems: [],
  gradingAttempts: {}
};

export function calculateLevel(xp) {
  if (xp >= 1000) return 'Profesional';
  if (xp >= 700) return 'Avanzado';
  if (xp >= 500) return 'Competente';
  if (xp >= 300) return 'Básico';
  return '0';
}

export function toggleWeek(progress, week) {
  const completed = progress.completedWeeks.includes(week.id);
  const completedWeeks = completed
    ? progress.completedWeeks.filter((id) => id !== week.id)
    : [...progress.completedWeeks, week.id];
  const xp = completed ? Math.max(0, progress.xp - week.xp) : progress.xp + week.xp;
  return { ...progress, completedWeeks, xp };
}

export function toggleLab(progress, lab) {
  const completed = progress.completedLabs.includes(lab.id);
  const completedLabs = completed
    ? progress.completedLabs.filter((id) => id !== lab.id)
    : [...progress.completedLabs, lab.id];
  const xpReward = calculateLabXp(lab, getLabHelpLevel(progress, lab.id));
  const xp = completed ? Math.max(0, progress.xp - xpReward) : progress.xp + xpReward;
  return { ...progress, completedLabs, xp };
}

export function getLabHelpLevel(progress, labId) {
  return progress.labHelpLevels?.[labId] ?? 0;
}

export function calculateLabXp(lab, helpLevel = 0) {
  if (!Number.isInteger(helpLevel) || helpLevel < 0 || helpLevel >= LAB_HELP_XP_PERCENTAGES.length) {
    throw new RangeError(`Nivel de ayuda inválido: ${helpLevel}`);
  }

  return Math.round((lab.xp * LAB_HELP_XP_PERCENTAGES[helpLevel]) / 100);
}

export function recordLabHelp(progress, lab, helpLevel) {
  if (!Number.isInteger(helpLevel) || helpLevel < 1 || helpLevel >= LAB_HELP_XP_PERCENTAGES.length) {
    throw new RangeError(`Nivel de ayuda inválido: ${helpLevel}`);
  }

  const currentLevel = getLabHelpLevel(progress, lab.id);
  if (helpLevel <= currentLevel) return progress;
  if (helpLevel !== currentLevel + 1) {
    throw new RangeError(`La ayuda debe revelarse en orden: siguiente nivel ${currentLevel + 1}`);
  }

  const labHelpLevels = { ...progress.labHelpLevels, [lab.id]: helpLevel };
  const completed = progress.completedLabs.includes(lab.id);
  const xp = completed
    ? Math.max(0, progress.xp + calculateLabXp(lab, helpLevel) - calculateLabXp(lab, currentLevel))
    : progress.xp;

  return { ...progress, labHelpLevels, xp };
}

export function toggleObjective(progress, objectiveId) {
  const completed = progress.completedObjectives.includes(objectiveId);
  const completedObjectives = completed
    ? progress.completedObjectives.filter((id) => id !== objectiveId)
    : [...progress.completedObjectives, objectiveId];
  return { ...progress, completedObjectives };
}

export function setProjectStatus(progress, projectId, status) {
  if (typeof projectId !== 'string' || projectId.length === 0) {
    throw new TypeError('El identificador del proyecto es obligatorio.');
  }
  if (!PROJECT_STATUSES.includes(status)) {
    throw new RangeError(`Estado de proyecto inválido: ${status}`);
  }

  return {
    ...progress,
    projectStatuses: { ...progress.projectStatuses, [projectId]: status }
  };
}

export function recordGradingAttempt(progress, { labId, language, results, summary }) {
  if (typeof labId !== 'string' || labId.length === 0) {
    throw new TypeError('El identificador del laboratorio es obligatorio.');
  }
  if (typeof language !== 'string' || language.length === 0) {
    throw new TypeError('El lenguaje del ejercicio calificado es obligatorio.');
  }

  const key = `${labId}:${language}`;
  const previous = progress.gradingAttempts?.[key];
  const attempt = {
    labId,
    language,
    attempts: (previous?.attempts ?? 0) + 1,
    lastAttemptAt: new Date().toISOString(),
    passed: summary.passed,
    total: summary.total,
    resolved: summary.total > 0 && summary.passed === summary.total,
    failingChecks: (results || []).filter((r) => !r.pass).map((r) => r.name)
  };

  return {
    ...progress,
    gradingAttempts: { ...progress.gradingAttempts, [key]: attempt }
  };
}

export function getWeakAreas(progress) {
  const attempts = Object.values(progress.gradingAttempts || {});
  return attempts
    .filter((attempt) => !attempt.resolved)
    .sort((a, b) => new Date(a.lastAttemptAt) - new Date(b.lastAttemptAt));
}

export function getMasteredExercises(progress) {
  const attempts = Object.values(progress.gradingAttempts || {});
  return attempts.filter((attempt) => attempt.resolved);
}

export function toggleCareerItem(progress, itemId) {
  if (typeof itemId !== 'string' || itemId.length === 0) {
    throw new TypeError('El identificador del checklist es obligatorio.');
  }
  const completed = progress.completedCareerItems.includes(itemId);
  const completedCareerItems = completed
    ? progress.completedCareerItems.filter((id) => id !== itemId)
    : [...progress.completedCareerItems, itemId];
  return { ...progress, completedCareerItems };
}
