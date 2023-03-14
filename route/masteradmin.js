//Other Class
const express = require("express");
const auth = require("../Controls/auth/auth");
const app = express.Router();

//Define Controller
const country = require("../Controller/master/CountryController");
const state = require("../Controller/master/StateController");
const city = require("../Controller/master/CityController");

app.use("/country", auth, country);
app.use("/state", state);
app.use("/city", city);

module.exports = app;
