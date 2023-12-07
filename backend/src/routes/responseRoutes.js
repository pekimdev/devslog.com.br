const express = require("express");
const responseRoutes = express.Router();

const responsesController = require("src/controllers/responsesController.js");

const tokenVerify = require("src/middleware/tokenVerify.js");

responseRoutes.get(
  "/responses/:author",
  responsesController.getResponsesByAuthor,
);
responseRoutes.post(
  "/responses/:commentId",
  tokenVerify,
  responsesController.createResponse,
);
responseRoutes.put(
  "/responses/:id",
  tokenVerify,
  responsesController.updateResponse,
);
responseRoutes.delete(
  "/responses/:id",
  tokenVerify,
  responsesController.deleteResponse,
);

module.exports = responseRoutes;
