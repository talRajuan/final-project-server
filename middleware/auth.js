const jwt = require("jsonwebtoken");


module.exports = (req,res,next) => {
    const token = req.query.token || req.header('x-auth-token')

    if(!token)
    return res.status(401).json({message: 'Access denied no token provided'});

    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = payload
        next()
    }
    catch(e){
         return res.status(401).json({
             message: 'invalid token',
             e: e
         });

    }
}