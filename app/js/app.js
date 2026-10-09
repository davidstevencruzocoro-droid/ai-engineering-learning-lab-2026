import { roadmap, labs, projectMilestones, projectDeliverables, finalEvidence, projectStatus, challenges, resources, glossary, weekDetails, labDetails, programProjects, finalProject, terminalCommands } from './data.js';
import { STORAGE_KEY, defaultProgress, PROJECT_STATUSES, calculateLevel, calculateLabXp, getLabHelpLevel, LAB_HELP_XP_PERCENTAGES, recordLabHelp, recordGradingAttempt, getWeakAreas, getMasteredExercises, setProjectStatus, toggleCareerItem, toggleWeek, toggleLab, toggleObjective } from './progress.js';

const careerChecklist = [
  { id: 'career-project', label: 'Tengo 2-3 proyectos con demo o instrucciones reproducibles.' },
  { id: 'career-readme', label: 'Cada proyecto explica problema, stack, arquitectura y cómo ejecutarlo.' },
  { id: 'career-tests', label: 'Puedo mostrar pruebas y explicar al menos un caso de fallo.' },
  { id: 'career-security', label: 'He revisado secretos, permisos, dependencias y riesgos conocidos.' },
  { id: 'career-evidence', label: 'Puedo compartir evidencia verificable: repositorio, demo, métricas o capturas.' },
  { id: 'career-resume', label: 'Mi CV y perfil profesional enlazan resultados concretos, no solo tecnologías.' },
  { id: 'career-interview', label: 'Practiqué explicar una decisión técnica, un error y cómo lo resolví.' },
  { id: 'career-next-step', label: 'Tengo claro el siguiente paso de aprendizaje o búsqueda laboral.' }
];

const mentorPrompts = [
  { title: 'Profesor', prompt: 'Explícame este concepto en pasos breves. Primero pregúntame qué entiendo y después corrige mis lagunas con un ejemplo pequeño.' },
  { title: 'Reviewer', prompt: 'Revisa este cambio priorizando bugs, seguridad y mantenibilidad. No reescribas el código: señala el riesgo, evidencia y una prueba para reproducirlo.' },
  { title: 'Debugger', prompt: 'Ayúdame a depurar sin dar la solución de inmediato. Haz una pregunta cada vez y propón la siguiente observación o experimento.' },
  { title: 'Arquitecto', prompt: 'Ayúdame a comparar dos diseños para este problema. Expón trade-offs, supuestos, riesgos operativos y qué evidencia decidiría entre ellos.' },
  { title: 'Pair programmer', prompt: 'Trabaja conmigo en cambios pequeños. Antes de proponer código, confirma el objetivo y los criterios de aceptación; después sugiere una prueba.' },
  { title: 'Entrevistador', prompt: 'Hazme una pregunta técnica de una en una. Espera mi respuesta, evalúa razonamiento y comunicación, y luego dame una pregunta de seguimiento.' },
  { title: 'Desafío defensivo', prompt: 'Busca cómo podría fallar este sistema desde una perspectiva defensiva y autorizada. Prioriza impacto, reproducción segura y mitigación; no ejecutes acciones externas.' },
  { title: 'Evaluador', prompt: 'Evalúa este entregable contra estos criterios explícitos. Separa evidencia observada de inferencias y señala qué falta para verificarlo.' }
];

const interviewQuestions = [
  '¿Qué problema resuelve tu proyecto y quién lo necesita?',
  'Dibuja el recorrido de una solicitud y explica por qué separaste sus componentes.',
  '¿Qué decisión técnica cambiarías con más tiempo y qué trade-off aceptaste?',
  'Describe un fallo que probaste, cómo lo detectaste y cómo evitaste su repetición.',
  '¿Cómo proteges credenciales, datos y herramientas externas?',
  '¿Qué métrica usarías para saber si la solución funciona en producción?'
];

const runnerStarters = {
  javascript: 'console.log("Hola desde el sandbox de JavaScript");',
  python: 'print("Hola desde el sandbox de Python")',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hola desde el sandbox de Java");\n    }\n}',
  sql: 'CREATE TABLE resultados (id INTEGER PRIMARY KEY, valor TEXT);\nINSERT INTO resultados (valor) VALUES ("sandbox SQL");\nSELECT * FROM resultados;'
};

const mentorHistory = [];

const getProgress = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { ...defaultProgress };

  try {
    const saved = JSON.parse(raw);
    const savedHelpLevels = saved?.labHelpLevels;
    const savedProjectStatuses = saved?.projectStatuses;
    const labHelpLevels = {};
    const projectStatuses = {};
    if (savedHelpLevels !== undefined) {
      if (!savedHelpLevels || typeof savedHelpLevels !== 'object' || Array.isArray(savedHelpLevels)) {
        console.warn('Se ignoró el registro local de niveles de ayuda porque no tiene un formato válido.');
      } else {
        for (const [labId, level] of Object.entries(savedHelpLevels)) {
          if (Number.isInteger(level) && level >= 1 && level <= 4) {
            labHelpLevels[labId] = level;
          } else {
            console.warn(`Se ignoró el nivel de ayuda local no válido para ${labId}.`);
          }
        }
      }
    }
    if (savedProjectStatuses !== undefined) {
      if (!savedProjectStatuses || typeof savedProjectStatuses !== 'object' || Array.isArray(savedProjectStatuses)) {
        console.warn('Se ignoraron los estados locales de proyectos porque no tienen un formato válido.');
      } else {
        for (const [projectId, status] of Object.entries(savedProjectStatuses)) {
          if (PROJECT_STATUSES.includes(status)) {
            projectStatuses[projectId] = status;
          } else {
            console.warn(`Se ignoró el estado local no válido para ${projectId}.`);
          }
        }
      }
    }
    const savedGradingAttempts = saved?.gradingAttempts;
    const gradingAttempts = {};
    if (savedGradingAttempts !== undefined) {
      if (!savedGradingAttempts || typeof savedGradingAttempts !== 'object' || Array.isArray(savedGradingAttempts)) {
        console.warn('Se ignoró el registro local de calificación porque no tiene un formato válido.');
      } else {
        for (const [key, attempt] of Object.entries(savedGradingAttempts)) {
          const valid = attempt
            && typeof attempt === 'object'
            && typeof attempt.labId === 'string'
            && typeof attempt.language === 'string'
            && Number.isInteger(attempt.attempts)
            && typeof attempt.resolved === 'boolean'
            && Array.isArray(attempt.failingChecks);
          if (valid) {
            gradingAttempts[key] = {
              ...attempt,
              failingChecks: attempt.failingChecks.filter((name) => typeof name === 'string')
            };
          } else {
            console.warn(`Se ignoró el intento de calificación local no válido para ${key}.`);
          }
        }
      }
    }

    return {
      ...defaultProgress,
      ...saved,
      labHelpLevels,
      projectStatuses,
      gradingAttempts,
      completedCareerItems: Array.isArray(saved?.completedCareerItems)
        ? [...new Set(saved.completedCareerItems.filter((item) => typeof item === 'string'))]
        : []
    };
  } catch (error) {
    return { ...defaultProgress };
  }
};

const saveProgress = (progress) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

const getDefaultWeekId = () => roadmap[0]?.id ?? 1;

