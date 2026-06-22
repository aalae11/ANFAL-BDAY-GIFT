import { spawn } from "node:child_process";

const nextArgs = ["dev"];
const incomingArgs = process.argv.slice(2);

for (let index = 0; index < incomingArgs.length; index += 1) {
  const arg = incomingArgs[index];
  nextArgs.push(arg === "--host" ? "--hostname" : arg);
}

const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", ...nextArgs], {
  stdio: "inherit"
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
