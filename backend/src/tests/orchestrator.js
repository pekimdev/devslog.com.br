const database = require("src/infra/database.js");

const webServerUrl = "http://localhost:3000";

if (process.env.NODE_ENV !== "test") {
  throw new Error({
    message: "Orchestrator should only be used in tests.",
  });
}

async function runMigrations() {
  await database.applyMigrations();
}

module.exports = {
  webServerUrl,
  runMigrations,
};
