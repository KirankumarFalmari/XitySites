//Other Class Define
const express = require("express");
const route = express.Router();
const path = require("path");
const bodyparser = require("body-parser");
var dateTime = require("node-datetime");
const ObjectId = require("mongodb").ObjectId;
const moment = require("moment");

require("../../Connection/connection");
const css_path = path.join(__dirname, "../../Public/");
// console.log(css_path);
route.use(express.static(css_path));

const country = require("../../Modules/Master/country");
const state = require("../../Modules/Master/state");
const city = require("../../Modules/Master/city");
const pincode = require("../../Modules/Master/pincode");

var dt = dateTime.create();
var formatted = dt.format("Y-m-d H:M:S");

//Fetch List
route.get("/", async (req, res) => {
  const data = await country.find({});
  // console.log(data);
  res.render("master/country/index", {
    data: data,
    moment: moment,
  });
});

//Create List
route.get("/create", (req, res) => {
  res.render("master/country/create");
});

route.post("/create", async (req, res) => {
  const data = country({
    name: req.body.name,
    created: formatted,
  });
  await data.save();
  res.redirect("/master/country/");
});

let id;
//Edit List
route.get("/edit/:id", async (req, res) => {
  id = req.params.id;
  const data = await country.find({ _id: new ObjectId(req.params.id.trim()) });
  // console.log(data);
  res.render("master/country/edit", {
    data: data,
    moment: moment,
  });
});

route.post("/edit", async (req, res) => {
  try {
    await country
      .findOneAndUpdate(
        { _id: id },
        {
          $set: {
            name: req.body.name,
            updated: formatted,
          },
        }
      )
      .then(() => {
        res.redirect("/master/country");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
});

route.get("/delete/:id", async (req, res) => {
  await country.findByIdAndDelete(req.params.id);
  await state.deleteMany({ categoryid: req.params.id });
  await city.deleteMany({ categoryid: req.params.id });
  await pincode.deleteMany({ categoryid: req.params.id });

  res.redirect("/master/country");
});

module.exports = route;
