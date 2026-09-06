// ASP.NET Core UseReactDevelopmentServer assigns PORT and waits for this
// exact stdout text before proxying browser requests to the Vite server.
const { spawn } = require("child_process");
const path = require("path");

const port = process.env.PORT || "3000";
const viteBin = path.resolve(__dirname, "../node_modules/vite/bin/vite.js");

process.stdout.write("Starting the development server\n");

const child = spawn(
  process.execPath,
  [viteBin, "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
  {
    stdio: "inherit",
    env: process.env,
    cwd: path.resolve(__dirname, ".."),
  }
);

const shutdown = (signal) => {
  if (!child.killed) {
    child.kill(signal);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
