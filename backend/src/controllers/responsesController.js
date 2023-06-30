const db = require('../db/models');
const { v4: uuid } = require('uuid');
const jwt = require('jsonwebtoken')

const responsesController = {

  getResponsesByAuthor: async (req, res) => {
    const { author } = req.params;
    try{
      const responses = await db.Responses.findAll({ 
        where: { author: author }
      });
      return res.status(200).json(responses);
    }
    catch(err){
      return res.status(400).json({error: err.message});
    }
  },

  createResponse: async(req, res) => {

  const id = uuid();

  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.SECRET_KEY, async(err, decoded) => {

    if(err){
      return res.status(500).json({error: err});
    }

    const { commentId } = req.params;
    const { content } = req.body;
  try{
    await db.Responses.create({ id: id, author: decoded.username, content: content, likes: 0, commentId: commentId, userId: decoded.id });

    return res.status(201).json('response created successfully')
  }
   catch(err){
      return res.status(400).json({error: err.message});
    }
  })

},

  updateResponse: async(req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  
  try{
    await db.Users.update({content: content}, {
        where: {id: id}
    });

    return res.status(200).json('response updated successfully');
  }
  catch(err) {
    return res.status(400).json({error: err.message});
  }
  },

  deleteResponse: async(req, res) => {
    const { id } = req.params;

    try{
      await db.Responses.destroy({
        where: { id: id }
      })
      return res.status(201).json('response deleted successfully');
    }
    catch(err) {
      return res.status(400).json({error: err.message});
    }
  },


}

module.exports = responsesController;