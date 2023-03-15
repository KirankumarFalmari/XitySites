const express = require("express");
const route = express.Router();
const path = require("path");
// const cookie = require("cookie-parser");
require("../../Connection/connection");

const Register = require("../../Modules/Directory/bussiness-users/bussiness-user");
const bodyparser = require("body-parser");

route.use(express.json());
route.use(bodyparser.json());
route.use(bodyparser.urlencoded({ extended: true }));
route.use(express.urlencoded({ extended: false }));
const static_path = path.join(__dirname, "../../Views/");
// const auth = require("../auth/auth");
const moment = require("moment");

route.get("/", async (req, res) => {
  const data = await Register.find({});
  res.render("directory/bussiness-user/index", {
    data: data,
    moment: moment,
  });
});

route.get("/search/:key", async (req, resp) => {
  let data = await Register.find({
    $or: [
      { fullname: { $regex: req.params.key } },
      { username: { $regex: req.params.key } },
      { email: { $regex: req.params.key } },
    ],
  });
  resp.send(data);
});

route.post(
  "/",

  async (req, res) => {
    try {
      const password = req.body.password;
      const email = req.body.email;

      const phoneno = req.body.phoneno;

      const newUser = Register({
        fullname: req.body.fullname,
        username: req.body.username,
        email: req.body.email,
        phoneno: req.body.phoneno,
        password: req.body.password,
      });

      const userEmail = await Register.findOne({ email });
      const userPhone = await Register.findOne({ phoneno: req.body.phoneno });

      //   console.log(userPhone);
      if (userEmail || userPhone) {
        return res.status(422).json({
          success: "false",
          error: "User already Exits ",
        });
      } else {
        const token = await newUser.generateAuthToken();
        //   console.log(token);
        res.cookie("jwtoken", token, { httpOnly: true });
        res.send({
          success: "true",
          result: "user is created",
        });
        //   res.redirect("/");
      }
    } catch (error) {
      console.log(error);
    }
  }
  //   }
);

module.exports = route;
