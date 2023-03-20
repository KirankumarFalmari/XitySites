const express = require("express");
const mongoose = require("mongoose");
var dateTime = require("node-datetime");
const bodyparser = require("body-parser");
const route = express.Router();
const moment = require("moment");
const base = require("../../api/BaseController");
const getInvite = require("../../../Modules/Directory/getInvete/getinvite");

route.use(bodyparser.json());
route.use(bodyparser.urlencoded({ extended: true }));
route.use(express.urlencoded({ extended: false }));

var dt = dateTime.create();
var formatted = dt.format("Y-m-d H:M:S");

route.get("/", async (req, res) => {
  const data = await getInvite.find({});
  res.render("directory/getinvite/index", {
    data: data,
    moment: moment,
  });
});

route.post("/", async (req, res) => {
  const { name, email, phoneno, message } = req.body;

  if (
    name == null ||
    name == undefined ||
    email == undefined ||
    phoneno == undefined ||
    message == undefined ||
    name == "" ||
    email == null ||
    email == "" ||
    phoneno == null ||
    phoneno == "" ||
    message == null ||
    message == ""
  ) {
    res.send(base.sendError("Please enter a all fillds required"));
  }

  if (typeof phoneno !== Number) {
    res.send(base.sendError("Provid Number in String Format"));
  }

  const data = getInvite({
    name,
    email,
    phoneno,
    message,
    created: formatted,
  });

  await data.save();
  res.send(base.sendResponse(data, "Data Inserted"));
});

module.exports = route;
