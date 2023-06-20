const { Op } = require('sequelize')
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { compareSync } = require('bcrypt');

const db = require('../db/models');


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
    const rows = await db.Users.findAll();
    return res.status(200).json(rows)
    }
    catch(err){
    return res.status(400).json({error: err.message})
    }

    },


    getUserById: async (req, res) => {

    const { id } = req.params;

        try{
        const row = await db.Users.findByPk(id);
        if (row === null){
            return res.status(404).json('user not founded')
        }
        return res.status(200).json(row)
    }
    catch(err){
        res.status(400).json(err.message);
    }
    },

    createUser: async (req, res) => {

    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try{
        const [row, created] = await db.Users.findOrCreate({
            where: { 
              [Op.or]: [{username: username}, {email: email}]
            },
        defaults: {username: username, email: email, password: hashedPassword, authenticated: false},
        });
            
        if (!created){
            return res.status(400).json({error: 'user already exists'})
        }

        const token = jwt.sign({id: row.id, 
            username: username, 
            email: email, 
            authenticated: false}, process.env.SECRET_KEY);


            const mailOptionsCreate = {
                from: process.env.EMAIL,
                to: [process.env.EMAIL, email],
                subject: 'Autenticação de conta',
                html:`  <h2>Olá, </h2><h2 style="color: green">${username}</h2>
                    
                        <h3>Obrigado por registrar-se em meu site, você está perto de ativar a sua conta</h3>
    
                        <p>Clica aqui para ativar a sua conta:</p><a href="http://localhost:3000/account-activate?token=${token}">Ativar a minha conta</a>`
                };

            try{
                await transporter.sendMail(mailOptionsCreate);
                res.status(200).json('user created successfully, please check your email for activation.');
                }

            catch(err){
                return res.status(400).json({failedToSendEmail: err.message});
            }
        }

    catch(err){
        res.status(400).json(err.message);
    }
    },


    updateUser: async (req, res) => {
        const { id } = req.params;
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

    try{
        await db.Users.update({username: username, email: email, password: hashedPassword}, {
            where: {id: id}
        });

        return res.status(200).json('user updated successfully');
    }
    catch(err){
        res.status(400).json(err);
    }
    },


    deleteUser: async (req, res) => {
    const { id } = req.params;

    try{
        await db.Users.destroy({where: { id: id}});
        return res.status(200).json({message: 'user deleted successfully'})
    }
    catch(err){
        res.status(500).json(err);
    }
    },


    loginUser: async(req, res) => {

    const { email, password } = req.body

    try{

        const result = await db.Users.findAll({where: { email: email}
        });
        
        if(result.length === 0){
            return res.status(404).json({message: 'invalid credentials'})
        }

        if (result.length === 1){
            const passwordMatch = compareSync(password, result[0].password);

            if (!passwordMatch){
                return res.status(400).json({message: 'invalid credentials.'});
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
    }},


    logoutUser: async(req, res) => {
    const authHeader = req.headers['authorization'];
    
    if(!authHeader){
        return res.status(401).json({message: 'No token provided'});
    }

    if(!authHeader.includes('Bearer ')){
        return res.status(401).json({message: 'Invalid Bearer'});
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.SECRET_KEY, (err) => {
        if(err){
            return res.status(401).json({invalidToken: err});
        }});

    if(token){
        res.set('authorization', '');
        res.status(200).json({message: `User logged out.`});
        return;
    }
},


    recoverUser: async(req, res) => {  
    const { email, password } = req.body;

    try{
        const result = await db.Users.findAll({
             where: {email: email}
            });
;
        if (result.length === 0) {
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
            to: [process.env.EMAIL, email],
            subject: 'Recuperação de conta',
            html:`  <h2>Olá!</h2>
                
                    <h3>Falta pouco para você trocar sua senha.</h3>

                    <p>Clica aqui para confirmar a troca da senha:</p><a href="http://localhost:3000/account-recovery?token=${token}">Confirmar nova senha.</a>`
            };

            await transporter.sendMail(mailOptionsRecover);
            return res.status(200).json({message: 'Email for account recovery sent successfully'})
        }
        catch(err) {
            return res.status(500).json({message: err.message});
        }
    }
}

module.exports = usersController;