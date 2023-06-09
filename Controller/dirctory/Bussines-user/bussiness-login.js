const express = require("express");
const route = express.Router();
const path = require("path");
const jwt = require("jsonwebtoken");
require("../../../Connection/connection");
const Register = require("../../../Modules/Directory/bussiness-users/bussiness-user");
const bodyparser = require("body-parser");
// const master = require("../../api/MasterController");
const base = require("../../api/BaseController");

route.use(express.json());
route.use(bodyparser.json());
route.use(bodyparser.urlencoded({ extended: true }));
route.use(express.urlencoded({ extended: false }));
const static_path = path.join(__dirname, "../../Views/");

// route.get("/", (req, res) => {
//   res.sendFile(static_path + "login.html");
// });

route.post("/", async (req, res) => {
  try {
    // Find user by email
    const OTP = 111111;
    const otp1 = req.body.otp1;
    const otp = Number(otp1);
    const user = await Register.find({ email: req.body.email });
    // If user not found or password is incorrect, return error response
    if (user.length == 0) {
      res.send(base.sendError("User Not Exists"));
    }
    if (OTP === otp) {
      const token = jwt.sign({ _id: user[0]._id }, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });
      user[0].token = token;
      res.send(base.sendResponse(token, "login Successfully"));

      // master.UserLogin(res, token);
    } else {
      res.send(base.sendError("Invalid OTP"));
    }
  } catch (err) {}
});

// route.post("/", async (req, res) => {
//   //   jwt.verify(req.token, process.env.SECRET_KEY, (err, doc) => {
//   //     if (!err) {
//   //       res.redirect("/dashboard");
//   //     }
//   //   });
//   try {
//     const OTP = 111111;
//     const email = req.body.email;
//     // const phoneno = req.body.phonono;
//     const otp1 = req.body.otp1;
//     const otp = Number(otp1);
//     // const userEmail = await Register.findOne({ phoneno: req.body.email });
//     const userEmail = await Register.findOne({
//       email: req.body.email,
//     });
//     // req.body.phoneno == userPhone.phoneno ||
//     // && userPhone === null
//     // if (userEmail === null) {
//     //   res.send({
//     //     result: "user is not registered",
//     //   });
//     //   // console.log("user is not registered");
//     // }
//     // || userPhone.phoneno === phoneno
//     if (userEmail.email === email) {
//       if (otp === OTP) {
//         // if (pincode === userLogin.pincode) {
//         //   req.session.user = true;
//         // res.redirect("/dashboard");
//         // res.send({
//         //   success: "true",
//         //   result: "login successfully",
//         // });
//         // }
//       } else {
//         res.send({
//           success: "false",
//           result: "Wrong otp",
//         });
//         console.log("Wrong otp");
//       }
//     } else {
//       res.send({
//         success: "false",
//         result: "user is not registered",
//       });
//       console.log("user is not registered");
//     }
//     // }
//   } catch (err) {
//     console.log(err);
//   }
// });

module.exports = route;
