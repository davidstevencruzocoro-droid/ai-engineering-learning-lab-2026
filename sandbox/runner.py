import subprocess
import sys
import tempfile
from pathlib import Path


TIMEOUT_SECONDS = 8
OUTPUT_LIMIT = 12_000
LANGUAGES = {"javascript", "python", "java", "sql"}


def execute(language, source):
    if language not in LANGUAGES:
        print("Lenguaje no permitido.", file=sys.stderr)
        return 2

    command = {
        "javascript": ["node", "-"],
        "python": ["python3", "-"],
        "sql": ["sqlite3", "-batch", "-bail", ":memory:"],
    }
    if language == "java":
        with tempfile.TemporaryDirectory(prefix="ai-lab-") as workdir:
            source_file = Path(workdir) / "Main.java"
            source_file.write_text(source, encoding="utf-8")
            result = run(["java", "-Xms32m", "-Xmx256m", str(source_file)])
            return result
    return run(command[language], input_text=source)


def run(command, input_text=""):
    try:
        result = subprocess.run(
            command,
            input=input_text,
            text=True,
            capture_output=True,
            timeout=TIMEOUT_SECONDS,
            cwd="/tmp",
            env={
                "HOME": "/tmp",
                "TMPDIR": "/tmp",
                "PATH": "/usr/local/bin:/usr/bin:/bin",
                "LANG": "C.UTF-8",
            },
            check=False,
        )
    except subprocess.TimeoutExpired as error:
        stdout = error.stdout or ""
        stderr = error.stderr or ""
        if isinstance(stdout, bytes):
            stdout = stdout.decode("utf-8", errors="replace")
        if isinstance(stderr, bytes):
            stderr = stderr.decode("utf-8", errors="replace")
        write_output(stdout, stderr, "El programa superó el límite de 8 segundos.")
        return 124
    except OSError as error:
        print(f"No se pudo iniciar el intérprete: {error}", file=sys.stderr)
        return 127

    write_output(result.stdout, result.stderr)
    return result.returncode


def write_output(stdout, stderr, extra_error=""):
    stdout = stdout[:OUTPUT_LIMIT]
    stderr = stderr[:OUTPUT_LIMIT]
    if stdout:
        sys.stdout.write(stdout)
        if not stdout.endswith("\n"):
            sys.stdout.write("\n")
    if stderr:
        sys.stderr.write(stderr)
        if not stderr.endswith("\n"):
            sys.stderr.write("\n")
    if extra_error:
        sys.stderr.write(extra_error + "\n")


def main():
    if len(sys.argv) != 2:
        print("Se requiere un perfil de lenguaje.", file=sys.stderr)
        return 2
    source = sys.stdin.read()
    return execute(sys.argv[1], source)


if __name__ == "__main__":
    raise SystemExit(main())