const ensureCurrentWeekId = () => {
  const current = Number(window.currentWeekId);
  const validWeek = roadmap.some((week) => week.id === current);

  if (!validWeek) {
    window.currentWeekId = getDefaultWeekId();
  }
};

const renderStats = (progress) => {
  const xpValue = document.querySelector('#xpValue');
  const levelValue = document.querySelector('#levelValue');
  const weeksCompleted = document.querySelector('#weeksCompleted');
  const labsCompleted = document.querySelector('#labsCompleted');

  xpValue.textContent = String(progress.xp);
  levelValue.textContent = calculateLevel(progress.xp);
  weeksCompleted.textContent = `${progress.completedWeeks.length}/24`;
  labsCompleted.textContent = String(progress.completedLabs.length);
};

const renderStudySummary = (progress) => {
  const container = document.querySelector('#studySummary');
  if (!container) return;

  const nextWeek = roadmap.find((week) => !progress.completedWeeks.includes(week.id)) || roadmap[roadmap.length - 1];
  const nextLab = labs.find((lab) => !progress.completedLabs.includes(lab.id)) || labs[labs.length - 1];
  const currentLevel = calculateLevel(progress.xp);
  const completedCount = progress.completedWeeks.length + progress.completedLabs.length;
  const completionPercent = Math.min(100, Math.round((completedCount / 48) * 100));
  const focusLabel = nextLab ? `${nextLab.title}` : `Cierre del proyecto`;

  container.innerHTML = `
    <div class="study-summary-card metric-glow">
      <small>Estado</small>
      <strong>${currentLevel}</strong>
    </div>
    <div class="study-summary-card">
      <small>Próxima semana</small>
      <strong>S${nextWeek.id}</strong>
    </div>
    <div class="study-summary-card">
      <small>Avance</small>
      <strong>${completionPercent}%</strong>
    </div>
    <div class="study-summary-card">
      <small>Foco recomendado</small>
      <strong>${focusLabel}</strong>
    </div>
  `;
};

const renderStudyMode = (progress) => {
  const container = document.querySelector('#studyModeList');
  if (!container) return;

  const nextWeek = roadmap.find((week) => !progress.completedWeeks.includes(week.id)) || roadmap[roadmap.length - 1];
  const activeLab = labs.find((lab) => !progress.completedLabs.includes(lab.id)) || labs[labs.length - 1];

  const modes = [
    {
      title: 'Foco de hoy',
      items: [`Revisa ${nextWeek.title}`, 'Comienza con un objetivo claro', 'Documenta una decisión técnica'],
      action: 'Abrir semana actual'
    },
    {
      title: 'Modo lab',
      items: [`Trabaja sobre ${activeLab.title}`, 'Lee el objetivo y la pista', 'Implementa la solución y valida el riesgo'],
      action: 'Ver laboratorio activo'
    },
    {
      title: 'Cierre de semana',
      items: ['Revisa qué aprendiste', 'Escribe tus dudas', 'Guarda evidencia para el portafolio'],
      action: 'Preparar evidencia'
    }
  ];

  container.innerHTML = modes
    .map((mode, index) => `
      <article class="study-mode-card">
        <h3>${mode.title}</h3>
        <ul>
          ${mode.items.map((item) => `<li>${item}</li>`).join('')}
        </ul>
        <button class="secondary-btn" type="button" data-study-mode="${index}">${mode.action}</button>
      </article>
    `)
    .join('');

  container.querySelectorAll('[data-study-mode]').forEach((button) => {
    const modeIndex = Number(button.dataset.studyMode);
    button.addEventListener('click', () => {
      if (modeIndex === 0) {
        openWeekDetail(nextWeek.id);
      }
      if (modeIndex === 1) {
        openLabDetail(activeLab.id);
      }
      if (modeIndex === 2) {
        const notesArea = document.querySelector('#notesArea');
        notesArea?.focus();
      }
    });
  });
};

const renderLearningObjectives = (progress) => {
  const container = document.querySelector('#learningObjectives');
  if (!container) return;

  const activeWeek = roadmap.find((week) => week.id === Number(window.currentWeekId || roadmap[0].id)) || roadmap[0];
  const activeLab = labs.find((lab) => lab.week === activeWeek.id) || labs[0];
  const objectiveItems = [
    { id: `${activeWeek.id}-goal-1`, label: `Revisar objetivo de ${activeWeek.title}` },
    { id: `${activeWeek.id}-goal-2`, label: `Repasar los conceptos clave de ${activeWeek.title}` },
    { id: `${activeWeek.id}-goal-3`, label: `Completar el reto o caso práctico de ${activeLab.title}` },
    { id: `${activeWeek.id}-goal-4`, label: 'Guardar evidencia y notas del aprendizaje' }
  ];

  const checkedCount = objectiveItems.filter((item) => progress.completedObjectives.includes(item.id)).length;

  container.innerHTML = `
    <article class="objective-card">
      <h3>${activeWeek.title}</h3>
      <ul class="objective-list">
        ${objectiveItems
          .map((item) => {
            const checked = progress.completedObjectives.includes(item.id);
            return `
              <li class="objective-item ${checked ? 'done' : ''}">
                <input type="checkbox" data-objective-id="${item.id}" ${checked ? 'checked' : ''} />
                <span>${item.label}</span>
              </li>
            `;
          })
          .join('')}
      </ul>
      <small>${checkedCount}/${objectiveItems.length} objetivos completados</small>
    </article>
  `;

  container.querySelectorAll('[data-objective-id]').forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      const objectiveId = event.target.dataset.objectiveId;
      const nextProgress = toggleObjective(getProgress(), objectiveId);
      saveProgress(nextProgress);
      renderAll();
    });
  });
};

const renderProgramProjects = (progress) => {
  const container = document.querySelector('#programProjectsList');
  if (!container) return;

  const completedSet = new Set(progress.completedWeeks);
  const weekRangeDone = (weekStart, weekEnd) => {
    for (let w = weekStart; w <= weekEnd; w++) {
      if (!completedSet.has(w)) return false;
    }
    return true;
  };

  const renderCard = (project, isFinal = false) => {
    const done = weekRangeDone(project.weekStart, project.weekEnd);
    const status = progress.projectStatuses?.[project.id] || PROJECT_STATUSES[0];
    const statusLabel = {
      'not-started': 'Sin iniciar',
      'in-progress': 'En progreso',
      completed: 'Completado'
    }[status];
    return `
      <article class="milestone-card project-card ${done ? 'done' : ''} ${isFinal ? 'accent' : ''}" data-project-id="${project.id}">
        <div class="milestone-header">
          <span class="milestone-badge">Semanas ${project.weekStart}-${project.weekEnd}</span>
          <span class="milestone-xp">+${project.xp} XP</span>
        </div>
        <h3>${project.title}</h3>
        <p>${project.vision}</p>
        <small class="project-week-status">${done ? 'Semanas del proyecto completadas' : 'Semanas del proyecto pendientes'}</small>
        <span class="project-status-label">${statusLabel}</span>
        <small><strong>Stack:</strong> ${project.stack}</small>
        <label class="project-status-control">
          <span>Seguimiento personal</span>
          <select data-project-status="${project.id}" aria-label="Estado de ${project.title}">
            <option value="not-started" ${status === 'not-started' ? 'selected' : ''}>Sin iniciar</option>
            <option value="in-progress" ${status === 'in-progress' ? 'selected' : ''}>En progreso</option>
            <option value="completed" ${status === 'completed' ? 'selected' : ''}>Completado</option>
          </select>
        </label>
        <details class="project-deliverables">
          <summary>Ver entregables y criterios</summary>
          <strong>Entregables</strong>
          <ul>${project.deliverables.map((item) => `<li>${item}</li>`).join('')}</ul>
          <strong>Criterios de éxito</strong>
          <ul>${project.successCriteria.map((item) => `<li>${item}</li>`).join('')}</ul>
        </details>
      </article>
    `;
  };

  const cards = programProjects.map((p) => renderCard(p));
  if (finalProject) cards.push(renderCard(finalProject, true));

  container.innerHTML = cards.join('');
  container.querySelectorAll('[data-project-status]').forEach((select) => {
    select.addEventListener('change', () => {
      const nextProgress = setProjectStatus(getProgress(), select.dataset.projectStatus, select.value);
      saveProgress(nextProgress);
      renderProgramProjects(nextProgress);
      container.querySelector(`[data-project-status="${select.dataset.projectStatus}"]`)?.focus();
    });
  });
};

