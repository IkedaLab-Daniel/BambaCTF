import express from "express";
import { nanoid } from "nanoid";
import path from "path";
import fs from "fs";
import os from "os";
import { execFile } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const instanceTtlMs = 20 * 60 * 1000; // 20 minutes

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const instances = new Map();

function createFlag(id) {
  return `FLAG{${id}-hidden-in-html}`;
}

const sandboxRoot = path.join(os.tmpdir(), "bambactf-sandbox");

function ensureSandbox(id) {
  fs.mkdirSync(sandboxRoot, { recursive: true });
  const instanceDir = path.join(sandboxRoot, id);
  if (!fs.existsSync(instanceDir)) {
    fs.mkdirSync(instanceDir, { recursive: true });
    fs.writeFileSync(
      path.join(instanceDir, "readme.txt"),
      "Welcome to the sandbox. Try ls, cat readme.txt, and pwd.\n",
      "utf8"
    );
    fs.writeFileSync(
      path.join(instanceDir, "notes.txt"),
      "The flag is not stored in these files. Check the page source.\n",
      "utf8"
    );
  }
  return instanceDir;
}

function cleanupSandbox(instance) {
  if (!instance?.sandboxPath) {
    return;
  }
  try {
    fs.rmSync(instance.sandboxPath, { recursive: true, force: true });
  } catch {
    // Ignore cleanup failures in prototype.
  }
}

function cleanupExpiredInstances() {
  const now = Date.now();
  for (const [id, instance] of instances.entries()) {
    if (instance.expiresAt <= now) {
      cleanupSandbox(instance);
      instances.delete(id);
    }
  }
}

setInterval(cleanupExpiredInstances, 60 * 1000).unref();

app.post("/api/instances", (req, res) => {
  cleanupExpiredInstances();
  const id = nanoid(10);
  const createdAt = Date.now();
  const expiresAt = createdAt + instanceTtlMs;
  const flag = createFlag(id);
  const sandboxPath = ensureSandbox(id);

  instances.set(id, { id, flag, createdAt, expiresAt, sandboxPath });

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  res.json({
    id,
    url: `${baseUrl}/instance/${id}`,
    expiresAt
  });
});

app.get("/api/instances/:id", (req, res) => {
  const instance = instances.get(req.params.id);
  if (!instance) {
    return res.status(404).json({ error: "Instance not found" });
  }
  if (instance.expiresAt <= Date.now()) {
    instances.delete(req.params.id);
    return res.status(410).json({ error: "Instance expired" });
  }

  res.json({
    id: instance.id,
    expiresAt: instance.expiresAt
  });
});

app.post("/api/instances/:id/submit", (req, res) => {
  const instance = instances.get(req.params.id);
  if (!instance) {
    return res.status(404).json({ error: "Instance not found" });
  }
  if (instance.expiresAt <= Date.now()) {
    cleanupSandbox(instance);
    instances.delete(req.params.id);
    return res.status(410).json({ error: "Instance expired" });
  }

  const submittedFlag = typeof req.body?.flag === "string" ? req.body.flag.trim() : "";
  const correct = submittedFlag === instance.flag;
  res.json({ correct });
});

app.post("/api/instances/:id/command", (req, res) => {
  const instance = instances.get(req.params.id);
  if (!instance) {
    return res.status(404).json({ error: "Instance not found" });
  }
  if (instance.expiresAt <= Date.now()) {
    cleanupSandbox(instance);
    instances.delete(req.params.id);
    return res.status(410).json({ error: "Instance expired" });
  }

  const raw = typeof req.body?.command === "string" ? req.body.command.trim() : "";
  if (!raw) {
    return res.status(400).json({ error: "Command is required" });
  }
  if (raw.length > 200) {
    return res.status(400).json({ error: "Command too long" });
  }

  const parts = raw.split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1);

  const validateCommand = () => {
    if (cmd === "pwd" || cmd === "whoami" || cmd === "date") {
      return args.length === 0 ? { cmd, args: [] } : null;
    }
    if (cmd === "uname") {
      if (args.length === 0) {
        return { cmd, args: [] };
      }
      if (args.length === 1 && args[0] === "-a") {
        return { cmd, args: ["-a"] };
      }
      return null;
    }
    if (cmd === "ls") {
      const allowed = new Set(["-l", "-a", "-la", "."]);
      if (args.length === 0) {
        return { cmd, args: [] };
      }
      if (args.every((arg) => allowed.has(arg))) {
        return { cmd, args };
      }
      return null;
    }
    if (cmd === "cat") {
      if (args.length !== 1) {
        return null;
      }
      const filename = args[0];
      if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
        return null;
      }
      const filePath = path.join(instance.sandboxPath, filename);
      if (!filePath.startsWith(instance.sandboxPath)) {
        return null;
      }
      if (!fs.existsSync(filePath)) {
        return null;
      }
      return { cmd, args: [filename] };
    }
    return null;
  };

  const validated = validateCommand();
  if (!validated) {
    return res.status(400).json({ error: "Command not allowed" });
  }

  execFile(
    validated.cmd,
    validated.args,
    { cwd: instance.sandboxPath, timeout: 2000, maxBuffer: 100 * 1024 },
    (error, stdout, stderr) => {
      if (error) {
        const exitCode = typeof error.code === "number" ? error.code : 1;
        const message = error.killed ? "Command timed out." : error.message;
        return res.json({
          stdout: stdout || "",
          stderr: stderr || message,
          exitCode
        });
      }
      res.json({ stdout: stdout || "", stderr: stderr || "", exitCode: 0 });
    }
  );
});

