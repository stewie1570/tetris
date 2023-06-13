const { execSync } = require("child_process");

try {
  execSync("playwright test", { stdio: "inherit" });
} finally {
  execSync("pkill dotnet", { stdio: "inherit" });
}