const renderLearningModes = (progress) => {
  const container = document.querySelector('#learningModes');
  if (!container) return;

  container.innerHTML = `
    <article class="learning-mode-card">
      <h3>Modo sin IA</h3>
      <p>Practica el razonamiento y la depuración sin delegar la solución.</p>
      <ol>
        <li>Define el resultado esperado y escribe una prueba antes del código.</li>
        <li>Consulta documentación oficial y trabaja en bloques de 20 minutos.</li>
        <li>Registra hipótesis, errores y evidencia en tus notas.</li>
        <li>Solo al terminar, compara tu solución con una revisión asistida.</li>
      </ol>
      <a class="secondary-btn" href="#labs">Elegir un laboratorio sin abrir pistas</a>
    </article>
    <article class="learning-mode-card">
      <h3>AI as Mentor</h3>
      <p>Elige un rol y aporta tu código o contexto. La IA orienta; tú verificas cada afirmación.</p>
      <div class="mentor-prompt-list">
        ${mentorPrompts.map((item) => `
          <details>
            <summary>${item.title}</summary>
            <p>${item.prompt}</p>
          </details>
        `).join('')}
      </div>
      <small>No pegues secretos ni datos personales. Contrasta el resultado con pruebas y fuentes oficiales.</small>
    </article>
    <article class="learning-mode-card">
      <h3>Modo entrevista</h3>
      <p>Responde en voz alta con contexto, decisión, trade-off y evidencia. Practica sin leer una respuesta memorizada.</p>
      <ol>${interviewQuestions.map((question) => `<li>${question}</li>`).join('')}</ol>
      <p><strong>Autoevaluación:</strong> ¿fui claro?, ¿di evidencia?, ¿reconocí límites y alternativas?</p>
    </article>
    <article class="learning-mode-card">
      <h3>Checklist de empleo</h3>
      <ul class="career-checklist">
        ${careerChecklist.map((item) => {
          const checked = progress.completedCareerItems.includes(item.id);
          return `<li class="${checked ? 'done' : ''}">
            <label><input type="checkbox" data-career-item="${item.id}" ${checked ? 'checked' : ''} /><span>${item.label}</span></label>
          </li>`;
        }).join('')}
      </ul>
      <small class="career-checklist-summary" aria-live="polite">${progress.completedCareerItems.filter((id) => careerChecklist.some((item) => item.id === id)).length}/${careerChecklist.length} elementos listos</small>
    </article>
  `;

  container.querySelectorAll('[data-career-item]').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const nextProgress = toggleCareerItem(getProgress(), checkbox.dataset.careerItem);
      saveProgress(nextProgress);
      const item = checkbox.closest('li');
      item?.classList.toggle('done', checkbox.checked);
      const completedCount = nextProgress.completedCareerItems.filter((id) => careerChecklist.some((entry) => entry.id === id)).length;
      container.querySelector('.career-checklist-summary').textContent = `${completedCount}/${careerChecklist.length} elementos listos`;
    });
  });
};

const renderProjectMilestones = (progress) => {
  const container = document.querySelector('#projectMilestones');
  if (!container) return;

  const completedSet = new Set(progress.completedWeeks);

  container.innerHTML = projectMilestones
    .map((milestone) => {
      const reached = completedSet.has(milestone.week);
      return `
        <article class="milestone-card ${reached ? 'done' : ''}">
          <div class="milestone-header">
            <span class="milestone-badge">Semana ${milestone.week}</span>
            <span class="milestone-xp">+${milestone.xp} XP</span>
          </div>
          <h3>${milestone.title}</h3>
          <p>${milestone.description}</p>
        </article>
      `;
    })
    .join('');
};

const renderProjectDeliverables = (progress) => {
  const container = document.querySelector('#projectDeliverables');
  if (!container) return;

  const completedSet = new Set(progress.completedWeeks);

  container.innerHTML = projectDeliverables
    .map((deliverable) => {
      const reached = completedSet.has(deliverable.week);
      return `
        <article class="deliverable-card ${reached ? 'done' : ''}">
          <div class="milestone-header">
            <span class="milestone-badge">Semana ${deliverable.week}</span>
            <span class="milestone-xp">+${deliverable.xp} XP</span>
          </div>
          <h3>${deliverable.title}</h3>
          <p>${deliverable.description}</p>
        </article>
      `;
    })
    .join('');
};

const renderFinalEvidence = (progress) => {
  const container = document.querySelector('#finalEvidenceList');
  if (!container) return;

  const completedSet = new Set(progress.completedWeeks);

  container.innerHTML = finalEvidence
    .map((item) => {
      const reached = completedSet.has(item.week);
      return `
        <article class="deliverable-card ${reached ? 'done' : ''}">
          <div class="milestone-header">
            <span class="milestone-badge">${item.type}</span>
            <span class="milestone-xp">+${item.xp} XP</span>
          </div>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </article>
      `;
    })
    .join('');
};

const renderProjectStatus = () => {
  const container = document.querySelector('#projectStatusPanel');
  if (!container) return;

  const riskList = projectStatus.risks.map((risk) => `<li>${risk}</li>`).join('');
  const nextStepList = projectStatus.nextSteps.map((step) => `<li>${step}</li>`).join('');

  container.innerHTML = `
    <div class="status-summary">
      <h3>${projectStatus.title}</h3>
      <p>${projectStatus.summary}</p>
    </div>
    <div class="status-grid">
      <div class="status-block">
        <h4>Enfoque</h4>
        <p>${projectStatus.focus}</p>
      </div>
      <div class="status-block">
        <h4>Riesgos</h4>
        <ul>${riskList}</ul>
      </div>
      <div class="status-block">
        <h4>Siguientes pasos</h4>
        <ul>${nextStepList}</ul>
      </div>
    </div>
  `;
};

