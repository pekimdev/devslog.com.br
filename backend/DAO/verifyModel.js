const db = require('../infra/db');


    const verifyUserCreated = (req, string) => {
        let column
        const { email, username } = req.body;

        if (string === 'email'){
            column = email;
        } 
        else if (string === 'username'){
            column = username;
        }
        return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM users WHERE ${string} = ?`, [column], (err, result) => {
            if (err) {
                return reject({
                    message: `failed to get user by ${string} -> ${err}`
                })
            }
            resolve(result)
    })})
}

module.exports = verifyUserCreated



