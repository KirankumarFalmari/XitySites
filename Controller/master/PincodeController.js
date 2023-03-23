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
  const pdata = await pincode.find({});

  res.render("master/pincode/index", {
    data: data,
    cdata: cdata,
    sdata: sdata,
    pdata: pdata,
    message: req.flash("message"),
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
route.get("/citydata", async (req, res) => {
  const data = await city.find({});

  res.status(200).json(data);
});
route.get("/statedata", async (req, res) => {
  const data = await state.find({});
  res.status(200).json(data);
});

//Create List
route.get("/create", async (req, res) => {
  const sdata = await state.find({});
  const cdata = await country.find({});
  const data = await city.find({});
  res.render("master/pincode/create", {
    sdata: sdata,
    cdata: cdata,
    data: data,
    message: req.flash("message"),
    moment: moment,
  });
});

// Add country
route.post("/create", async (req, res) => {
  const find = await pincode.find({
    countryid: req.body.selectcountry,
    cityid: req.body.selectcity,
    stateid: req.body.selectstate,
    pincodeno: req.body.pincodeno,
    name: req.body.name,
  });
  if (find.length !== 0) {
    req.flash("message", "Pincode and Town Already Exists");
    res.redirect("/master/pincode/create");
  } else {
    const data = pincode({
      countryid: req.body.selectcountry,
      stateid: req.body.selectstate,
      cityid: req.body.selectcity,
      name: req.body.name,
      pincodeno: req.body.pincodeno,
      created: formatted,
    });

    await data.save();
    req.flash("message", "Pincode and Town saved successfully");
    res.redirect("/master/pincode");
  }
});

let id;
//Edit List
route.get("/edit/:id", async (req, res) => {
  id = req.params.id;
  const cdata = await country.find({});
  const sdata = await state.find({});
  const data = await city.find({});
  const pdata = await pincode.find({
    _id: new ObjectId(req.params.id.trim()),
  });
  // console.log(data);
  res.render("master/pincode/edit", {
    data: data,
    cdata: cdata,
    pdata: pdata,
    sdata: sdata,
    moment: moment,
  });
});

route.post("/edit", async (req, res) => {
  // console.log(req.body, id);
  try {
    await pincode
      .findOneAndUpdate(
        { _id: id },
        {
          $set: {
            countryid: req.body.selectcountry,
            stateid: req.body.selectstate,
            cityid: req.body.selectcity,
            name: req.body.name,
            pincodeno: req.body.pincodeno,
            created: formatted,
            updated: formatted,
          },
        }
      )
      .then(() => {
        // res.sendFile(static_path + "edit.html");
        res.redirect("/master/pincode");
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
    let status = await pincode.find({ _id: req.params.id }, { status: 1 });
    // console.log(status);
    let value;

    if (status[0].status == true) {
      value = false;
    } else {
      value = true;
    }

    await pincode
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
        res.redirect("/master/pincode");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
});

route.get("/delete/:id", async (req, res) => {
  await pincode.findByIdAndDelete(req.params.id);
  // await childcountry.deleteMany({ countryid: req.params.id });
  res.redirect("/master/pincode");
});

module.exports = route;