const renderDemoReadiness = (progress) => {
  const container = document.querySelector('#demoReadinessPanel');
  if (!container) return;

  const completionRatio = Math.min(100, Math.round(((progress.completedWeeks.length + progress.completedLabs.length) / 48) * 100));
  const readinessScore = Math.max(40, Math.min(100, completionRatio + 25));

  const areas = [
    { label: 'Arquitectura', value: Math.min(100, 50 + progress.completedWeeks.length * 2) },
    { label: 'Producto', value: Math.min(100, 40 + progress.completedLabs.length * 2) },
    { label: 'Evidencia', value: Math.min(100, 30 + progress.completedObjectives.length * 10) },
    { label: 'Demo', value: readinessScore }
  ];

  container.innerHTML = `
    <div class="status-summary">
      <h3>Preparación para la demo final</h3>
      <p>El proyecto está ${readinessScore >= 80 ? 'listo para una demo sólida' : readinessScore >= 60 ? 'cerca de la demo final' : 'en fase de consolidación'}.</p>
    </div>
    <div class="status-grid">
      ${areas.map((area) => `
        <div class="status-block">
          <h4>${area.label}</h4>
          <div class="readiness-meter">
            <span style="width: ${area.value}%"></span>
          </div>
          <strong>${area.value}%</strong>
        </div>
      `).join('')}
    </div>
  `;
};

const renderSprintGuide = (progress) => {
  const container = document.querySelector('#sprintGuidePanel');
  if (!container) return;

  const nextWeek = roadmap.find((week) => !progress.completedWeeks.includes(week.id)) || roadmap[roadmap.length - 1];
  const nextLab = labs.find((lab) => !progress.completedLabs.includes(lab.id)) || labs[labs.length - 1];

  const sprintSteps = [
    `Definir el objetivo de la semana: ${nextWeek.title}`,
    `Completar el laboratorio activo: ${nextLab.title}`,
    `Registrar evidencia y aprender de la fallida/solución`,
    `Preparar una nota corta para la demo final y el próximo entregable`
  ];

  container.innerHTML = `
    <div class="status-summary">
      <h3>Sprint recomendado</h3>
      <p>Este bloque está pensado para quitar fricción y avanzar con una entrega medible.</p>
    </div>
    <div class="status-grid">
      <div class="status-block">
        <h4>Objetivo del sprint</h4>
        <p>${nextWeek.title}</p>
      </div>
      <div class="status-block">
        <h4>Laboratorio activo</h4>
        <p>${nextLab.title}</p>
      </div>
      <div class="status-block">
        <h4>Secuencia</h4>
        <ul>${sprintSteps.map((step) => `<li>${step}</li>`).join('')}</ul>
      </div>
    </div>
  `;
};

const renderPitch = (progress) => {
  const container = document.querySelector('#pitchPanel');
  if (!container) return;

  const currentLevel = calculateLevel(progress.xp);
  const completionPercent = Math.min(100, Math.round(((progress.completedWeeks.length + progress.completedLabs.length) / 48) * 100));

  container.innerHTML = `
    <div class="status-summary">
      <h3>Mensaje de cierre</h3>
      <p>La propuesta del Lab convierte el aprendizaje en un proyecto con evidencia, iteración y criterio profesional.</p>
    </div>
    <div class="status-grid">
      <div class="status-block">
        <h4>Problema</h4>
        <p>Muchos cursos muestran teoría, pero no enseñan cómo construir, probar, fallar, corregir y entregar soluciones reales.</p>
      </div>
      <div class="status-block">
        <h4>Solución</h4>
        <p>AI Engineering Learning Lab 2026 guía a la persona por una ruta práctica, con objetivos, laboratorios, métricas y evidencia.</p>
      </div>
      <div class="status-block">
        <h4>Impacto</h4>
        <p>El estudiante alcanza un nivel <strong>${currentLevel}</strong> con ${completionPercent}% de avance y una base clara para demostrar trabajo real.</p>
      </div>
    </div>
  `;
};

const renderWeeks = (progress) => {
  const weekList = document.querySelector('#weekList');
  weekList.innerHTML = roadmap
    .map((week) => {
      const done = progress.completedWeeks.includes(week.id);
      return `
        <article class="week-card ${done ? 'done' : ''}" data-week-id="${week.id}">
          <div class="week-header">
            <span class="week-pill">Nivel ${week.level}</span>
            <button class="tiny-btn" type="button">${done ? 'Completado' : 'Completar'}</button>
          </div>
          <h3>${week.title}</h3>
          <p>${week.lab}</p>
          <small>+${week.xp} XP</small>
          <button class="card-detail-btn" type="button" data-open-week="${week.id}" aria-label="Ver detalle de ${week.title}">Ver detalle de semana</button>
        </article>
      `;
    })
    .join('');

  weekList.querySelectorAll('.week-card').forEach((card) => {
    const button = card.querySelector('.tiny-btn');
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const id = Number(card.dataset.weekId);
      const week = roadmap.find((w) => w.id === id);
      const progressState = toggleWeek(getProgress(), week);
      saveProgress(progressState);
      renderAll();
      openWeekDetail(id);
    });

    card.querySelector('[data-open-week]').addEventListener('click', () => {
      openWeekDetail(Number(card.dataset.weekId));
      document.querySelector('#week-detail')?.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
  });
};

const renderLabs = (progress) => {
  const labList = document.querySelector('#labList');
  labList.innerHTML = labs
    .map((lab) => {
      const done = progress.completedLabs.includes(lab.id);
      const helpLevel = getLabHelpLevel(progress, lab.id);
      const availableXp = calculateLabXp(lab, helpLevel);
      return `
        <article class="lab-card ${done ? 'done' : ''}" data-lab-id="${lab.id}">
          <span class="badge">Semana ${lab.week}</span>
          <h3>${lab.title}</h3>
          <p>${lab.description}</p>
          <small class="lab-xp">XP al completar: ${availableXp}/${lab.xp}</small>
          <button class="card-detail-btn" type="button" data-open-lab="${lab.id}" aria-label="Ver detalles del laboratorio ${lab.title}">Ver guía del laboratorio</button>
          <button class="lab-btn" data-lab-id="${lab.id}" type="button">${done ? 'Laboratorio completado' : 'Marcar como hecho'}</button>
        </article>
      `;
    })
    .join('');

  labList.querySelectorAll('.lab-card').forEach((card) => {
    const button = card.querySelector('.lab-btn');
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const id = button.dataset.labId;
      const lab = labs.find((l) => l.id === id);
      const progressState = toggleLab(getProgress(), lab);
      saveProgress(progressState);
      renderAll();
      openLabDetail(id);
    });

    card.querySelector('[data-open-lab]').addEventListener('click', () => {
      openLabDetail(card.dataset.labId);
      document.querySelector('#week-detail')?.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
  });
};

const renderChallenges = () => {
  const challengeList = document.querySelector('#challengeList');
  challengeList.innerHTML = challenges
    .map((challenge) => `
      <div class="mini-item">
        <strong>${challenge.title}</strong>
        <span>${challenge.level}</span>
        <em>+${challenge.xp} XP</em>
      </div>
    `)
    .join('');
};

