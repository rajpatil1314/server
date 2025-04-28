
const express = require("express");
const { signup, signin } = require("../Controllers/user.comtrollers");


const app = express();
app.use(express.json());


const userRouter = express.Router();
//Signup
userRouter.post("/signup",signup)
//Singin
userRouter.post("/signin",signin)




module.exports=userRouter
