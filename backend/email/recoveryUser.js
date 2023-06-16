const jwt = require('jsonwebtoken');
const db = require('../infra/db.js');


const recoveryUser = async(req, res) => {
    const { token } = req.query;

    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token is invalid or expired. ' + err.message });
        }  

        const sql = `UPDATE users SET password = ? WHERE email = ?`


        const recoverPromise = new Promise ((resolve, reject) => {
            db.query(sql, [decoded.newPassword, decoded.email], (err) => {
                if (err) {
                    reject(err.message);
                    return;
                }
                resolve('Your password has been changed');
                
            });
        })
        
    try{
        const result = await recoverPromise;
        res.status(200).send(result);
    }
    catch (err) {
        res.status(500).send(err);
    }
    })
}

module.exports = recoveryUser;