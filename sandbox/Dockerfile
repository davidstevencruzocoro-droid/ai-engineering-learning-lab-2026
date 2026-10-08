FROM node:22-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 default-jdk-headless sqlite3 \
  && rm -rf /var/lib/apt/lists/*

COPY runner.py /usr/local/bin/ai-lab-runner.py

ENTRYPOINT ["python3", "/usr/local/bin/ai-lab-runner.py"]