const openWeekDetail = (weekId) => {
  window.currentWeekId = weekId;
  const detail = weekDetails.find((item) => item.id === weekId);
  if (!detail) return;

  const panel = document.querySelector('#detailPanel');
  if (!panel) return;

  const detailList = [
    `Objetivo: ${detail.objective}`,
    `Conceptos: ${detail.concepts.join(', ')}`,
    `Reto: ${detail.challenge}`,
    `Break the system: ${detail.breakSystem}`,
    `Recovery: ${detail.recovery}`,
    `Evidencia: ${detail.evidence}`
  ];

  panel.innerHTML = `
    <div class="detail-header-row">
      <h3>${detail.title}</h3>
      <span class="detail-badge">Semana ${weekId}</span>
    </div>
    <ul class="detail-list">
      ${detailList.map((item) => `<li>${item}</li>`).join('')}
    </ul>
  `;

  const progress = getProgress();
  renderLearningObjectives(progress);
};

const openLabDetail = (labId) => {
  const detail = labDetails.find((item) => item.id === labId);
  if (!detail) return;

  const panel = document.querySelector('#detailPanel');
  if (!panel) return;

  const lab = labs.find((item) => item.id === labId);
  if (lab) {
    window.currentWeekId = lab.week;
  }
  const progress = getProgress();
  const helpLevel = getLabHelpLevel(progress, labId);
  const nextHelpLevel = helpLevel + 1;

  const detailList = [
    `Objetivo: ${detail.objective}`,
    `Pasos: ${detail.steps.join(' · ')}`,
    `Criterio: ${detail.criteria}`,
    `Nota de evaluación (informativa): ${detail.penalty}`
  ];

  const rewardXp = calculateLabXp(lab, helpLevel);
  const helpPercent = [100, 90, 75, 60, 40][helpLevel];
  const helpAction = nextHelpLevel <= 3
    ? `Ver pista ${nextHelpLevel} · ${LAB_HELP_XP_PERCENTAGES[nextHelpLevel]}% del XP`
    : nextHelpLevel === 4
      ? 'Revelar solución · 40% del XP'
      : '';
  const revealedHints = detail.hints.slice(0, Math.min(helpLevel, 3));

  panel.innerHTML = `
    <div class="detail-header-row">
      <h3>${lab ? lab.title : 'Laboratorio'}</h3>
      <span class="detail-badge">${lab ? `Semana ${lab.week}` : 'Lab'}</span>
    </div>
    <div class="lab-help-summary" aria-live="polite">
      <strong>XP al completar: ${rewardXp}/${lab.xp} (${helpPercent}%)</strong>
      <span>${helpLevel === 0 ? 'Sin ayuda todavía: conserva el 100% del XP.' : `Ayuda máxima revelada: etapa ${helpLevel} de 4.`}</span>
    </div>
    <p class="hint-ladder-note">La ayuda se revela en orden: pista 1 (90%), pista 2 (75%), pista 3 (60%) y solución (40%). El nivel más alto visto determina la recompensa, incluso si vuelves a abrir una pista anterior.</p>
    <ul class="detail-list">
      ${detailList.map((item) => `<li>${item}</li>`).join('')}
    </ul>
    ${revealedHints.map((hint, index) => `
      <div class="detail-reveal hint-stage" id="lab-hint-${labId}-${index + 1}">
        <strong>Pista ${index + 1}</strong>
        <p>${hint}</p>
      </div>
    `).join('')}
    ${helpLevel >= 4 ? `
      <div class="detail-reveal hint-stage" id="lab-hint-${labId}-solution" tabindex="-1">
        <strong>Solución</strong>
        <p>${detail.solution}</p>
      </div>
    ` : ''}
    ${helpAction ? `
      <div class="detail-actions">
        <button class="secondary-btn help-step-btn" type="button" data-help-level="${nextHelpLevel}">${helpAction}</button>
      </div>
    ` : ''}
  `;

  panel.querySelector('.help-step-btn')?.addEventListener('click', (event) => {
    const button = event.currentTarget;
    const nextProgress = recordLabHelp(getProgress(), lab, Number(button.dataset.helpLevel));
    saveProgress(nextProgress);
    renderAll();
    openLabDetail(labId);
    const nextButton = panel.querySelector('.help-step-btn');
    if (nextButton) {
      nextButton.focus();
    } else {
      panel.querySelector(`#lab-hint-${labId}-solution`)?.focus();
    }
  });

  renderLearningObjectives(progress);
};

const renderResources = () => {
  const resourceList = document.querySelector('#resourceList');
  resourceList.innerHTML = resources
    .map((item) => `
      <div class="mini-item resource-item">
        <strong>${item.title}</strong>
        <a href="${item.url}" target="_blank" rel="noreferrer">Abrir</a>
      </div>
    `)
    .join('');
};

const renderGlossary = () => {
  const glossaryList = document.querySelector('#glossaryList');
  glossaryList.innerHTML = glossary
    .map((item) => `
      <article class="glossary-card">
        <h3>${item.term}</h3>
        <p>${item.definition}</p>
      </article>
    `)
    .join('');
};

const renderWeakAreas = (progress) => {
  const container = document.querySelector('#weakAreasList');
  const summaryEl = document.querySelector('#weakAreasSummary');
  if (!container) return;

  const weak = getWeakAreas(progress);
  const mastered = getMasteredExercises(progress);

  if (summaryEl) {
    summaryEl.textContent = weak.length === 0 && mastered.length === 0
      ? 'Todavía no has calificado ningún ejercicio. Usa "Calificar mi código" en la consola de práctica.'
      : `${mastered.length} ejercicio(s) dominado(s) · ${weak.length} pendiente(s) de repasar`;
  }

  if (weak.length === 0) {
    container.innerHTML = mastered.length > 0
      ? '<p class="workbench-help">No tienes ejercicios pendientes de repaso ahora mismo. Buen trabajo.</p>'
      : '';
    return;
  }

  container.innerHTML = weak
    .map((attempt) => {
      const lab = labs.find((l) => l.id === attempt.labId);
      const lastAttempt = new Date(attempt.lastAttemptAt).toLocaleString();
      return `
        <article class="milestone-card weak-area-card">
          <div class="milestone-header">
            <span class="milestone-badge">${lab ? lab.title : attempt.labId}</span>
            <span class="milestone-xp">${attempt.passed}/${attempt.total}</span>
          </div>
          <p><strong>Intentos:</strong> ${attempt.attempts} · <strong>Último intento:</strong> ${lastAttempt}</p>
          <ul>
            ${attempt.failingChecks.map((name) => `<li class="grade-fail">✘ ${name}</li>`).join('')}
          </ul>
        </article>
      `;
    })
    .join('');
};

const stripCodeFence = (raw) => {
  if (!raw) return '';
  const match = raw.match(/^```(\w*)\r?\n([\s\S]*?)\r?\n```$/);
  return match ? match[2] : raw;
};

const renderTerminalTutor = () => {
  const container = document.querySelector('#terminalTutorList');
  if (!container) return;

  container.innerHTML = terminalCommands
    .map((cmd) => `
      <article class="milestone-card terminal-command-card risk-${cmd.risk}">
        <div class="milestone-header">
          <span class="milestone-badge">${cmd.category}</span>
          <span class="milestone-xp risk-label">Riesgo: ${cmd.risk}</span>
        </div>
        <h3><code>${cmd.command}</code></h3>
        <p>${cmd.whatItDoes}</p>
        <details>
          <summary>Ver cuándo usarlo, riesgos, ejemplo, ejercicio y recovery</summary>
          <p><strong>Cuándo usarlo:</strong> ${cmd.whenToUse}</p>
          <p><strong>Riesgos:</strong> ${cmd.risks}</p>
          <p><strong>Ejemplo:</strong></p>
          <pre>${stripCodeFence(cmd.example)}</pre>
          <p><strong>Ejercicio:</strong> ${cmd.exercise}</p>
          <p><strong>Error común:</strong> ${cmd.commonError}</p>
          <p><strong>Recovery:</strong> ${cmd.recovery}</p>
        </details>
      </article>
    `)
    .join('');
};

