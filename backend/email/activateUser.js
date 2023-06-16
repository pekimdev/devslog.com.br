const jwt = require('jsonwebtoken');
const db = require('../infra/db');

const activateUser = (req, res) => {
    const { token } = req.query;

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token is invalid or expired. ' + err.message });
        }
        
        const { id } = decoded
        const sql = 'UPDATE users SET authenticated = 1 WHERE id = ?'
        return db.query(sql, [id], (err) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send('Account activated successfully!')
        })
})
}
module.exports = activateUser