const express=require('express');
const User=require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router =express.Router();

JWT_SECRET="Hello"
//create user using :POST"/api/auth/createuser". 
//no login required 
router.post('/createuser',[
    body('name',"enter the valid name").isLength({ min: 3 }),
    body('email',"enter valid email").isEmail(),
    body('password',"password atleast of 5 letter").isLength({ min: 5 }),

], async (req,res)=>{
  //if there are error , return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //check whether the user with this email already exists 

    try{

   

    let  user= await User.findOne({email:req.body.email});
    if(user){
      console.log(user);
      return res.status(400).json({error:"sorry a user with this email already exist"});
    }
      const salt=await bcrypt.genSalt(10);
       const secPass= await bcrypt.hash(req.body.password,salt)   ;

     user= await  User.create({
        name: req.body.name,
        email: req.body.email, 
        password: secPass
      })
      
      // .then(user => res.json(user))
      // .catch(err => {console.log(err) 
      //   res.json({error:"Please enter a unique Value"})});
       
      const data={
        id:user.id
      }
      const authdata=jwt.sign(data,JWT_SECRET);
        res.json({authdata})                   // res.json(user)


      }
      catch(error){
        console.error(error.message);
        res.status(500).send("some error occured")
      }
    
})
module.exports =router