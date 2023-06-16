const verifyUserCreated = require('../DAO/verifyModel');
const { compareSync } = require('bcrypt');
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
    const { password } = req.body;
    
    try{
    const result = await verifyUserCreated(req, 'email');

    if(result.length === 0 || result.length > 1){
        return res.status(500).json({message: 'failed to resend token'});
    }
    
    result.map(async (user) => {
         
        const passwordMatch = compareSync(password, user.password)
        if (!passwordMatch) {
            return res.status(400).json({message: 'Invalid Credentials'});
        }
        
    
    const token = jwt.sign({id: user.id, username: user.username, email: user.email, authenticated: user.authenticated, created_at: user.created_at}, 
        process.env.SECRET_KEY);

    const mailOptionsCreate = {
        from: process.env.EMAIL,
        to: process.env.EMAIL_USER,
        subject: 'Account Activate',
        text:`  Hello, ${user.username}
            
                Thanks for registering your account in my website, you are so close to activate your account.

                Click here to activate your account: http://localhost:3000/account-activate?token=${token}`
        }

   try{
    await transporter.sendMail(mailOptionsCreate);
    res.json({message: 'token resented to your email successfully'});
   }
   catch(err){
    res.status(500).json({message: 'failed to send email: ' + err.message});
    return;
   }
    
   
    
})}

catch(err){
    res.status(500).json({message: 'unexpected error'})
}

}

module.exports = resendToken;