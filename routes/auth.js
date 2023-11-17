const express=require('express');
const User=require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router =express.Router();
const fetchuser=require("../middleware/fetchuser")

JWT_SECRET="Hello"
// Route 1create user using :POST"/api/auth/createuser". 
//no login required 
router.post('/createuser',[
    body('name',"enter the valid name").isLength({ min: 3 }),
    body('email',"enter valid email").isEmail(),
    body('password',"password atleast of 5 letter").isLength({ min: 5 }),

], async (req,res)=>{
  let success=false;
  //if there are error , return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }
    //check whether the user with this email already exists 

    try{

   

    let  user= await User.findOne({email:req.body.email});
    if(user){
      console.log(user);
      return res.status(400).json({success, error:"sorry a user with this email already exist"});
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
      success=true;
        res.json({success,authdata})                   // res.json(user)


      }
      catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error")
      }
    
}) 
// Route 2 authenticate a user using POSt/api/auth/login no login req.
router.post('/login',[
  
  body('email',"enter valid email").isEmail(),
  body('password',"password can't be blank").exists(),

], async (req,res)=>{
   //if there are error , return bad request
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
   }
   const {email,password}=req.body;
   try {
    let user=await User.findOne({email});
    if (!user) {
      return res.status(400).json({error:"Please enter correct Credentials"});
      
    }
    const passcompare= await bcrypt.compare(password,user.password);
    if(!passcompare){
      success=false
      return res.status(400).json({success,error:"Please try with correct credentials"})
    }
    const data={
      id:user.id
    }
    const authdata=jwt.sign(data,JWT_SECRET);
    success=true;
    res.json({success,authdata});
   } 
   catch (error) {
    console.error(error.message);
        res.status(500).send("Internal Server Error");
   }
})


// Route 3 Get User Detail using POSt/api/auth/getuser  ***login required***
router.post('/getuser',fetchuser, async (req,res)=>{


  try {
    let userId=req.user.id;
    const user=await User.findById(userId).select("-password");
    res.send({user})
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
    
  }
})

module.exports =router