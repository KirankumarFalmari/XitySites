const base = require("./BaseController");
const Register = require("../../Modules/Directory/bussiness-users/bussiness-user");
const jwt = require("jsonwebtoken");

const createToken = (user) => {
  const token = jwt.sign({ _id: user[0]._id }, process.env.SECRET_KEY, {
    expiresIn: "2h",
  });
  return token;
};

const response = (user, res) => {
  res.status(200).send(base.sendResponse(user, "login successfully"));
};

const userRegister = async (req, res) => {
  try {
    const password = req.body.pwd;
    // const cpassword = req.body.cpwd;
    const emailid = req.body.email;
    const phoneno = req.body.pno;

    if (password != cpassword) {
      res.send(base.sendError("Conform Password and password not match"));
    }
    if (emailid == null || emailid == "") {
      res.send(base.sendError("Email Is Require"));
    }
    if (phoneno == "" || phoneno == null) {
      res.send(base.sendError("Phone Is Require"));
    }
    const mailExist = await Register.find({
      email: emailid,
    });
    const phonenoExist = await Register.find({
      phoneno: req.body.pno,
    });

    if (mailExist.length !== 0 && mailExist[0].email == emailid) {
      res.send(base.sendError("User Email Already Exit"));
    }

    if (phonenoExist.length !== 0 && phonenoExist[0].phoneno == phoneno) {
      res.send(base.sendError("User Phone no Already Exit"));
    }

    if (mailExist.length === 0) {
      // if (password === cpassword) {
      const newUser = Register({
        fullname: req.body.fullname,
        username: req.body.username,
        pincode: req.body.pincode,
        email: emailid,
        phoneno: phoneno,
        password: password,
      });
      await newUser.generateAuthToken();
      // res.cookie("jwtoken", token, { httpOnly: true });
      var detailuser = {
        user: newUser,
      };
      res.send(base.sendResponse(detailuser, "User List detail"));
      // }
    }
  } catch (err) {}
};

const userLogin = async (req, res) => {
  try {
    const OTP = 111111;
    const { email, otp } = req.body;

    if (email == undefined || email == "" || email == null) {
      res.send(base.sendError("provide a email"));
    }

    let user = [];
    let phonenoExist = [];
    if (typeof email == "string") {
      user = await Register.find({ email: email }, { _id: 1, email: 1 });
    } else {
      phonenoExist = await Register.find(
        { phoneno: email },
        { _id: 1, phoneno: 1 }
      );
    }

    if (user.length == 0 && phonenoExist.length == 0) {
      res.send(base.sendError("user not exists"));
    }
    if (Number(otp).length == 0 || otp == undefined || otp == "") {
      res.send(base.sendError("provide a otp"));
    }
    if (
      Number(otp).length < 6 ||
      Number(otp).length > 6 ||
      Number(otp) !== OTP
    ) {
      res.send(base.sendError("Invalid OTP"));
    }

    if (user.length !== 0) {
      if (email === user[0].email && Number(otp) === OTP) {
        // Create token
        const token = createToken(user);
        user[0].token = token;
        response(user, res);
      }
    }

    if (phonenoExist.length !== 0) {
      if (email === phonenoExist[0].phoneno && Number(otp) === OTP) {
        // Create token
        const token = createToken(phonenoExist);
        phonenoExist[0].token = token;
        response(phonenoExist, res);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const userOtp = async (req, res) => {
  try {
    const url =
      "http://sms.orcainfosolutions.com/api/mt/SendSMS?user=profcyma&password=password1&senderid=PROGBL&channel=Trans&DCS=0&flashsms=0&number=919718577938&text=Dear%20Customer,%20your%20OTP%20for%20registration%20is%205852582.%20Use%20this%20OTP%20to%20register.%20Team%20Profcyma%20Demo&route=4&PEId=1201159679589190766";

    const OTP = 111111;
    res.status(200).send(base.sendResponse(OTP, "login successfully"));
  } catch (err) {}
};

const data = {
  userRegister,
  userLogin,
  userOtp,
};

module.exports = data;
