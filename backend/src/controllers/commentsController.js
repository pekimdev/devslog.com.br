const db = require('../db/models');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');

const commentsController = {

getCommentsByAuthor: async(req, res) => {
  const { author } = req.params;

  try{
    const comments = await db.Comments.findAll({
      where: {author: author}
    });
    if(comments.length === 0) {
      return res.status(404).json({error: 'Comments not found'});
    }

    return res.status(200).json(comments);
  }
  catch(err) {
    return res.status(400).json({error: err.message});
  }
},

createComment: async(req, res) => {

  const id = uuid();

  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.SECRET_KEY, async(err, decoded) => {
    if(err){
      return res.status(500).json({error: err});
    }
  const { postId } = req.params;
  const { content } = req.body;

  try{
    const row = await db.Comments.create({ id: id, author: decoded.username, content: content, likes: 0, postId: postId, userId: decoded.id });

    return res.status(200).json(row.id);
  }
  catch(err){
    return res.status(400).json({error: err.message});
  }

});
},

updateComment: async(req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  
  try{
    await db.Users.update({content: content}, {
        where: {id: id}
    });

    return res.status(200).json('comment updated successfully');
  }
  catch(err){
    return res.status(400).json({error: err.message});
  }
},

deleteComment: async(req, res) => {
  const { id } = req.params;

  try{
    await db.Posts.destroy({where: { id: id }});
      
    return res.status(200).json({message: 'comment deleted successfully'})
  }
  catch(err){
    return res.status(400).json({error: err.message});
  }
},

}

module.exports = commentsController;