const express = require("express");
const route = express.Router();
// const bodyparser = require("body-parser");
// route.use(bodyparser.json());
// route.use(
//   bodyparser.urlencoded({
//     extended: true,
//   })
// );

//Call MasterController
const master = require("../Controller/api/MasterController");
const login = require("../Controller/api/LoginBusines");

//Api Call for state
route.get("/state", async (req, res) => {
  master.getState(res);
});

//Api Call for city
route.get("/city", async (req, res) => {
  master.getCity(res);
});

//Api Call for country
route.get("/country", async (req, res) => {
  master.getCountry(res);
});

//Api Call for pincode
route.get("/pincode", async (req, res) => {
  master.getPincode(res);
});

//Api Call for user registration
route.post("/user-register", async (req, res) => {
  login.userRegister(req, res);
});

//Api Call for user registration
route.post("/user-login", async (req, res) => {
  login.userLogin(req, res);
});

route.post("/user-otp", async (req, res) => {
  login.userOtp(req, res);
});

module.exports = route;
