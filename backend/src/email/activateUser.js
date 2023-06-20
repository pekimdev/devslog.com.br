const jwt = require('jsonwebtoken');
const db = require('../db/models');

const activateUser = (req, res) => {
    const { token } = req.query;

    jwt.verify(token, process.env.SECRET_KEY, async(err, decoded) => {
        if (err) {
            return res.status(401).send({ message: `token is invalid or expired ${err.message}` });
        }
        
        const { id, username, email } = decoded;
        const result = await db.Users.update({ authenticated: true},
        { where: {
            id: id
        }}
    )
    if (!result){
        return res.status(401).send({ message: 'update failed'});
    }

    return res.status(200).send(`<font face="arial">
        <em>
            <h2 style="color: green">Account activated successfully!</h2>
            <h3>your username: ${username}</h3>
            <h3>your email: ${email}</h3>
        </em>
    </font>` 
    );
})
}
module.exports = activateUser