const initTerminalCoach = () => {
  const commandSelect = document.querySelector('#coachCommandSelect');
  const predictionInput = document.querySelector('#coachPrediction');
  const runButton = document.querySelector('#coachRunBtn');
  const guide = document.querySelector('#coachCommandGuide');
  const status = document.querySelector('#coachStatus');
  const resultPanel = document.querySelector('#coachResult');
  const predictionReview = document.querySelector('#coachPredictionReview');
  const output = document.querySelector('#coachCommandOutput');
  const commonErrors = document.querySelector('#coachCommonErrors');
  if (!commandSelect || !predictionInput || !runButton || !guide || !status || !resultPanel || !predictionReview || !output || !commonErrors) return;

  let commands = [];
  const selectedCommand = () => commands.find((command) => command.id === commandSelect.value);
  const canRun = () => Boolean(selectedCommand() && predictionInput.value.trim() && predictionInput.value.length <= 500);
  const renderGuide = () => {
    const command = selectedCommand();
    guide.replaceChildren();
    if (!command) {
      guide.textContent = 'Selecciona un diagnóstico del catálogo.';
      runButton.disabled = true;
      return;
    }
    const entries = [
      ['Comando fijo', command.command],
      ['Qué hace', command.what],
      ['Cuándo usarlo', command.when],
      ['Riesgo', command.risk],
      ['Ejemplo', command.example],
      ['Ejercicio', command.exercise],
      ['Reto', command.challenge],
      ['Recovery', command.recovery]
    ];
    for (const [label, value] of entries) {
      const paragraph = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = `${label}: `;
      paragraph.append(strong, document.createTextNode(value));
      guide.append(paragraph);
    }
    runButton.disabled = !canRun();
  };

  commandSelect.addEventListener('change', () => {
    resultPanel.hidden = true;
    renderGuide();
  });
  predictionInput.addEventListener('input', () => {
    runButton.disabled = !canRun();
  });

  runButton.addEventListener('click', async () => {
    const command = selectedCommand();
    const prediction = predictionInput.value.trim();
    if (!command || !prediction || prediction.length > 500) {
      status.textContent = 'Selecciona un comando y escribe una predicción de hasta 500 caracteres.';
      return;
    }

    runButton.disabled = true;
    status.textContent = 'Ejecutando únicamente el diagnóstico seleccionado...';
    resultPanel.hidden = true;
    try {
      const response = await fetch('/api/terminal/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commandId: command.id, prediction })
      });
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('No se encontró la API local. Inicia npm run lab:server y usa el sitio local de Vite.');
      }
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || `La API respondió HTTP ${response.status}.`);

      predictionReview.textContent = `Tu predicción: “${result.prediction}”. ${result.verification}`;
      output.textContent = [
        `Comando: ${result.command}`,
        `Disponible: ${result.available ? 'sí' : 'no'}`,
        `Código de salida: ${result.exitCode ?? 'sin ejecutar'}`,
        result.timedOut ? 'Tiempo límite: excedido' : '',
        result.stdout ? `Salida:\n${result.stdout}` : '',
        result.stderr ? `Error:\n${result.stderr}` : ''
      ].filter(Boolean).join('\n\n');
      commonErrors.replaceChildren();
      const errorsHeading = document.createElement('p');
      errorsHeading.textContent = 'Errores comunes y recuperación:';
      const errorList = document.createElement('ul');
      for (const error of result.teaching.commonErrors) {
        const item = document.createElement('li');
        item.textContent = error;
        errorList.append(item);
      }
      const recovery = document.createElement('p');
      recovery.textContent = `Recovery: ${result.teaching.recovery}`;
      commonErrors.append(errorsHeading, errorList, recovery);
      resultPanel.hidden = false;
      status.textContent = result.available
        ? 'Diagnóstico finalizado. Contrasta la salida real con tu predicción y el criterio de verificación.'
        : 'La herramienta no está disponible; no se ejecutó ningún comando.';
    } catch (error) {
      status.textContent = `No se pudo ejecutar o verificar el diagnóstico: ${error.message}`;
    } finally {
      runButton.disabled = !canRun();
    }
  });

  fetch('/api/terminal/commands')
    .then(async (response) => {
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('No se encontró la API local. Inicia npm run lab:server y usa el sitio local de Vite.');
      }
      const catalog = await response.json();
      if (!response.ok) throw new Error(catalog.error || `La API respondió HTTP ${response.status}.`);
      if (!Array.isArray(catalog.commands) || catalog.commands.length === 0) {
        throw new Error('La API no devolvió comandos de diagnóstico.');
      }
      commands = catalog.commands;
      commandSelect.replaceChildren();
      for (const command of commands) {
        const option = document.createElement('option');
        option.value = command.id;
        option.textContent = command.label;
        commandSelect.append(option);
      }
      commandSelect.disabled = false;
      status.textContent = 'El catálogo usa comandos fijos de solo lectura. Las herramientas ausentes se reportan sin ejecutar el comando.';
      renderGuide();
    })
    .catch((error) => {
      commandSelect.replaceChildren();
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'Catálogo no disponible';
      commandSelect.append(option);
      status.textContent = `No se pudo cargar el Terminal Coach: ${error.message}`;
    });
};

const renderNotes = () => {
  const notesArea = document.querySelector('#notesArea');
  if (!notesArea) return;

  const progress = getProgress();
  notesArea.value = progress.notes || '';
  notesArea.oninput = (event) => {
    const progressState = getProgress();
    progressState.notes = event.target.value;
    saveProgress(progressState);
  };
};

