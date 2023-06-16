const db = require('../infra/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const verifyUserCreated = require('./verifyModel')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });





const usersDAO = {
    
    getAll: () => {
        const sql = 'SELECT * FROM users'
        return new Promise((resolve, reject) => {
            db.query(sql, (err, result) => {
                if (err) {
                    reject({
                        message: `failed to get users -> ${err}`
                    })
                } else {
                    resolve(result)
                }
            })
        })

    },


    getById: (req) => {
        const { id } = req.params
        const sql = 'SELECT * FROM users WHERE id =?'
        return new Promise((resolve, reject) => {
            db.query(sql, [id], (err, result) => {
                if (err) {
                    reject({message: `failed to get user -> ${err}`})
                } else {
                    resolve(result)
                }
            })
        })
    },


    create: async (req, res) => {
        
        const { username, email, password, authenticated, created_at } = req.body;
   
        const hashedPassword = await bcrypt.hash(password, 10);
    

        //verify if email or username already exists
        const resultUser = await verifyUserCreated(req, 'username');
        const resultEmail = await verifyUserCreated(req, 'email');


        if (resultEmail.length > 0 || resultUser.length > 0) {
            return({message: 'username or email already exists'})
        }
   
        const sql = 'INSERT INTO users (username, email, password, authenticated, created_at) VALUES (?, ?, ?, false, current_timestamp())'
        return new Promise((resolve, reject) => {
            db.query(sql, [username, email, hashedPassword, authenticated, created_at], async (err, result) => {

            const token = jwt.sign({id: result.insertId, username: username, email: email, authenticated: authenticated, created_at: created_at}, 
                    process.env.SECRET_KEY);
        
                    const mailOptionsCreate = {
                    from: process.env.EMAIL,
                    to: process.env.EMAIL_USER,
                    subject: 'Account Activate',
                    text:`  Hello, ${username}
                        
                            Thanks for registering your account in my website, you are so close to activate your account.
        
                            Click here to activate your account: http://localhost:3000/account-activate?token=${token}`
                    }
        

                if (err) {
                   return reject({message: `failed to create user -> ${err}`});
                } 

                try{
                await transporter.sendMail(mailOptionsCreate);
                resolve('user created successfully, check your email');
                }

                catch(err){
                    return reject({message: `failed to send email -> ${err}`});
                    
                }
            })
        })
    },


    update: async(req) => {
        const { id } = req.params;
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'UPDATE users SET username =?, email =?, password =? WHERE id =?';

         return new Promise((resolve, reject) => {
            db.query(sql, [username, email, hashedPassword, id], (err) => {
                if (err) {
                    reject({message: `failed to update user -> ${err}`});
                } else {
                    resolve('user updated successfully');
                }
            })
         })
    },



    delete: (req) => {
        const { id } = req.params;
        const sql = 'DELETE FROM users WHERE id =?'
        return new Promise((resolve, reject) => {
            db.query(sql, [id], (err) => {
                if (err) {
                    reject({message: `failed to delete user -> ${err}`});
                } else {
                    resolve('user deleted successfully');
                }
            })
        })
    },

    login: (req) => {
        const { email } = req.body;
        const sql = 'SELECT * FROM users WHERE email =?';

            return new Promise((resolve, reject) => {
                db.query(sql, [email], (err, row) => {
                    if (err) {
                       reject(res.status(401).json({message: err}));
                }
                    resolve(row);
                })
            })
    },

}

module.exports = usersDAO