const jwt = require('jsonwebtoken');
const db = require('../db/models');


const recoveryUser = async(req, res) => {
    const { token } = req.query;

    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).send(`<em>
            <h2 style="color: red">
            token is invalid or expired.
            </h2>
            </em>`);
        }  

        try{
            await db.Users.update({ password: decoded.newPassword}, {where: { email: decoded.email } });
            return res.status(200).send(`<font face="arial">
        <em>
            <h2 style="color: green">Password updated successfully!</h2>
        </em>
    </font>`)
        }

        catch(err) {
            return res.status(500).send({message: err.message});
        }
    })
}

module.exports = recoveryUser;