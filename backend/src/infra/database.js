const client = require("./models");

async function applyMigrations() {
  try {
    // Sincronize o modelo com o banco de dados (isso cria a tabela se não existir)
    await client.sequelize.sync();

    console.log("Migrações aplicadas com sucesso.");
  } catch (error) {
    console.error("Erro ao aplicar migrações:", error);
  } finally {
    // Feche a conexão com o banco de dados
    await client.sequelize.close();
  }
}

module.exports = {
  applyMigrations,
};
