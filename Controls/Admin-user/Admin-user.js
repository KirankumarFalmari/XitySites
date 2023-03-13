const express = require("express");
const route = express.Router();
const path = require("path");
// const cookie = require("cookie-parser");
require("../../Connection/connection");
const Register = require("../../Modules/Admin-users/admin-users");
const bodyparser = require("body-parser");

route.use(express.json());
route.use(bodyparser.json());
route.use(bodyparser.urlencoded({ extended: true }));
route.use(express.urlencoded({ extended: false }));
const static_path = path.join(__dirname, "../../Views/");

route.get("/", (req, res) => {
  // res.sendFile(static_path + "create.html");
  res.render("create");
});

route.post(
  "/",

  async (req, res) => {
    try {
      const password = req.body.pwd;
      const cpassword = req.body.cpwd;
      const email = req.body.email;
      const phoneno = req.body.pno;

      if (password === cpassword) {
        const newUser = Register({
          username: req.body.username,
          pincode: req.body.pincode,
          email: req.body.email,
          phoneno: req.body.pno,
          password: req.body.pwd,
        });

        const userExist = await Register.findOne({ email, phoneno });
        if (userExist) {
          return res.status(422).json({ error: "User already Exits " });
        } else {
          const token = await newUser.generateAuthToken();
          //   console.log(token);
          res.cookie("jwtoken", token, { httpOnly: true });
          res.redirect("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  //   }
);

module.exports = route;
