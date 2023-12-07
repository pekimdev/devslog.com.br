const express = require("express");
const postRoutes = express.Router();

const tokenVerify = require("src/middleware/tokenVerify.js");

const postsController = require("src/controllers/postsController.js");

postRoutes.get("/posts", postsController.getAllPosts);
postRoutes.get("/posts/:author", postsController.getPostsByAuthor);
postRoutes.get("/posts/:author/:id", postsController.postSelected);
postRoutes.post("/publish", tokenVerify, postsController.createPost);
postRoutes.delete("/posts/:id", postsController.deletePost);

module.exports = postRoutes;
