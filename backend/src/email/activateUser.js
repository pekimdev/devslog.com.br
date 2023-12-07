const database = require("src/infra/models");
const jwt = require("jsonwebtoken");

const activateUser = (request, response) => {
  const { token } = request.query;

  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) {
      return response
        .status(401)
        .send({ message: `token is invalid or expired ${err.message}` });
    }

    const { id, username, email } = decoded;
    const result = await database.Users.update(
      { authenticated: true },
      {
        where: {
          id: id,
        },
      },
    );
    if (!result) {
      return response.status(401).send({ message: "update failed" });
    }

    return response.status(200).send(`<font face="arial">
        <em>
            <h2 style="color: green">Account activated successfully!</h2>
            <h3>your username: ${username}</h3>
            <h3>your email: ${email}</h3>
        </em>
    </font>`);
  });
};
module.exports = activateUser;