app.get("/instance/:id", (req, res) => {
  const instance = instances.get(req.params.id);
  if (!instance) {
    return res.status(404).send("Instance not found");
  }
  if (instance.expiresAt <= Date.now()) {
    cleanupSandbox(instance);
    instances.delete(req.params.id);
    return res.status(410).send("Instance expired");
  }

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>BambaCTF Instance</title>
    <style>
      body {
        font-family: "Trebuchet MS", "Segoe UI", sans-serif;
        background: radial-gradient(circle at top, #fff2cc, #f5f5f5);
        color: #222;
        margin: 0;
        padding: 48px 24px;
      }
      .card {
        max-width: 720px;
        margin: 0 auto;
        background: #fff;
        border-radius: 18px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        padding: 32px;
      }
      h1 {
        font-size: 2.2rem;
        margin-bottom: 12px;
      }
      .hint {
        font-size: 1.1rem;
        color: #555;
      }
      .timer {
        margin-top: 24px;
        font-weight: 700;
        color: #b34700;
      }
      #flag-form {
        margin-top: 28px;
        display: grid;
        gap: 10px;
        font-size: 0.95rem;
      }
      .flag-row {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }
      #flag-input {
        flex: 1 1 240px;
        padding: 10px 12px;
        border-radius: 10px;
        border: 1px solid #d0c6b3;
        font-size: 1rem;
      }
      #flag-form button {
        padding: 10px 18px;
        border: none;
        border-radius: 10px;
        background: #b34700;
        color: #fff;
        font-weight: 700;
        cursor: pointer;
      }
      #flag-form button:hover {
        background: #8c3600;
      }
      .result {
        margin: 0;
        font-weight: 700;
        color: #666;
      }
      .result.good {
        color: #1f7a1f;
      }
      .result.bad {
        color: #b00020;
      }
      .terminal {
        margin-top: 32px;
        background: #14110f;
        color: #f6f2e8;
        border-radius: 12px;
        padding: 18px;
        font-family: "Courier New", monospace;
      }
      .terminal h2 {
        margin: 0 0 12px;
        font-size: 1rem;
        color: #f0c77a;
      }
      .terminal-output {
        background: #0d0b0a;
        border-radius: 10px;
        padding: 12px;
        min-height: 140px;
        max-height: 220px;
        overflow-y: auto;
        white-space: pre-wrap;
        line-height: 1.4;
      }
      .terminal-form {
        margin-top: 12px;
        display: flex;
        gap: 8px;
      }
      .terminal-form input {
        flex: 1 1 auto;
        padding: 10px 12px;
        border-radius: 8px;
        border: 1px solid #3d2f22;
        background: #1e1814;
        color: #f6f2e8;
      }
      .terminal-form button {
        padding: 10px 16px;
        border: none;
        border-radius: 8px;
        background: #f0c77a;
        color: #1b120d;
        font-weight: 700;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Welcome to your instance</h1>
      <p class="hint">There is a hidden flag somewhere in this page. Happy hunting.</p>
      <p class="timer" id="timer">Instance expires in 20:00</p>
      <form id="flag-form">
        <label for="flag-input">Submit flag</label>
        <div class="flag-row">
          <input id="flag-input" name="flag" type="text" autocomplete="off" placeholder="FLAG{...}" />
          <button type="submit">Check</button>
        </div>
        <p id="flag-result" class="result"></p>
      </form>
      <div class="terminal">
        <h2>Restricted Terminal</h2>
        <div class="terminal-output" id="terminal-output"></div>
        <form class="terminal-form" id="terminal-form">
          <input id="terminal-input" type="text" autocomplete="off" placeholder="ls -la" />
          <button type="submit">Run</button>
        </form>
      </div>
    </div>
    <!-- ${instance.flag} -->
    <script>
      const expiresAt = ${instance.expiresAt};
      const timer = document.getElementById('timer');
      const form = document.getElementById('flag-form');
      const input = document.getElementById('flag-input');
      const result = document.getElementById('flag-result');
      const terminalForm = document.getElementById('terminal-form');
      const terminalInput = document.getElementById('terminal-input');
      const terminalOutput = document.getElementById('terminal-output');
      const promptUser = 'eternal_ice-picoctf';
      const promptHost = 'webshell';
      const promptPath = '~';
      const prompt = promptUser + '@' + promptHost + ':' + promptPath + '$ ';
      let cachedEntries = null;
      let cachedAt = 0;
      const cacheTtlMs = 5000;
      const tick = () => {
        const remaining = Math.max(0, expiresAt - Date.now());
        const minutes = String(Math.floor(remaining / 60000)).padStart(2, '0');
        const seconds = String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0');
        timer.textContent = remaining > 0 ? 'Instance expires in ' + minutes + ':' + seconds : 'Instance expired';
        if (remaining === 0) {
          clearInterval(interval);
        }
      };
      const interval = setInterval(tick, 1000);
      tick();
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        result.textContent = 'Checking...';
        result.className = 'result';
        try {
          const response = await fetch('/api/instances/${instance.id}/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ flag: input.value })
          });
          const payload = await response.json();
          if (!response.ok) {
            result.textContent = payload.error || 'Submission failed.';
            result.className = 'result bad';
            return;
          }
          if (payload.correct) {
            result.textContent = 'Correct flag! Nice work.';
            result.className = 'result good';
          } else {
            result.textContent = 'Incorrect flag. Keep trying.';
            result.className = 'result bad';
          }
        } catch (err) {
          result.textContent = 'Network error. Try again.';
          result.className = 'result bad';
        }
      });
      const appendTerminal = (text) => {
        terminalOutput.textContent += text;
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
      };
      const appendPrompt = () => {
        if (terminalOutput.textContent && !terminalOutput.textContent.endsWith('\\n')) {
          terminalOutput.textContent += '\\n';
        }
        appendTerminal(prompt);
      };
      appendTerminal('Allowed: ls, cat, pwd, whoami, date, uname\\n');
      appendPrompt();
      const fetchEntries = async () => {
        const now = Date.now();
        if (cachedEntries && now - cachedAt < cacheTtlMs) {
          return cachedEntries;
        }
        try {
          const response = await fetch('/api/instances/${instance.id}/command', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: 'ls' })
          });
          const payload = await response.json();
          if (!response.ok || !payload.stdout) {
            return [];
          }
          cachedEntries = payload.stdout
            .split('\\n')
            .map((line) => line.trim())
            .filter(Boolean);
          cachedAt = now;
          return cachedEntries;
        } catch (err) {
          return [];
        }
      };
      const tryAutocomplete = async () => {
        const current = terminalInput.value;
        const match = current.match(/^cat\\s+([a-zA-Z0-9._-]*)$/);
        if (!match) {
          return;
        }
        const prefix = match[1];
        const entries = await fetchEntries();
        const candidates = entries.filter((entry) => entry.startsWith(prefix));
        if (candidates.length === 1) {
          terminalInput.value = 'cat ' + candidates[0];
        }
      };
      terminalInput.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
          event.preventDefault();
          tryAutocomplete();
        }
      });
      terminalForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const command = terminalInput.value.trim();
        if (!command) {
          return;
        }
        appendTerminal(command + '\\n');
        terminalInput.value = '';
        terminalInput.disabled = true;
        try {
          const response = await fetch('/api/instances/${instance.id}/command', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command })
          });
          const payload = await response.json();
          if (!response.ok) {
            appendTerminal((payload.error || 'Command failed.') + '\\n');
          } else {
            if (payload.stdout) {
              appendTerminal(payload.stdout);
            }
            if (payload.stderr) {
              appendTerminal(payload.stderr + '\\n');
            }
            if (!payload.stdout && !payload.stderr) {
              appendTerminal('(no output)\\n');
            }
          }
        } catch (err) {
          appendTerminal('Network error.\\n');
        } finally {
          appendPrompt();
          terminalInput.disabled = false;
          terminalInput.focus();
        }
      });
    </script>
  </body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

app.listen(port, () => {
  console.log(`BambaCTF prototype running on http://localhost:${port}`);
});
