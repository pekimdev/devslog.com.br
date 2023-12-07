const database = require("src/infra/models");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");

const postsController = {
  getAllPosts: async (request, response) => {
    try {
      const posts = await database.Posts.findAll();
      return response.status(200).json(posts);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },

  getPostsByAuthor: async (request, response) => {
    const { author } = request.params;

    try {
      const posts = await database.Posts.findAll({
        where: { author: author },
      });

      if (posts.length === 0) {
        return response.status(404).json({ message: "No posts found" });
      }
      return response.status(200).json(posts);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },

  postSelected: async (request, response) => {
    const { author, id } = request.params;

    try {
      const post = await database.Posts.findOne({
        where: { author: author, id: id },
        include: {
          association: "comments",
          include: { association: "responses" },
        },
      });

      if (!post) {
        return response.status(404).json({ error: "No post found" });
      }

      return response.status(200).json(post);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },

  createPost: async (request, response) => {
    const id = uuid();

    const authHeader = request.headers["authorization"];
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        return response.status(500).json({ error: err });
      }

      const { title, content } = request.body;
      try {
        await database.Posts.create({
          id: id,
          author: decoded.username,
          title: title,
          content: content,
          likes: 0,
          userId: decoded.id,
        });

        return response
          .status(201)
          .json({ message: "content created successfully" });
      } catch (err) {
        return response.status(400).json({ error: err.message });
      }
    });
  },

  updatePost: async (request, response) => {
    const { id } = request.params;
    const { title, content } = request.body;
    try {
      await database.Users.update(
        { title: title, content: content },
        {
          where: { id: id },
        },
      );

      return response.status(200).json("post updated successfully");
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },

  deletePost: async (request, response) => {
    const { id } = request.params;

    try {
      await database.Posts.destroy({ where: { id: id } });

      return response
        .status(200)
        .json({ message: "post deleted successfully" });
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },
};

module.exports = postsController;
