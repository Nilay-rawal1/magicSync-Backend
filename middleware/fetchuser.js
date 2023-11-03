var jwt = require('jsonwebtoken');
JWT_SECRET="Hello"
const fetchuser=(req,res,next)=>{
//get user from jwt
 const token=req.header('auth-token');
 if(!token){

    res.status(401).send({error: "please authenicate using valid token"});

 }
 
 try {
    const data =jwt.verify(token,JWT_SECRET);
    req.user=data;
    next();
    
 } catch (error) {
    res.status(401).send({error:"please authenicate using valid token"});
 }

}

module.exports= fetchuser;