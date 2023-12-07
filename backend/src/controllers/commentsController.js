const database = require("src/infra/models");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");

const commentsController = {
  getCommentsByAuthor: async (request, response) => {
    const { author } = request.params;

    try {
      const comments = await database.Comments.findAll({
        where: { author: author },
      });
      if (comments.length === 0) {
        return response.status(404).json({ error: "Comments not found" });
      }

      return response.status(200).json(comments);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },

  createComment: async (request, response) => {
    const id = uuid();

    const authHeader = request.headers["authorization"];
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        return response.status(500).json({ error: err });
      }
      const { postId } = request.params;
      const { content } = request.body;

      try {
        const row = await database.Comments.create({
          id: id,
          author: decoded.username,
          content: content,
          likes: 0,
          postId: postId,
          userId: decoded.id,
        });

        return response.status(200).json(row.id);
      } catch (err) {
        return response.status(400).json({ error: err.message });
      }
    });
  },

  updateComment: async (request, response) => {
    const { id } = request.params;
    const { content } = request.body;

    try {
      await database.Users.update(
        { content: content },
        {
          where: { id: id },
        },
      );

      return response.status(200).json("comment updated successfully");
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },

  deleteComment: async (request, response) => {
    const { id } = request.params;

    try {
      await database.Posts.destroy({ where: { id: id } });

      return response
        .status(200)
        .json({ message: "comment deleted successfully" });
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },
};

module.exports = commentsController;
