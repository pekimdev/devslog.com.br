const express = require('express');
const commentRoutes = express.Router();

const commentsController = require('../controllers/commentsController');
const tokenVerify = require('../middleware/tokenVerify');




commentRoutes.get('/comments/:author', commentsController.getCommentsByAuthor);
commentRoutes.post('/comments/:postId', tokenVerify, commentsController.createComment);
commentRoutes.put('/comments/:id', tokenVerify, commentsController.updateComment);
commentRoutes.delete('/comments/:id', tokenVerify, commentsController.createComment);


module.exports = commentRoutes;