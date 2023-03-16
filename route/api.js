const express = require("express");
const route = express.Router();
const path = require("path");
const bodyparser = require("body-parser");
var dateTime = require("node-datetime");
const ObjectId = require("mongodb").ObjectId;
require("../Connection/connection");

//Call MasterController
const master = require("../Controller/api/MasterController");

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

module.exports = route;
