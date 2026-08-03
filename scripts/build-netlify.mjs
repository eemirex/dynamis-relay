import { spawn } from "node:child_process";
import { mkdir, rename, rm } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const holdingRoot = ".netlify-server-only";
const serverPaths = [
  ["src/proxy.ts", `${holdingRoot}/proxy.ts`],
  ["src/app/api", `${holdingRoot}/api`],
  ["src/app/auth", `${holdingRoot}/auth`],
];
const moved = [];

await rm(holdingRoot, { recursive: true, force: true });
try {
  for (const [source, destination] of serverPaths) {
    await mkdir(dirname(destination), { recursive: true });
    try { await rename(source, destination); moved.push([source, destination]); }
    catch (error) { if (error?.code !== "ENOENT") throw error; }
  }
  const nextCli = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
  const exitCode = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [nextCli, "build"], {
      env: { ...process.env, NETLIFY_STATIC_EXPORT: "true" }, stdio: "inherit",
    });
    child.once("error", reject); child.once("exit", (code) => resolve(code ?? 1));
  });
  if (exitCode !== 0) process.exitCode = exitCode;
} finally {
  for (const [source, destination] of moved.reverse()) {
    await mkdir(dirname(source), { recursive: true }); await rename(destination, source);
  }
  await rm(holdingRoot, { recursive: true, force: true });
}
