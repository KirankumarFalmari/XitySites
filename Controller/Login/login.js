const express = require("express");
const route = express.Router();
const jwt = require("jsonwebtoken");
var request = require("request");
const otpGenerator = require("otp-generator");
require("../../Connection/connection");
const Register = require("../../Modules/Admin-users/admin-users");
const bodyparser = require("body-parser");
const moment = require("moment");
const flash = require("connect-flash");

// const { userLogin } = require("../api/LoginBusines");
// const login = require("../api/LoginBusines");

route.use(express.json());
route.use(bodyparser.json());
route.use(flash());
route.use(bodyparser.urlencoded({ extended: true }));
route.use(express.urlencoded({ extended: false }));
// const static_path = path.join(__dirname, "../../Views");

route.get("/", (req, res) => {
  if (req.cookies.jwtoken) {
    res.redirect("/directory/category/");
  } else {
    // res.sendFile(static_path + "login.ejs");
    res.render("login", { moment: moment, message: req.flash("message") });
  }
});

route.get("/create", (req, res) => {
  // res.sendFile(static_path + "create.html");
  res.render("create");
});
var OTP;

route.post("/", async (req, res) => {
  try {
    const pincode = req.body.pincode;
    const otp1 = req.body.otp1;
    const otp2 = req.body.otp2;
    const otp3 = req.body.otp3;
    const otp4 = req.body.otp4;
    const otp5 = req.body.otp5;
    const otp6 = req.body.otp6;
    // console.log(typeof OTP + " " + OTP);

    let otp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;
    // const otp = Number(temp);
    // console.log(typeof otp + " " + otp);
    const userLogin = await Register.findOne({ phoneno: req.body.pno });
    // console.log(userLogin);
    if (Number(req.body.pno) === userLogin.phoneno) {
      if (otp === OTP) {
        if (pincode === userLogin.pincode) {
          // Create token
          const token = jwt.sign(
            { user_id: userLogin._id },
            process.env.SECRET_KEY,
            {
              expiresIn: "2h",
            }
          );
          userLogin.token = token;

          res.cookie("jwtoken", token, { httpOnly: true });
          res.redirect("/directory/category/");
        }
      } else {
        console.log("Wrong otp");
      }
    } else {
      console.log("user is not registered");
    }
    // }
  } catch (err) {
    console.log(err);
  }
});

route.post("/admin-otp/:pno", async (req, res) => {
  // console.log(req.params.pno);
  try {
    OTP = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const mobile = req.params.pno;

    const userLogin = await Register.find({ phoneno: req.params.pno });

    // console.log(userLogin);

    if (userLogin.length !== 0) {
      const url = `http://sms.orcainfosolutions.com/api/mt/SendSMS?user=profcyma&password=password1&senderid=PROGBL&channel=Trans&DCS=0&flashsms=0&number=91${mobile}&text=Dear%20Customer,%20your%20OTP%20for%20registration%20is%20${OTP}.%20Use%20this%20OTP%20to%20register.%20Team%20Profcyma%20Demo&route=4&PEId=1201159679589190766`;

      request(url, function (error, response, body) {
        if (error) throw new Error(error);
        // res
        //   .status(200)
        //   .send(base.sendResponse(response.statusCode, "login successfully"));
      });
    } else {
      // console.log("not exists");
      req.flash("message", "user not exists");
      res.send({ userExist: false });
    }
  } catch (err) {}
});

route.post(
  "/create",

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

        const userEmail = await Register.find({
          email: email,
        });
        const userPhone = await Register.find({
          phoneno: phoneno,
        });

        if (userEmail.length !== 0 || userPhone.length !== 0) {
          return res
            .status(422)
            .json({ error: "User already Exits please login" });
        } else {
          const token = await newUser.generateAuthToken();
          //   console.log(token);
          res.cookie("jwtoken", token, { httpOnly: true });
          res.redirect("/directory/category/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  //   }
);

module.exports = route;
