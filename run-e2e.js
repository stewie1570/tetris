const { execSync } = require("child_process");

try {
  execSync("playwright test", { stdio: "inherit" });
  execSync("npm run stop-server", { stdio: "inherit" });
} catch (error) {
  execSync("npm run stop-server", { stdio: "inherit" });
  throw error;
}
