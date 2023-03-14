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

const category = require("../../Modules/Master/country");
const subcategory = require("../../Modules/Master/state");
const childcategory = require("../../Modules/Master/city");

route.use(express.static(css_path));

var dt = dateTime.create();
var formatted = dt.format("Y-m-d H:M:S");

//Fetch List
route.get("/", async (req, res) => {
  const data = await childcategory.find({});
  const cdata = await category.find({});
  const sdata = await subcategory.find({});

  res.render("master/city/index", {
    data: data,
    cdata: cdata,
    sdata: sdata,
    moment: moment,
  });
});
// route.get("/search/:key", async (req, resp) => {
//   let data = await childcategory.find({
//     $or: [{ name: { $regex: req.params.key } }],
//   });
//   resp.send(data);
// });

// get data
route.get("/data", async (req, res) => {
  const data = await subcategory.find({});
  // const data = subcategory.find({ _id: req.params.id });
  // res.json(data);
  //   console.log(data);
  res.status(200).json(data);
});

//Create List
route.get("/create", async (req, res) => {
  const sdata = await subcategory.find({});
  const cdata = await category.find({});
  res.render("master/city/create", {
    sdata: sdata,
    cdata: cdata,
    moment: moment,
  });
});

// Add Category
route.post("/create", async (req, res) => {
  const data = childcategory({
    countryid: req.body.selectcategory,
    stateid: req.body.selectsubcategory,
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
  const cdata = await category.find({});
  const sdata = await subcategory.find({});
  const data = await childcategory.find({
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
    await childcategory
      .findOneAndUpdate(
        { _id: id },
        {
          $set: {
            countryid: req.body.selectcategory,
            stateid: req.body.selectsubcategory,
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
  await childcategory.findByIdAndDelete(req.params.id);
  // await childcategory.deleteMany({ categoryid: req.params.id });
  res.redirect("/master/city");
});

module.exports = route;
