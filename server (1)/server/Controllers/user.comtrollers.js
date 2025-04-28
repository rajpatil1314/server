
const bcrypt = require("bcrypt");
const userModel = require("../Models/user.model");
require("dotenv").config()
var jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (req.body.role) {
    return res.status(400).json({ message: "role is not required" });
  }

  try {
    const isExistUser = await userModel.findOne({ email });
    if (isExistUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (hash) {
        const result = await userModel.create({ name, email, password: hash });
        const { password, ...rest } = result._doc;

        return res
          .status(201)
          .json({ message: "User created successfully", user: rest });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//signin

const signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const isExistUser = await userModel.findOne({ email });
    if (!isExistUser) {
      return res.status(400).json({ message: "please create account first " });
    }
    bcrypt.compare(password, isExistUser.password, (err, result)=> {
      if(err)
      {
        return res.status(400).json({message:err.message})
      }
      if(!result)
      {
        return res.status(400).json({message:"invalid password"})
      }

      const{password,...rest}=isExistUser._doc
      jwt.sign({ user:rest },process.env.privateKey ,  (err, token)=> {
        if(err)
          {
            return res.status(400).json({message:err.message})
          }
          if(!token)
          {
            return res.status(400).json({message:"token not created"})
          }

          console.log(token)
         res.cookie("verificationToken",token).status(200).json({message:"user login successfully ",user:rest})

      });
  });




    
  } catch (error) {
    res.status(400).json({message:error.message})
  }

 
}


module.exports = { signup ,signin };
