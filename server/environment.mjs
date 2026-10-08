import { spawn } from 'node:child_process';
import { access, readdir, stat } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const TOOL_PROBES = [
  { id: 'docker', label: 'Docker', command: 'docker', args: ['--version'] },
  { id: 'git', label: 'Git', command: 'git', args: ['--version'] },
  { id: 'node', label: 'Node.js', command: 'node', args: ['--version'] },
  { id: 'java', label: 'Java', command: 'java', args: ['--version'] },
  { id: 'maven', label: 'Maven', command: 'mvn', args: ['--version'] },
  { id: 'gradle', label: 'Gradle', command: 'gradle', args: ['--version'] },
  { id: 'python', label: 'Python', command: 'python', args: ['--version'] },
  { id: 'python3', label: 'Python 3', command: 'python3', args: ['--version'] },
  { id: 'python-launcher', label: 'Python Launcher', command: 'py', args: ['--version'] },
  { id: 'postgresql', label: 'PostgreSQL CLI', command: 'psql', args: ['--version'] },
  { id: 'mysql', label: 'MySQL CLI', command: 'mysql', args: ['--version'] },
  { id: 'ollama', label: 'Ollama', command: 'ollama', args: ['--version'] },
  { id: 'n8n', label: 'n8n', command: 'n8n', args: ['--version'] },
  { id: 'vscode', label: 'VS Code', command: 'code', args: ['--version'] },
  { id: 'github-cli', label: 'GitHub CLI', command: 'gh', args: ['--version'] },
  { id: 'powershell', label: 'PowerShell', command: 'powershell', args: ['-NoProfile', '-Command', '$PSVersionTable.PSVersion.ToString()'] }
];

const PROJECT_MARKERS = new Map([
  ['package.json', 'Node.js'],
  ['pom.xml', 'Java / Maven'],
  ['build.gradle', 'Java / Gradle'],
  ['build.gradle.kts', 'Java / Gradle'],
  ['pyproject.toml', 'Python'],
  ['requirements.txt', 'Python'],
  ['Cargo.toml', 'Rust'],
  ['go.mod', 'Go'],
  ['Dockerfile', 'Docker']
]);

const MAX_CAPTURED_OUTPUT = 12_000;
const PROBE_TIMEOUT_MS = 3_000;
const PORT_PROBE_TIMEOUT_MS = 8_000;
const WINDOWS_EXTENSIONS = (process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM')
  .split(';')
  .filter(Boolean);

async function resolveExecutable(command) {
  const pathValue = process.env.PATH || process.env.Path || '';
  const directories = pathValue.split(path.delimiter).filter(Boolean);
  const hasExtension = path.extname(command) !== '';
  const candidates = hasExtension
    ? [command]
    : process.platform === 'win32'
      ? WINDOWS_EXTENSIONS.map((extension) => `${command}${extension.toLowerCase()}`)
      : [command];

  for (const directory of directories) {
    for (const candidate of candidates) {
      const executable = path.join(directory, candidate);
      try {
        await access(executable);
        return executable;
      } catch {
        continue;
      }
    }
  }

  return null;
}

function decodeOutput(buffer) {
  if (buffer.includes(0)) return buffer.toString('utf16le').replace(/\0/g, '');
  return buffer.toString('utf8');
}

function runProcess(command, args, timeoutMs = PROBE_TIMEOUT_MS) {
  return new Promise((resolve) => {
    let child;
    try {
      child = spawn(command, args, {
        shell: false,
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'pipe']
      });
    } catch (error) {
      resolve({ code: null, stdout: '', stderr: error.message, error });
      return;
    }

    const stdout = [];
    const stderr = [];
    let outputLength = 0;
    let settled = false;
    const capture = (target, chunk) => {
      if (outputLength >= MAX_CAPTURED_OUTPUT) return;
      const remaining = MAX_CAPTURED_OUTPUT - outputLength;
      const data = chunk.subarray(0, remaining);
      target.push(data);
      outputLength += data.length;
    };
    child.stdout.on('data', (chunk) => capture(stdout, chunk));
    child.stderr.on('data', (chunk) => capture(stderr, chunk));

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill();
      resolve({
        code: null,
        stdout: decodeOutput(Buffer.concat(stdout)),
        stderr: 'El diagnóstico excedió el límite de tiempo.',
        timedOut: true
      });
    }, timeoutMs);

    child.once('error', (error) => {
      clearTimeout(timer);
      if (settled) return;
      settled = true;
      resolve({
        code: null,
        stdout: decodeOutput(Buffer.concat(stdout)),
        stderr: error.message,
        error
      });
    });
    child.once('close', (code) => {
      clearTimeout(timer);
      if (settled) return;
      settled = true;
      resolve({
        code,
        stdout: decodeOutput(Buffer.concat(stdout)),
        stderr: decodeOutput(Buffer.concat(stderr))
      });
    });
  });
}

