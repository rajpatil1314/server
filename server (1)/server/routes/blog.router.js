const express = require("express");
const { Createblog, getallblogs, deleteblog, updateblog } = require("../Controllers/blog.controllers");
const isAuth = require("../middelwere/auth");

const app = express();

const blogRouter = express.Router();

blogRouter.post("/Createblog",isAuth,Createblog)
blogRouter.get("/getallblogs",isAuth,getallblogs)
blogRouter.delete("/deleteblog/:id",isAuth,deleteblog)
blogRouter.patch("/updateblog/:id",isAuth,updateblog)


module.exports = blogRouter;