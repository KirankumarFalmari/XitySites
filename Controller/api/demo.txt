const express = require("express");
const route = express.Router();
const path = require("path");
const bodyparser = require("body-parser");
var dateTime = require("node-datetime");
const ObjectId = require("mongodb").ObjectId;

require("../Connection/connection");

const country = require("../Modules/Master/country");
const state = require("../Modules/Master/state");
const city = require("../Modules/Master/city");
const pincode = require("../Modules/Master/pincode");

route.get("/countrydata", async (req, res) => {
  const data = await country.find({});
  res.send(data);
});

route.get("/statedata", async (req, res) => {
  const data = await state.find({});
  res.send(data);
});

route.get("/citydata", async (req, res) => {
  const data = await city.find({});
  res.send(data);
});

route.get("/pincodedata", async (req, res) => {
  const data = await pincode.find({});
  res.send(data);
});

module.exports = route;
