const jwt = require("jsonwebtoken");

//middleware to check if header token is valid
const auth = (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      res.status(401).json({ msg: "No authorization token" });
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      res.status(401).json({ msg: "Token verification failed" });
    }
    req.user = verified.id;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = auth;
