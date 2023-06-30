const db = require('../db/models');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');

const postsController = {

  getAllPosts: async(req, res) => {
  
  try{
    const posts = await db.Posts.findAll();
    return res.status(200).json(posts);
  }
  catch(err) {
    return res.status(400).json({error: err.message});
  }
 },

 getPostsByAuthor: async(req, res) => {
  const { author } = req.params;

  try{
    const posts = await db.Posts.findAll({ 
      where: { author: author}
    });

    if(posts.length === 0) {
      return res.status(404).json({message: 'No posts found'})
    }
    return res.status(200).json(posts);
  }
  catch(err){
    return res.status(400).json({error: err.message})
  }

 },

 postSelected: async(req, res) => {
 
  const { author, id } = req.params;

  try{
    const post = await db.Posts.findOne({
      where: { author: author, id: id },
      include: { association: 'comments', 
        include: { association: 'responses'}},
    });

    if(!post){
      return res.status(404).json({error: 'No post found'});
    }

    return res.status(200).json(post);
  }
  catch(err){
    return res.status(400).json({error: err.message});
  }

 },

 createPost: async(req, res) => {

  const id = uuid();

  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.SECRET_KEY, async(err, decoded) => {
    if(err){
      return res.status(500).json({error: err});
    }

  const { title, content } = req.body;
  try{
    await db.Posts.create({ id: id, author: decoded.username, title: title, content: content, likes: 0, userId: decoded.id });

      return res.status(201).json({message: 'content created successfully'});
  }
  catch(err){
    return res.status(400).json({error: err.message});
  }

  });
 },

 updatePost: async (req, res) => {

  const { id } = req.params;
  const { title, content } = req.body;
  try{
    await db.Users.update({title: title, content: content}, {
        where: {id: id}
    });

    return res.status(200).json('post updated successfully');
  }
  catch(err){
    return res.status(400).json({error: err.message});
  }

 },

 deletePost: async(req, res) => {
  const { id } = req.params;

  try{
    await db.Posts.destroy({where: { id: id }});
      
    return res.status(200).json({message: 'post deleted successfully'})
  }
  catch(err){
    return res.status(400).json({error: err.message})
  }
 }

}


module.exports = postsController