const initLabWorkbench = () => {
  const sourceArea = document.querySelector('#runnerSource');
  const languageSelect = document.querySelector('#runnerLanguage');
  const runButton = document.querySelector('#runCodeBtn');
  const output = document.querySelector('#runnerOutput');
  const environmentStatus = document.querySelector('#labEnvironmentStatus');
  const mentorQuestion = document.querySelector('#mentorQuestion');
  const mentorButton = document.querySelector('#askMentorBtn');
  const conversation = document.querySelector('#mentorConversation');
  const refreshButton = document.querySelector('#refreshEnvironmentBtn');
  const inventoryOutput = document.querySelector('#environmentInventoryOutput');
  const refreshInventoryButton = document.querySelector('#refreshEnvironmentDetailsBtn');
  const gradingSelect = document.querySelector('#gradingExerciseSelect');
  const gradingHelp = document.querySelector('#gradingExerciseHelp');
  const gradeButton = document.querySelector('#gradeCodeBtn');
  const gradingResult = document.querySelector('#gradingResult');
  const gradingSummary = document.querySelector('#gradingSummary');
  const gradingChecklist = document.querySelector('#gradingChecklist');
  const logAnalyzerContext = document.querySelector('#logAnalyzerContext');
  const logAnalyzerText = document.querySelector('#logAnalyzerText');
  const analyzeLogButton = document.querySelector('#analyzeLogBtn');
  const logAnalyzerResult = document.querySelector('#logAnalyzerResult');
  const logAnalyzerOutput = document.querySelector('#logAnalyzerOutput');
  const sourceByLanguage = new Map();
  let lastOutput = '';
  let gradableExercises = [];

  if (!sourceArea || !languageSelect || !runButton || !environmentStatus || !inventoryOutput || !refreshInventoryButton) return;
  sourceArea.value = runnerStarters[languageSelect.value];

  const readApiResponse = async (response) => {
    if (!response.headers.get('content-type')?.includes('application/json')) {
      throw new Error('No se encontró la API local. Inicia npm run lab:server y usa el sitio local de Vite.');
    }
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`);
    return result;
  };

  const checkEnvironment = async () => {
    environmentStatus.textContent = 'Comprobando Docker, sandbox y Ollama...';
    try {
      const response = await fetch('/api/health');
      const health = await readApiResponse(response);

      const dockerReady = health.docker?.available && health.docker?.imageReady;
      const mentorReady = health.ollama?.available && health.ollama?.modelReady;
      runButton.disabled = !dockerReady;
      mentorButton.disabled = !mentorReady;
      if (gradeButton) gradeButton.disabled = !dockerReady || !gradingSelect?.value;

      const dockerStatus = !health.docker?.available
        ? `Docker no disponible${health.docker?.error ? `: ${health.docker.error}` : ''}.`
        : health.docker.imageReady
          ? 'Docker y la imagen sandbox están listos.'
          : 'Docker funciona, pero falta la imagen sandbox: ejecuta npm run lab:sandbox:build.';
      const mentorStatus = !health.ollama?.available
        ? `Ollama no responde${health.ollama?.error ? `: ${health.ollama.error}` : ''}.`
        : health.ollama.modelReady
          ? `Mentor listo con ${health.model}.`
          : `Falta el modelo ${health.model}: ejecuta ollama pull ${health.model}.`;
      environmentStatus.textContent = `${dockerStatus} ${mentorStatus}`;
      environmentStatus.dataset.ready = String(Boolean(dockerReady && mentorReady));
    } catch (error) {
      runButton.disabled = true;
      mentorButton.disabled = true;
      environmentStatus.dataset.ready = 'false';
      environmentStatus.textContent = `Servicios locales no disponibles: ${error.message}. Inicia el backend con npm run lab:server y vuelve a comprobar.`;
    }
  };

  const formatEnvironment = (environment) => {
    const toolLines = environment.tools.map((tool) => {
      const status = tool.available ? tool.version || 'Disponible' : tool.note || 'No detectado';
      return `- ${tool.label}: ${status}`;
    });
    const containerLines = environment.docker.containers.length
      ? environment.docker.containers.map((container) => `- ${container.name} · ${container.image}${container.ports ? ` · ${container.ports}` : ''}`)
      : ['- Ninguno activo o Docker no disponible'];
    const portLines = !environment.portScanAvailable
      ? [`- No se pudo consultar el inventario: ${environment.portScanNote || 'error desconocido'}`]
      : environment.ports.length
      ? environment.ports.slice(0, 40).map((port) => `- ${port.port} · ${port.address} · ${port.process}`)
      : ['- No se detectaron puertos TCP en escucha'];
    const projectLines = environment.projects.projects.length
      ? environment.projects.projects.map((project) => `- ${project.path}: ${project.technologies.join(', ')}`)
      : ['- No se encontraron marcadores conocidos en el workspace'];

    return [
      `Inventario local · ${new Date(environment.inspectedAt).toLocaleString()}`,
      `Sistema: ${environment.system.platform} ${environment.system.version} (${environment.system.architecture})`,
      `Terminal: ${environment.system.terminal}${environment.system.terminalVersion ? ` ${environment.system.terminalVersion}` : ''}`,
      '',
      'Herramientas:',
      ...toolLines,
      '',
      `WSL: ${environment.wsl.available ? environment.wsl.distributions.join(', ') || 'disponible, sin distribuciones listadas' : 'no detectado'}`,
      `Contenedores Docker activos (${environment.docker.containers.length}):`,
      ...containerLines,
      `Modelos Ollama: ${environment.ollama.models.length ? environment.ollama.models.join(', ') : 'ninguno detectado'}`,
      `Extensiones VS Code (${environment.vscode.extensions.length}): ${environment.vscode.extensions.length ? environment.vscode.extensions.join(', ') : 'no detectadas'}`,
      '',
      'Puertos en escucha:',
      ...portLines,
      ...(environment.ports.length > 40 ? [`- ... y ${environment.ports.length - 40} más`] : []),
      '',
      'Proyectos del workspace:',
      ...projectLines,
      '',
      environment.scope,
      environment.privacy
    ].join('\n');
  };

  const refreshEnvironmentInventory = async () => {
    inventoryOutput.textContent = 'Detectando herramientas locales...';
    try {
      const response = await fetch('/api/environment');
      const environment = await readApiResponse(response);
      inventoryOutput.textContent = formatEnvironment(environment);
    } catch (error) {
      inventoryOutput.textContent = `No se pudo obtener el inventario local: ${error.message}`;
    }
  };

  languageSelect.addEventListener('change', () => {
    sourceByLanguage.set(languageSelect.dataset.previousLanguage || 'javascript', sourceArea.value);
    sourceArea.value = sourceByLanguage.get(languageSelect.value) ?? runnerStarters[languageSelect.value];
    languageSelect.dataset.previousLanguage = languageSelect.value;
  });
  languageSelect.dataset.previousLanguage = languageSelect.value;

  runButton.addEventListener('click', async () => {
    runButton.disabled = true;
    output.textContent = 'Ejecutando en un contenedor temporal...';
    try {
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: languageSelect.value, source: sourceArea.value })
      });
      const result = await readApiResponse(response);
      lastOutput = [result.stdout, result.stderr].filter(Boolean).join('\n');
      output.textContent = [
        result.stdout ? `STDOUT:\n${result.stdout}` : '',
        result.stderr ? `STDERR:\n${result.stderr}` : '',
        result.truncated ? '[La salida se truncó por alcanzar el límite.]' : '',
        `Proceso terminado con código ${result.exitCode}.`
      ].filter(Boolean).join('\n\n');
      output.dataset.exitCode = String(result.exitCode);
    } catch (error) {
      lastOutput = error.message;
      output.textContent = `No se pudo ejecutar: ${error.message}`;
      output.dataset.exitCode = 'error';
    } finally {
      await checkEnvironment();
    }
  });

  const addConversationMessage = (role, content) => {
    conversation.querySelector('.mentor-placeholder')?.remove();
    const message = document.createElement('p');
    message.className = `mentor-message ${role}`;
    const label = document.createElement('strong');
    label.textContent = role === 'user' ? 'Tú' : 'Mentor';
    const text = document.createElement('span');
    text.textContent = content;
    message.append(label, text);
    conversation.append(message);
    conversation.scrollTop = conversation.scrollHeight;
  };

  mentorButton.addEventListener('click', async () => {
    const question = mentorQuestion.value.trim();
    if (!question) {
      mentorQuestion.focus();
      return;
    }
    mentorButton.disabled = true;
    addConversationMessage('user', question);
    const shareContext = document.querySelector('#shareMentorContext').checked;
    try {
      const response = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: languageSelect.value,
          question,
          history: mentorHistory.slice(-8),
          source: shareContext ? sourceArea.value : '',
          output: shareContext ? lastOutput : ''
        })
      });
      const result = await readApiResponse(response);
      mentorHistory.push({ role: 'user', content: question });
      mentorHistory.push({ role: 'assistant', content: result.answer });
      addConversationMessage('assistant', result.answer);
      mentorQuestion.value = '';
    } catch (error) {
      addConversationMessage('assistant', `No se pudo obtener una respuesta: ${error.message}`);
    } finally {
      await checkEnvironment();
    }
  });

  mentorQuestion.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      mentorButton.click();
    }
  });

  if (analyzeLogButton) {
    analyzeLogButton.addEventListener('click', async () => {
      const logText = logAnalyzerText.value.trim();
      if (!logText) {
        logAnalyzerText.focus();
        return;
      }
      analyzeLogButton.disabled = true;
      logAnalyzerResult.hidden = false;
      logAnalyzerOutput.textContent = 'Analizando con el mentor local...';
      try {
        const response = await fetch('/api/log-analyzer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ logText, context: logAnalyzerContext.value.trim() })
        });
        const result = await readApiResponse(response);
        logAnalyzerOutput.textContent = result.answer;
      } catch (error) {
        logAnalyzerOutput.textContent = `No se pudo analizar: ${error.message}`;
      } finally {
        analyzeLogButton.disabled = false;
      }
    });
  }

  const loadGradableExercises = async () => {
    if (!gradingSelect) return;
    try {
      const response = await fetch('/api/grading/exercises');
      const data = await readApiResponse(response);
      gradableExercises = data.exercises || [];
      gradingSelect.innerHTML = '<option value="">Sin ejercicio calificado seleccionado</option>'
        + gradableExercises.map((ex, i) => `<option value="${i}">${ex.label} (${ex.labId})</option>`).join('');
    } catch (error) {
      gradableExercises = [];
    }
  };

  if (gradingSelect) {
    gradingSelect.addEventListener('change', () => {
      const exercise = gradableExercises[Number(gradingSelect.value)];
      if (exercise && gradingHelp) {
        gradingHelp.textContent = `Selecciona el lenguaje "${exercise.language}" arriba y escribe tu solución para ${exercise.labId}. Ver el enunciado completo en el detalle del laboratorio.`;
        gradingHelp.hidden = false;
      } else if (gradingHelp) {
        gradingHelp.hidden = true;
      }
      gradingResult?.setAttribute('hidden', '');
      checkEnvironment();
    });
  }

  if (gradeButton) {
    gradeButton.addEventListener('click', async () => {
      const exercise = gradableExercises[Number(gradingSelect.value)];
      if (!exercise) return;
      gradeButton.disabled = true;
      gradingResult.hidden = false;
      gradingSummary.textContent = 'Calificando en el sandbox...';
      gradingChecklist.innerHTML = '';
      try {
        const response = await fetch('/api/grade', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ labId: exercise.labId, language: exercise.language, source: sourceArea.value })
        });
        const result = await readApiResponse(response);
        if (result.executionFailed) {
          gradingSummary.textContent = 'No se pudo evaluar: tu código no terminó de ejecutarse correctamente.';
          gradingChecklist.innerHTML = `<li class="grade-fail">${(result.stderr || 'Revisa errores de sintaxis o de ejecución.').replace(/</g, '&lt;')}</li>`;
        } else {
          const { passed, total } = result.summary;
          gradingSummary.textContent = `${passed}/${total} pruebas superadas`;
          gradingChecklist.innerHTML = result.results
            .map((r) => `<li class="${r.pass ? 'grade-pass' : 'grade-fail'}">${r.pass ? '✔' : '✘'} ${r.name}${r.detail ? ` — ${r.detail}` : ''}</li>`)
            .join('');
          const nextProgress = recordGradingAttempt(getProgress(), {
            labId: exercise.labId,
            language: exercise.language,
            results: result.results,
            summary: result.summary
          });
          saveProgress(nextProgress);
          renderWeakAreas(nextProgress);
        }
      } catch (error) {
        gradingSummary.textContent = `No se pudo calificar: ${error.message}`;
        gradingChecklist.innerHTML = '';
      } finally {
        await checkEnvironment();
      }
    });
  }

  refreshButton.addEventListener('click', checkEnvironment);
  refreshInventoryButton.addEventListener('click', refreshEnvironmentInventory);
  checkEnvironment();
  refreshEnvironmentInventory();
  loadGradableExercises();
};

const renderFilteredContent = () => {
  const searchInput = document.querySelector('#searchInput');
  const filterSelect = document.querySelector('#filterSelect');
  const weekCards = document.querySelectorAll('.week-card');
  const labCards = document.querySelectorAll('.lab-card');

  const query = searchInput.value.trim().toLowerCase();
  const filter = filterSelect.value;

  const matchesLevel = (itemLevel) => filter === 'all' || String(itemLevel) === filter;

  weekCards.forEach((card) => {
    const weekId = Number(card.dataset.weekId);
    const week = roadmap.find((item) => item.id === weekId);
    const matches = matchesLevel(week.level) && (!query || `${week.title} ${week.lab}`.toLowerCase().includes(query));
    card.style.display = matches ? 'block' : 'none';
  });

  labCards.forEach((card) => {
    const button = card.querySelector('.lab-btn');
    const lab = labs.find((item) => item.id === button.dataset.labId);
    const week = roadmap.find((item) => item.id === lab.week);
    const matches = matchesLevel(week.level) && (!query || `${lab.title} ${lab.description}`.toLowerCase().includes(query));
    card.style.display = matches ? 'block' : 'none';
  });
};

const renderAll = () => {
  const progress = getProgress();
  renderStats(progress);
  renderStudySummary(progress);
  renderStudyMode(progress);
  renderLearningObjectives(progress);
  renderProgramProjects(progress);
  renderLearningModes(progress);
  renderProjectMilestones(progress);
  renderProjectDeliverables(progress);
  renderFinalEvidence(progress);
  renderProjectStatus();
  renderDemoReadiness(progress);
  renderSprintGuide(progress);
  renderPitch(progress);
  renderWeeks(progress);
  renderLabs(progress);
  renderChallenges();
  renderResources();
  renderGlossary();
  renderTerminalTutor();
  renderWeakAreas(progress);
  renderNotes();
  renderFilteredContent();

  ensureCurrentWeekId();
  openWeekDetail(Number(window.currentWeekId));
};

document.addEventListener('DOMContentLoaded', () => {
  const resetButton = document.querySelector('#resetProgressBtn');
  const searchInput = document.querySelector('#searchInput');
  const filterSelect = document.querySelector('#filterSelect');

  resetButton.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    window.currentWeekId = getDefaultWeekId();
    renderAll();
  });

  searchInput.addEventListener('input', renderFilteredContent);
  filterSelect.addEventListener('change', renderFilteredContent);

  window.currentWeekId = window.currentWeekId ?? getDefaultWeekId();
  renderAll();
  initLabWorkbench();
  initTerminalCoach();
});
