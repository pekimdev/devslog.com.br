const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "process.env.EMAIL",
    pass: process.env.PASSWORD,
  },
});

async function sendEmail(token, username, row) {
  const mailOptionsCreate = {
    from: process.env.EMAIL,
    to: [process.env.EMAIL, email],
    subject: "Autenticação de conta",
    html: `  <h2>Olá, </h2><h2 style="color: green">${username}</h2>

                    <h3>Obrigado por registrar-se em meu site, você está perto de ativar a sua conta</h3>

                    <p>Clica aqui para ativar a sua conta:</p><a href="http://localhost:3000/account-activate?token=${token}">Ativar a minha conta</a>`,
  };
  try {
    await transporter.sendMail(mailOptionsCreate);
    response.status(201).json(row);
  } catch (err) {
    return response.status(500).json({ failedToSendEmail: err.message });
  }
}

module.exports = {
  sendEmail,
};
