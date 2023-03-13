//Other Class
const express = require("express");
const auth = require("../Controls/auth/auth");
const app = express.Router();

//Define Controller
const country = require("../Controller/master/CountryController");

app.use("/country", auth, country);

module.exports = app;
