const express = require('express');
const responseRoutes = express.Router();

const responsesController = require('../controllers/responsesController')

const tokenVerify = require('../middleware/tokenVerify');

responseRoutes.get('/responses/:author', responsesController.getResponsesByAuthor)
responseRoutes.post('/responses/:commentId', tokenVerify, responsesController.createResponse);
responseRoutes.put('/responses/:id', tokenVerify, responsesController.updateResponse);
responseRoutes.delete('/responses/:id', tokenVerify, responsesController.deleteResponse);


module.exports = responseRoutes;