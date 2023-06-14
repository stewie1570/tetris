const { execSync } = require("child_process");

try {
  execSync("playwright test", { stdio: "inherit" });
} finally {
  const linuxKillCommand = "pkill dotnet";
  const windowsKillCommand = "taskkill /IM dotnet.exe /F";
  const isWindows = process.platform === "win32";
  execSync(isWindows ? windowsKillCommand : linuxKillCommand, {
    stdio: "inherit",
  });
}