async function probeTool(tool) {
  const executable = await resolveExecutable(tool.command);
  if (!executable) {
    return { id: tool.id, label: tool.label, available: false, version: null };
  }

  if (tool.id.startsWith('python') && executable.toLowerCase().includes('\\windowsapps\\')) {
    return {
      id: tool.id,
      label: tool.label,
      available: false,
      version: null,
      note: 'Solo se encontró el alias de Microsoft Store; no se confirmó un intérprete instalado.'
    };
  }

  const command = process.platform === 'win32' && /\.(cmd|bat)$/i.test(executable)
    ? 'cmd.exe'
    : executable;
  const args = command === 'cmd.exe'
    ? ['/d', '/s', '/c', `${tool.command} ${tool.args.join(' ')}`]
    : tool.args;
  const result = await runProcess(command, args);
  const version = result.stdout.split(/\r?\n/).map((line) => line.trim()).find(Boolean) || null;

  return {
    id: tool.id,
    label: tool.label,
    available: result.code === 0,
    version: result.code === 0 ? version : null,
    ...(result.timedOut ? { note: 'El diagnóstico excedió el límite de tiempo.' } : {}),
    ...(result.code !== 0 && !result.timedOut
      ? { note: result.stderr.trim().slice(0, 240) || 'El comando de versión no pudo confirmarse.' }
      : {})
  };
}

async function inspectWsl() {
  if (process.platform !== 'win32') return { available: false, distributions: [] };
  const executable = await resolveExecutable('wsl.exe');
  if (!executable) return { available: false, distributions: [] };
  const result = await runProcess(executable, ['--list', '--quiet']);
  const distributions = result.stdout.split(/\r?\n/)
    .map((line) => line.replace(/\0/g, '').trim())
    .filter(Boolean);
  return { available: result.code === 0, distributions };
}

async function inspectDocker() {
  const executable = await resolveExecutable('docker');
  if (!executable) return { available: false, containers: [] };
  const result = await runProcess(executable, ['ps', '--format', '{{.Names}}\t{{.Image}}\t{{.Ports}}']);
  if (result.code !== 0) {
    return { available: false, containers: [], note: result.stderr.trim().slice(0, 240) };
  }
  const containers = result.stdout.split(/\r?\n/).filter(Boolean).map((line) => {
    const [name, image, ports = ''] = line.split('\t');
    return { name, image, ports };
  });
  return { available: true, containers };
}

async function inspectOllama() {
  const executable = await resolveExecutable('ollama');
  if (!executable) return { available: false, models: [] };
  const result = await runProcess(executable, ['list']);
  const models = result.code === 0
    ? result.stdout.split(/\r?\n/).slice(1).map((line) => line.trim().split(/\s+/)[0]).filter(Boolean)
    : [];
  return {
    available: result.code === 0,
    models: models.slice(0, 50),
    ...(!result.code ? { note: result.stderr.trim().slice(0, 240) } : {})
  };
}

async function inspectVscodeExtensions() {
  const executable = await resolveExecutable('code');
  if (!executable) return { available: false, extensions: [] };
  const command = process.platform === 'win32' && /\.(cmd|bat)$/i.test(executable)
    ? 'cmd.exe'
    : executable;
  const args = command === 'cmd.exe'
    ? ['/d', '/s', '/c', 'code --list-extensions --show-versions']
    : ['--list-extensions', '--show-versions'];
  const result = await runProcess(command, args);
  return {
    available: result.code === 0,
    extensions: result.code === 0
      ? result.stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).slice(0, 200)
      : []
  };
}

