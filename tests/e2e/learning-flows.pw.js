import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/api/health', (route) => route.abort());
  await page.route('**/api/environment', (route) => route.fulfill({
    json: {
      inspectedAt: '2026-10-08T19:00:00.000Z',
      system: { platform: 'Windows', version: '10.0.26300', architecture: 'x64', terminal: 'PowerShell', terminalVersion: '5.1.26100.9549' },
      tools: [{ id: 'node', label: 'Node.js', available: true, version: 'v24.18.0' }],
      wsl: { available: true, distributions: ['Ubuntu-24.04'] },
      docker: { available: true, containers: [{ name: 'learning-db', image: 'postgres:16', ports: '5434->5432' }] },
      ollama: { available: true, models: ['llama3.2:latest'] },
      vscode: { available: true, version: '1.141.0', extensions: ['redhat.java'] },
      portScanAvailable: true,
      portScanNote: null,
      ports: [{ address: '127.0.0.1', port: 4173, process: 'node' }],
      projects: { workspaceName: 'Lab', scope: 'workspace only', projects: [{ path: '.', technologies: ['Node.js'] }] },
      privacy: 'Solo localhost.',
      scope: 'Solo el workspace actual.'
    }
  }));
  await page.route('**/api/terminal/commands', (route) => route.fulfill({
    json: {
      commands: [{
        id: 'git-version',
        label: 'Versión de Git',
        command: 'git --version',
        what: 'Muestra la versión de Git.',
        when: 'Antes de usar Git.',
        risk: 'Solo consulta la versión.',
        example: 'git --version',
        exercise: 'Compara la versión.',
        commonErrors: ['Git no está instalado.'],
        recovery: 'Instala Git desde la fuente oficial.',
        challenge: 'Confirma la versión.',
        verification: 'La salida indica la versión.'
      }]
    }
  }));
  await page.goto('/');
  await page.evaluate(() => localStorage.removeItem('ai-lab-progress-v1'));
  await page.reload();
});

test('las pistas respetan la recompensa, se conserva el estado y el XP al recargar', async ({ page }) => {
  const labCard = page.locator('.lab-card').first();
  await labCard.locator('[data-open-lab]').click();

  const detail = page.locator('#detailPanel');
  const expectedRewards = [
    'XP al completar: 23/25 (90%)',
    'XP al completar: 19/25 (75%)',
    'XP al completar: 15/25 (60%)',
    'XP al completar: 10/25 (40%)'
  ];

  for (const reward of expectedRewards) {
    await detail.getByRole('button', { name: /Ver pista|Revelar solución/ }).click();
    await expect(detail.locator('.lab-help-summary')).toContainText(reward);
  }
  await expect(detail.getByText('Solución', { exact: true })).toBeVisible();

  await labCard.getByRole('button', { name: 'Marcar como hecho' }).click();
  await expect(page.locator('#xpValue')).toHaveText('10');
  await page.reload();
  await expect(page.locator('#xpValue')).toHaveText('10');
  await page.locator('.lab-card').first().locator('[data-open-lab]').click();
  await expect(page.locator('#detailPanel')).toContainText('Ayuda máxima revelada: etapa 4 de 4.');
});

test('completar un laboratorio sin consultar ayuda conserva todo el XP', async ({ page }) => {
  await page.locator('.lab-card').first().getByRole('button', { name: 'Marcar como hecho' }).click();
  await expect(page.locator('#xpValue')).toHaveText('25');
  await expect(page.locator('#labsCompleted')).toHaveText('1');
});

test('el estado de proyecto y el checklist laboral persisten sin alterar el XP', async ({ page }) => {
  const project = page.locator('[data-project-id="project-01"]');
  await expect(page.locator('.project-card')).toHaveCount(7);
  await expect(project).toContainText('Semanas del proyecto pendientes');
  await project.locator('summary').click();
  await expect(project).toContainText('Criterios de éxito');
  await expect(project).toContainText('Una persona ajena al proyecto puede clonarlo');

  await page.locator('[data-project-status="project-01"]').selectOption('in-progress');
  await expect(project.locator('.project-status-label')).toHaveText('En progreso');
  await page.locator('[data-career-item="career-project"]').check();
  await expect(page.locator('#xpValue')).toHaveText('0');
  await expect(page.locator('.career-checklist-summary')).toHaveText('1/8 elementos listos');

  await page.reload();
  await expect(page.locator('[data-project-status="project-01"]')).toHaveValue('in-progress');
  await expect(page.locator('[data-career-item="career-project"]')).toBeChecked();
  await expect(page.locator('.career-checklist-summary')).toHaveText('1/8 elementos listos');
});

test('las guías de entrenamiento están disponibles sin provocar overflow móvil', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('heading', { name: 'Modo sin IA' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'AI as Mentor' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Modo entrevista' })).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth
  );
  expect(hasHorizontalOverflow).toBe(false);
});

