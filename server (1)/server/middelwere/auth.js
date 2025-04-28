require("dotenv").config();
const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  let token = req.cookies?.verificationToken;
  jwt.verify(token, process.env.privateKey, (err, decoded) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!decoded) {
      return res.status(400).json({ message: "token is not valid" });
    }
    req.user = decoded.user;
    next();
  });
};
module.exports = isAuth;
