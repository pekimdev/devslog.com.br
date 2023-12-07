const orchestrator = require("src/tests/orchestrator.js");

beforeAll(async () => {
  await orchestrator.runMigrations();
});

test("GET all users", async () => {
  const response = await fetch(`${orchestrator.webServerUrl}/users`);

  expect(response.status).toBe(200);
});
