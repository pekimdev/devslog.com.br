const orchestrator = require("../../../../orchestrator.js");
const { v4: uuid } = require("uuid");

beforeAll(async () => {
  await orchestrator.runMigrations();
});
test("should create user with valid data", async () => {
  const configMethod = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      id: uuid(),
      username: "validname",
      email: "validemail@example.com",
      password: "password",
    }),
  };

  const response = await fetch(
    `${orchestrator.webServerUrl}/register`,
    configMethod,
  );

  const responseBody = await response.json();

  expect(response.status).toBe(201);

  expect(responseBody).toStrictEqual({
    id: responseBody.id,
    username: "validname",
    email: "validemail@example.com",
    authenticated: false,
    createdAt: responseBody.createdAt,
    updatedAt: responseBody.updatedAt,
  });
});
