const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.cookies.jwtoken;

  if (!token) {
    res.redirect("/");
  }
  try {
    const decoded = jwt.verify(token, config.SECRET_KEY);
    req.user = decoded;
  } catch (err) {
    // return res.status(401).send("Invalid Token");
    res.clearCookie("jwtoken");
    res.clearCookie("flash");
    res.redirect("/");
  }
  return next();
};

module.exports = verifyToken;
