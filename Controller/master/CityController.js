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

const country = require("../../Modules/Master/country");
const state = require("../../Modules/Master/state");
const city = require("../../Modules/Master/city");
const pincode = require("../../Modules/Master/pincode");

route.use(express.static(css_path));

var dt = dateTime.create();
var formatted = dt.format("Y-m-d H:M:S");

//Fetch List
route.get("/", async (req, res) => {
  const data = await city.find({});
  const cdata = await country.find({});
  const sdata = await state.find({});

  res.render("master/city/index", {
    data: data,
    cdata: cdata,
    sdata: sdata,
    moment: moment,
  });
});
// route.get("/search/:key", async (req, resp) => {
//   let data = await city.find({
//     $or: [{ name: { $regex: req.params.key } }],
//   });
//   resp.send(data);
// });

// get data
route.get("/data", async (req, res) => {
  const data = await state.find({});
  // const data = state.find({ _id: req.params.id });
  // res.json(data);
  //   console.log(data);
  res.status(200).json(data);
});

//Create List
route.get("/create", async (req, res) => {
  const sdata = await state.find({});
  const cdata = await country.find({});
  res.render("master/city/create", {
    sdata: sdata,
    cdata: cdata,
    moment: moment,
  });
});

// Add country
route.post("/create", async (req, res) => {
  const data = city({
    countryid: req.body.selectcountry,
    stateid: req.body.selectstate,
    name: req.body.name,
    created: formatted,
  });

  await data.save();
  res.redirect("/master/city");
  // }
});

let id;
//Edit List
route.get("/edit/:id", async (req, res) => {
  id = req.params.id;
  const cdata = await country.find({});
  const sdata = await state.find({});
  const data = await city.find({
    _id: new ObjectId(req.params.id.trim()),
  });
  // console.log(data);
  res.render("master/city/edit", {
    data: data,
    cdata: cdata,
    sdata: sdata,
    moment: moment,
  });
});

route.post("/edit", async (req, res) => {
  // console.log(req.body, id);
  try {
    await city
      .findOneAndUpdate(
        { _id: id },
        {
          $set: {
            countryid: req.body.selectcountry,
            stateid: req.body.selectstate,
            name: req.body.name,
            updated: formatted,
          },
        }
      )
      .then(() => {
        // res.sendFile(static_path + "edit.html");
        res.redirect("/master/city");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
});

route.get("/delete/:id", async (req, res) => {
  await city.findByIdAndDelete(req.params.id);
  await pincode.deleteMany({ cityid: req.params.id });
  res.redirect("/master/city");
});

module.exports = route;
