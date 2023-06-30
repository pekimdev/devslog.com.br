const db = require('../db/models')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });


const resendToken = async (req, res) => {
    const { email } = req.body

    try{
        const result = await db.Users.findAll({where: { email: email}
        });
        
        if(result.length === 0){
            return res.status(404).json({message: 'invalid credentials'})
        }

        if (result.length === 1){
    
    const token = jwt.sign({id: result[0].id,
        username: result[0].username, 
        email: email, 
        authenticated: false}, process.env.SECRET_KEY);


        const mailOptionsResend = {
            from: process.env.EMAIL,
            to: [process.env.EMAIL, email],
            subject: 'Autenticação de conta',
            html:`  <h2>Olá, </h2><h2 style="color: green">${result[0].username}</h2>
                
                    <h3>Obrigado por registrar-se em meu site, você está perto de ativar a sua conta</h3>

                    <p>Clica aqui para ativar a sua conta:</p><a href="http://localhost:3000/account-activate?token=${token}">Ativar a minha conta</a>`
            };

        try{
            await transporter.sendMail(mailOptionsResend);
            res.status(200).json('email resented to your email address');
            }

        catch(err){
            return res.status(400).json({failedToSendEmail: err.message});
        }
    
   
    
}}

catch(err){
    res.status(500).json({message: err.message,})
}

}

module.exports = resendToken;