test('Terminal Coach exige una predicción antes de ejecutar y compara el resultado real', async ({ page }) => {
  let runCount = 0;
  await page.route('**/api/terminal/run', async (route) => {
    runCount += 1;
    expect(route.request().postDataJSON()).toEqual({
      commandId: 'git-version',
      prediction: 'Espero Git 2.x'
    });
    await route.fulfill({
      json: {
        commandId: 'git-version',
        command: 'git --version',
        prediction: 'Espero Git 2.x',
        available: true,
        exitCode: 0,
        stdout: 'git version 2.55.0.windows.1',
        stderr: '',
        timedOut: false,
        verification: 'La salida indica la versión.',
        teaching: {
          commonErrors: ['Git no está instalado.'],
          recovery: 'Instala Git desde la fuente oficial.'
        }
      }
    });
  });

  const runButton = page.locator('#coachRunBtn');
  await expect(runButton).toBeDisabled();
  await page.locator('#coachPrediction').fill('Espero Git 2.x');
  await expect(runButton).toBeEnabled();
  await runButton.click();
  await expect(page.locator('#coachResult')).toBeVisible();
  await expect(page.locator('#coachCommandOutput')).toContainText('git version 2.55.0.windows.1');
  await expect(page.locator('#coachPredictionReview')).toContainText('La salida indica la versión.');
  await expect(page.locator('#coachCommonErrors')).toContainText('Git no está instalado.');
  expect(runCount).toBe(1);
});

test('el runner presenta el lenguaje y la salida como texto, sin evaluar respuestas HTML', async ({ page }) => {
  let runPayload;
  await page.route('**/api/health', (route) => route.fulfill({
    json: {
      docker: { available: true, imageReady: true },
      ollama: { available: false, modelReady: false },
      model: 'llama3.2:latest'
    }
  }));
  await page.route('**/api/run', async (route) => {
    runPayload = route.request().postDataJSON();
    await route.fulfill({
      json: { language: 'JavaScript (Node.js)', exitCode: 0, stdout: '<script>unsafe()</script>', stderr: '', truncated: false }
    });
  });
  await page.reload();
  await expect(page.locator('#runCodeBtn')).toBeEnabled();
  await page.locator('#runnerSource').fill('console.log("ok")');
  await page.locator('#runCodeBtn').click();
  await expect(page.locator('#runnerOutput')).toContainText('<script>unsafe()</script>');
  await expect(page.locator('#runnerOutput script')).toHaveCount(0);
  expect(runPayload).toEqual({ language: 'javascript', source: 'console.log("ok")' });

  await page.locator('#runnerLanguage').selectOption('java');
  await expect(page.locator('#runnerSource')).toHaveValue(/public class Main/);
});

test('el mentor es conversacional, solo recibe código y salida con consentimiento y no ejecuta su respuesta', async ({ page }) => {
  const mentorPayloads = [];
  await page.route('**/api/health', (route) => route.fulfill({
    json: {
      docker: { available: true, imageReady: true },
      ollama: { available: true, modelReady: true },
      model: 'llama3.2:latest'
    }
  }));
  await page.route('**/api/run', (route) => route.fulfill({
    json: { language: 'JavaScript (Node.js)', exitCode: 1, stdout: '', stderr: 'ReferenceError: value is not defined', truncated: false }
  }));
  await page.route('**/api/mentor', async (route) => {
    mentorPayloads.push(route.request().postDataJSON());
    await route.fulfill({ json: { answer: '<img src=x onerror=alert(1)> Prueba el alcance de la variable.' } });
  });
  await page.reload();
  await expect(page.locator('#askMentorBtn')).toBeEnabled();

  await page.locator('#runnerSource').fill('console.log(value)');
  await page.locator('#runCodeBtn').click();
  await page.locator('#mentorQuestion').fill('¿Qué indica el error?');
  await page.locator('#askMentorBtn').click();
  await expect(page.locator('#mentorConversation')).toContainText('Prueba el alcance de la variable.');
  expect(mentorPayloads[0].source).toBe('');
  expect(mentorPayloads[0].output).toBe('');
  await expect(page.locator('#mentorConversation img')).toHaveCount(0);

  await page.locator('#shareMentorContext').check();
  await page.locator('#mentorQuestion').fill('Ahora sí revisa mi salida');
  await page.locator('#askMentorBtn').click();
  await expect(page.locator('#mentorConversation .mentor-message')).toHaveCount(4);
  expect(mentorPayloads[1].source).toBe('console.log(value)');
  expect(mentorPayloads[1].output).toContain('ReferenceError');
});

test('la interfaz explica cómo activar el backend cuando no está disponible', async ({ page }) => {
  await expect(page.locator('#labEnvironmentStatus')).toContainText('npm run lab:server');
  await expect(page.locator('#runCodeBtn')).toBeDisabled();
  await expect(page.locator('#askMentorBtn')).toBeDisabled();
});

test('el inventario local muestra herramientas y contexto detectados como texto', async ({ page }) => {
  await page.locator('#environmentDetails summary').click();
  await expect(page.locator('#environmentInventoryOutput')).toContainText('Windows 10.0.26300');
  await expect(page.locator('#environmentInventoryOutput')).toContainText('Terminal: PowerShell 5.1.26100.9549');
  await expect(page.locator('#environmentInventoryOutput')).toContainText('Node.js: v24.18.0');
  await expect(page.locator('#environmentInventoryOutput')).toContainText('Contenedores Docker activos (1)');
  await expect(page.locator('#environmentInventoryOutput')).toContainText('learning-db');
  await expect(page.locator('#environmentInventoryOutput')).toContainText('Ubuntu-24.04');
  await expect(page.locator('#environmentInventoryOutput script')).toHaveCount(0);
});
