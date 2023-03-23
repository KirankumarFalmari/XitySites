//Other Class Define
const express = require("express");
const route = express.Router();
const path = require("path");
const bodyparser = require("body-parser");
var dateTime = require("node-datetime");
require("../../Connection/connection");
const css_path = path.join(__dirname, "../../Public/");
const moment = require("moment");
const base = require("../api//BaseController");
const ObjectId = require("mongodb").ObjectId;
route.use(express.static(css_path));

const country = require("../../Modules/Master/country");
const state = require("../../Modules/Master/state");
const city = require("../../Modules/Master/city");
const pincode = require("../../Modules/Master/pincode");

var dt = dateTime.create();
var formatted = dt.format("Y-m-d H:M:S");

//Fetch List
route.get("/", async (req, res) => {
  const cdata = await country.find({});
  const data = await state.find({});
  res.render("master/state/index", {
    data: data,
    cdata: cdata,
    moment: moment,
    message: req.flash("message"),
  });
});

//Create List
route.get("/create", async (req, res) => {
  const data = await country.find({});
  res.render("master/state/create", {
    data: data,
    moment: moment,
    message: req.flash("message"),
  });
});

route.post("/create", async (req, res) => {
  const countrydata = await country.find({
    _id: new ObjectId(req.body.selectcountry.trim()),
  });
  const find = await state.find({
    countryid: req.body.selectcountry,
    name: req.body.name,
  });
  if (find.length !== 0) {
    req.flash("message", "State Already Exists");
    res.redirect("/master/state/create");
  } else {
    if (countrydata) {
      const data = state({
        countryid: req.body.selectcountry,
        name: req.body.name,
        created: formatted,
      });

      await data.save();
      req.flash("message", "State saved successfully");
      res.redirect("/master/state/");
    }
  }
});

let id;
//Edit List
route.get("/edit/:id", async (req, res) => {
  id = req.params.id;
  const cdata = await country.find({});
  const data = await state.find({
    _id: new ObjectId(req.params.id.trim()),
  });
  // console.log(data);
  // console.log(cdata);
  res.render("master/state/edit", {
    data: data,
    cdata: cdata,
    moment: moment,
  });
});

route.post("/edit", async (req, res) => {
  try {
    await state
      .findOneAndUpdate(
        { _id: id },
        {
          $set: {
            countryid: req.body.selectcountry,
            name: req.body.name,
            updated: formatted,
          },
        }
      )
      .then(() => {
        // res.sendFile(static_path + "edit.html");
        res.redirect("/master/state");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
});

route.get("/status/:id", async (req, res) => {
  try {
    // console.log(req.params.id);
    let status = await state.find({ _id: req.params.id }, { status: 1 });
    // console.log(status);
    let value;

    if (status[0].status == true) {
      value = false;
    } else {
      value = true;
    }

    await state
      .findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            status: value,
            updated: formatted,
          },
        }
      )
      .then(() => {
        res.redirect("/master/state");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
});

route.get("/delete/:id", async (req, res) => {
  await state.findByIdAndDelete(req.params.id);
  await city.deleteMany({ stateid: req.params.id });
  await pincode.deleteMany({ stateid: req.params.id });
  res.redirect("/master/state");
});

module.exports = route;
