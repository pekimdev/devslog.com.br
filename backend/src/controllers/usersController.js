const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");
const { compareSync } = require("bcrypt");
const sendEmail = require("src/email/sendEmail.js");

const database = require("src/infra/models");

const usersController = {
  getAllUsers: async (request, response) => {
    try {
      const rows = await database.Users.findAll();
      return response.status(200).json(rows);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },

  getUserByUsername: async (request, response) => {
    const { username } = request.params;
    try {
      const row = await database.Users.findOne({
        where: { username: username },
      });
      if (!row) {
        return response.status(404).json("user not found");
      }
      return response.status(200).json(row);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },

  createUser: async (request, response) => {
    const date = Math.floor(Date.now() / 1000);

    const id = uuid();

    const { username, email, password } = request.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const [row, created] = await database.Users.findOrCreate({
        where: {
          [Op.or]: [{ username: username }, { email: email }],
        },
        defaults: {
          id: uuid(),
          username: username,
          email: email,
          password: hashedPassword,
          authenticated: false,
        },
      });

      if (!created) {
        const user = await database.Users.findOne({
          where: {
            [Op.or]: [{ username: username }, { email: email }],
          },
        });
        const dateUser = Math.floor(user.createdAt.getTime() / 1000);

        if (date - dateUser > 1800 && !user.authenticated) {
          try {
            database.Users.destroy({
              where: { id: user.id },
            });
            return response.json({
              aviso:
                "A conta que já foi registrada com esse email ou nome não foi autenticada por um bom período, portanto a conta foi deletada. Tente novamente.",
            });
          } catch (err) {
            return response.json({ error: err.message });
          }
        }
        return response.status(400).json({ error: "user already exists" });
      }

      const token = jwt.sign(
        {
          id: row.id,
          username: username,
          email: email,
          authenticated: false,
        },
        process.env.SECRET_KEY,
        { expiresIn: "1h" },
      );

      sendEmail(token, username, row);
    } catch (err) {
      return response.status(500).json({ error: err.message });
    }
  },

  updateUser: async (request, response) => {
    const { id } = request.params;
    const { username, email, password } = request.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      await database.Users.update(
        { username: username, email: email, password: hashedPassword },
        {
          where: { id: id },
        },
      );

      return response.status(200).json("user updated successfully");
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },

  deleteUser: async (request, response) => {
    const { id } = request.params;
    try {
      await database.Users.destroy({ where: { id: id } });
      return response
        .status(200)
        .json({ message: "user deleted successfully" });
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },

  loginUser: async (request, response) => {
    const { email, password } = request.body;
    try {
      const result = await database.Users.findAll({ where: { email: email } });

      if (result.length === 0) {
        return response.status(404).json({ message: "invalid credentials" });
      }

      if (result.length === 1) {
        const passwordMatch = compareSync(password, result[0].password);

        if (!passwordMatch) {
          return response.status(400).json({ message: "invalid credentials." });
        }

        if (passwordMatch) {
          if (!result[0].authenticated) {
            return response
              .status(401)
              .json({ message: "Account not authenticated." });
          }
          const token = jwt.sign(
            {
              id: result[0].id,
              username: result[0].username,
              email: result[0].email,
              created_at: result[0].created_at,
            },
            process.env.SECRET_KEY,
            { expiresIn: "1h" },
          );

          response.set("authorization", `Bearer ${token}`);
          response
            .status(200)
            .json({ message: "token sent to header successfully" });
          return;
        }
      }
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },

  logoutUser: async (request, response) => {
    const authHeader = request.headers["authorization"];

    if (!authHeader) {
      return response.status(401).json({ message: "No token provided" });
    }

    if (!authHeader.includes("Bearer ")) {
      return response.status(401).json({ message: "Invalid Bearer" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRET_KEY, (err) => {
      if (err) {
        return response.status(401).json({ invalidToken: err });
      }
    });

    if (token) {
      response.set("authorization", "");
      response.status(200).json({ message: `User logged out.` });
      return;
    }
  },

  recoverUser: async (request, response) => {
    const { email, password } = request.body;
    try {
      const result = await database.Users.findAll({
        where: { email: email },
      });
      if (result.length === 0) {
        return response.status(400).json({ message: "email not found" });
      }

      const passwordMatch = compareSync(password, result[0].password);

      if (passwordMatch) {
        response.status(400).json({ message: `it is your current password.` });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const token = jwt.sign(
        { email: email, newPassword: hashedPassword },
        process.env.SECRET_KEY,
      );

      const mailOptionsRecover = {
        from: process.env.EMAIL,
        to: [process.env.EMAIL, email],
        subject: "Recuperação de conta",
        html: `  <h2>Olá!</h2>

                    <h3>Falta pouco para você trocar sua senha.</h3>

                    <p>Clica aqui para confirmar a troca da senha:</p><a href="http://localhost:3000/account-recovery?token=${token}">Confirmar nova senha.</a>`,
      };

      await transporter.sendMail(mailOptionsRecover);
      return response
        .status(200)
        .json({ message: "Email for account recovery sent successfully" });
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },
};

module.exports = usersController;
