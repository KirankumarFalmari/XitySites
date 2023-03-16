const jwt = require("jsonwebtoken");
const adminuser = require("../../Modules/Admin-users/admin-users");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwtoken;
    const veriyUser = jwt.verify(token, process.env.SECRET_KEY);
    const user = adminuser.findOne({ _id: veriyUser._id });
    next();
  } catch (err) {
    res.redirect("/");
  }
};

module.exports = auth;
