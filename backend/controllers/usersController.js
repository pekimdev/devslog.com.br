const usersDAO = require('../DAO/usersDAO');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { compareSync } = require('bcrypt');
const verifyUserCreated = require('../DAO/verifyModel')


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });



const usersController = {

    getAllUsers: async (req, res) => {
    try{
        const users = await usersDAO.getAll();
        res.status(200).json(users);
    }
    catch(err){
        res.status(500).json(err.message);
    }
    },


    getUserById: async (req, res) => {
         try{
            const user = await usersDAO.getById(req, res);
            res.status(200).json(user);
        }
        catch(err){
            res.status(500).json(err.message);
        }
    },

    createUser: async (req, res) => {
        
        try{
            const result = await usersDAO.create(req);
            if (result.message === 'username or email already exists') {
                res.status(400).json(result.message);
                return;
            }
            res.status(201).json(result);
        }
        
        catch(err){
            res.status(400).json(err.message);
        }
    },


    updateUser: async (req, res) => {
        try{
            const rows = await usersDAO.update(req);
            res.status(200).json(rows);
        }
        catch(err){
            res.status(500).json(err);
        }
    },

    deleteUser: async (req, res) => {
        try{
            const rows = await usersDAO.delete(req);
            res.status(200).json(rows);
        }
        catch(err){
            res.status(500).json(err);
        }
    },


    loginUser: async(req, res) => {

        const { password } = req.body
        
        try{
            const result = await usersDAO.login(req);
            if (result.length === 0){
                return res.status(400).json({message: 'Invalid Credentials'});
            }

            if (result.length === 1){
                const passwordMatch = compareSync(password, result[0].password)
                if (!passwordMatch){
                    return res.status(400).json({message: 'Invalid Credentials'});
                }

                if (passwordMatch){
                    if (!result[0].authenticated) {
                        return res.status(401).json({message: 'Account not authenticated.'});
                    }
                    const token = jwt.sign({
                        id: result[0].id,
                        username: result[0].username,
                        email:  result[0].email,
                        created_at: result[0].created_at}, process.env.SECRET_KEY, {expiresIn: '1h'});

                        res.set('authorization', `Bearer ${token}`);
                    res.status(200).json({message: 'token sent to header successfully'});
                    return;
                }
            }
        }
        catch(err){
            res.status(401).json({
                message: `Not authorized: ${err.message}`
            });
        }
            
    },




    logoutUser: async(req, res) => {
        const token = req.headers['authorization'];

        if(token){
            res.set('authorization', '');
            res.status(200).json({message: `User logged out.`});
            return;
        }

        return res.status(400).json({message: 'User not logged'})
    },




    recoverUser: async(req, res) => {  
        const { email, password } = req.body;
  

        try{
            const result = await verifyUserCreated(req, 'email');
    
            if (result.length < 1) {
                return res.status(400).json({message: 'email not found'});
            }


            const passwordMatch = compareSync(password, result[0].password);


            if (passwordMatch) {
                res.status(400).json({message: `it is your current password.`});
                return;
            }
        
            const hashedPassword = await bcrypt.hash(password, 10);


        const token = jwt.sign({email: email, newPassword: hashedPassword}, 
          process.env.SECRET_KEY);
            
          
  
          const mailOptionsRecover = {
          from: process.env.EMAIL,
          to: process.env.EMAIL_USER,
          subject: 'Recover password',
          text:`  Hello!
              
                  If you want to recover your password and confirm a new password
  
                  Click here to confirm your new password: http://localhost:3000/account-recovery?token=${token}`
          }
  
              await transporter.sendMail(mailOptionsRecover);
              return res.status(200).json({message: 'Email for account recovery sent successfully'})
          }
          catch(err) {
              return res.status(500).json({message: err.message});
          }
  
        
      }
}

module.exports = usersController;