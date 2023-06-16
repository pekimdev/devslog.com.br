const jwt = require('jsonwebtoken');


const tokenVerify = (req, res, next) => {
    const { id } = req.params;

    const authHeader = req.headers['authorization'];
    
    if(!authHeader){
        return res.status(401).json({message: 'No token provided'});
    }

    if(!authHeader.includes('Bearer ')){
        return res.status(401).json({message: 'Invalid Bearer'});
    }

    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if(err){
            return res.status(401).json({invalidToken: err});
        }

        if(id != decoded.id){
            return res.status(401).json({message: 'Invalid token'});
        }
        req.userId = decoded.id;

        next();

    })
}

module.exports = tokenVerify;
