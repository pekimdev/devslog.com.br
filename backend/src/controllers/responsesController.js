const database = require("src/infra/models");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");

const responsesController = {
  getResponsesByAuthor: async (request, response) => {
    const { author } = request.params;
    try {
      const responses = await database.Responses.findAll({
        where: { author: author },
      });
      return response.status(200).json(responses);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },

  createResponse: async (request, response) => {
    const id = uuid();

    const authHeader = request.headers["authorization"];
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        return response.status(500).json({ error: err });
      }

      const { commentId } = request.params;
      const { content } = request.body;
      try {
        await database.Responses.create({
          id: id,
          author: decoded.username,
          content: content,
          likes: 0,
          commentId: commentId,
          userId: decoded.id,
        });

        return response.status(201).json("response created successfully");
      } catch (err) {
        return response.status(400).json({ error: err.message });
      }
    });
  },

  updateResponse: async (request, response) => {
    const { id } = request.params;
    const { content } = request.body;

    try {
      await database.Users.update(
        { content: content },
        {
          where: { id: id },
        },
      );

      return response.status(200).json("response updated successfully");
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },

  deleteResponse: async (request, response) => {
    const { id } = request.params;

    try {
      await database.Responses.destroy({
        where: { id: id },
      });
      return response.status(201).json("response deleted successfully");
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },
};

module.exports = responsesController;
