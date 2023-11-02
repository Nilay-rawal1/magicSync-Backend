const express=require('express');
const User=require('../models/User');
const { body, validationResult } = require('express-validator');
const router =express.Router();

//create user using :POST"/api/auth". 
//
router.post('/',[
    body('name',"enter the valid name").isLength({ min: 3 }),
    body('email',"enter valid email").isEmail(),
    body('password',"password atleast of 5 letter").isLength({ min: 5 }),

],(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      }).then(user => res.json(user)).catch(err => {console.log(err) 
        res.json({error:"Please enter a unique Value"})});

    
})
module.exports =router