async function inspectPorts() {
  if (process.platform === 'win32') {
    const result = await runProcess('powershell.exe', [
      '-NoLogo', '-NoProfile', '-NonInteractive', '-Command',
      "$ErrorActionPreference='SilentlyContinue'; Get-NetTCPConnection -State Listen | Select-Object -First 200 LocalAddress,LocalPort,OwningProcess | ForEach-Object { $process=Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue; [PSCustomObject]@{address=$_.LocalAddress;port=$_.LocalPort;process=$process.ProcessName} } | ConvertTo-Json -Compress"
    ], PORT_PROBE_TIMEOUT_MS);
    if (result.code !== 0) {
      return { available: false, ports: [], note: result.stderr.trim() || 'No se pudo consultar Get-NetTCPConnection.' };
    }
    try {
      const parsed = JSON.parse(result.stdout);
      const ports = (Array.isArray(parsed) ? parsed : [parsed])
        .map(({ address, port, process: processName }) => ({
          address: String(address),
          port: Number(port),
          process: String(processName || 'unknown')
        }));
      return { available: true, ports };
    } catch {
      return { available: false, ports: [], note: 'La respuesta de PowerShell no tenía un formato JSON válido.' };
    }
  }

  const executable = await resolveExecutable('ss');
  if (!executable) return { available: false, ports: [], note: 'No se encontró el comando ss.' };
  const result = await runProcess(executable, ['-ltn'], PORT_PROBE_TIMEOUT_MS);
  if (result.code !== 0) {
    return { available: false, ports: [], note: result.stderr.trim() || 'No se pudieron consultar sockets en escucha.' };
  }
  const ports = result.stdout.split(/\r?\n/).slice(1).flatMap((line) => {
    const localAddress = line.trim().split(/\s+/)[3];
    const match = localAddress?.match(/^(.*):(\d+)$/);
    return match ? [{ address: match[1], port: Number(match[2]), process: 'unknown' }] : [];
  });
  return { available: true, ports };
}

async function inspectProjects() {
  const root = process.cwd();
  const candidates = [{ directory: root, relativePath: '.' }];
  try {
    const entries = await readdir(root, { withFileTypes: true });
    for (const entry of entries.filter((item) => item.isDirectory() && !item.isSymbolicLink()).slice(0, 100)) {
      candidates.push({
        directory: path.join(root, entry.name),
        relativePath: entry.name
      });
    }
  } catch (error) {
    return { scope: 'workspace root and immediate child folders', projects: [], note: error.message };
  }

  const projects = [];
  for (const candidate of candidates) {
    const technologies = [];
    for (const [marker, technology] of PROJECT_MARKERS) {
      try {
        const markerPath = path.join(candidate.directory, marker);
        await stat(markerPath);
        if (!technologies.includes(technology)) technologies.push(technology);
      } catch {
        continue;
      }
    }
    if (technologies.length > 0) {
      projects.push({ path: candidate.relativePath, technologies });
    }
  }
  return { scope: 'workspace root and immediate child folders only', projects };
}

function detectTerminal() {
  if (process.env.TERM_PROGRAM) return process.env.TERM_PROGRAM;
  if (process.env.WT_SESSION) return 'Windows Terminal';
  if (process.platform === 'win32' && process.env.PSModulePath) return 'PowerShell';
  if (process.env.ComSpec) return 'Command Prompt';
  return process.env.SHELL || 'No se pudo determinar';
}

export async function getEnvironmentSnapshot() {
  const [tools, wsl, docker, ollama, vscode, portInventory, projects] = await Promise.all([
    Promise.all(TOOL_PROBES.map(probeTool)),
    inspectWsl(),
    inspectDocker(),
    inspectOllama(),
    inspectVscodeExtensions(),
    inspectPorts(),
    inspectProjects()
  ]);
  const shellTools = tools.filter((tool) => ['node', 'python', 'java'].includes(tool.id));
  const vscodeTool = tools.find((tool) => tool.id === 'vscode');
  const terminalTool = tools.find((tool) => tool.id === 'powershell');

  return {
    inspectedAt: new Date().toISOString(),
    system: {
      platform: os.type() === 'Windows_NT' ? 'Windows' : os.type(),
      version: os.release(),
      architecture: os.arch(),
      terminal: detectTerminal(),
      terminalVersion: terminalTool?.version || null,
      shellTools
    },
    tools,
    wsl,
    docker,
    ollama,
    vscode: {
      available: Boolean(vscodeTool?.available),
      version: vscodeTool?.version || null,
      extensionScanAvailable: vscode.available,
      extensions: vscode.extensions
    },
    githubCli: tools.find((tool) => tool.id === 'github-cli'),
    ports: portInventory.ports,
    portScanAvailable: portInventory.available,
    ...(portInventory.note ? { portScanNote: portInventory.note } : {}),
    projects: {
      workspaceName: path.basename(process.cwd()),
      ...projects
    },
    privacy: 'Este inventario se consulta en localhost. No se comparte con Ollama automáticamente.',
    scope: 'Solo se inspeccionan herramientas predefinidas, puertos en escucha y el workspace actual (hasta una carpeta de profundidad).'
  };
}
