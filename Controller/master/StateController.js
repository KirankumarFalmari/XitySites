//Other Class Define
const express = require("express");
const route = express.Router();
const path = require("path");
const bodyparser = require("body-parser");
var dateTime = require("node-datetime");
require("../../Connection/connection");
const css_path = path.join(__dirname, "../../Public/");
const moment = require("moment");
const ObjectId = require("mongodb").ObjectId;
route.use(express.static(css_path));

const country = require("../../Modules/Master/country");
const state = require("../../Modules/Master/state");

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
  });
});

//Create List
route.get("/create", async (req, res) => {
  const data = await country.find({});
  res.render("master/state/create", {
    data: data,
    moment: moment,
  });
});

route.post("/create", async (req, res) => {
  const countrydata = await country.find({
    _id: new ObjectId(req.body.selectcountry.trim()),
  });
  if (countrydata) {
    const data = state({
      countryid: req.body.selectcountry,
      name: req.body.name,
      created: formatted,
    });

    await data.save();
    res.redirect("/master/state/");
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

route.get("/delete/:id", async (req, res) => {
  await state.findByIdAndDelete(req.params.id);
  // await childcategory.deleteMany({ subcategoryid: req.params.id });
  res.redirect("/master/state");
});

module.exports = route;