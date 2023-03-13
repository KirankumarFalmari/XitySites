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
const multer = require("multer");
const category = require("../../Modules/Directory/category");
const subcategory = require("../../Modules/Directory/subcategory");
const childcategory = require("../../Modules/Directory/childcategory");

const temp = path.join(__dirname, "../../upload/childcategory/");
// console.log(css_path);

route.use("/upload/childcategory/", express.static(temp));
route.use(express.static(css_path));

const Storage = multer.diskStorage({
  destination: "./upload/childcategory/",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: Storage,
});

var dt = dateTime.create();
var formatted = dt.format("Y-m-d H:M:S");

//Fetch List
route.get("/", async (req, res) => {
  const data = await childcategory.find({});
  const cdata = await category.find({});
  const sdata = await subcategory.find({});

  res.render("directory/childcategory/index", {
    data: data,
    cdata: cdata,
    sdata: sdata,
    moment: moment,
  });
});

// get data
route.get("/data", async (req, res) => {
  const data = await subcategory.find({});
  // const data = subcategory.find({ _id: req.params.id });
  // res.json(data);
  res.status(200).json(data);
});

//Create List
route.get("/create", async (req, res) => {
  const sdata = await subcategory.find({});
  const cdata = await category.find({});
  res.render("directory/childcategory/create", {
    sdata: sdata,
    cdata: cdata,
    moment: moment,
  });
});

// Add Category
route.post("/create", upload.single("image"), async (req, res) => {
  // console.log(req.body);
  // const categorydata = await subcategory.find({
  //   _id: new ObjectId(req.body.selectcategory.trim()),
  // });
  //   console.log(categorydata);
  // if (categorydata) {
  const data = childcategory({
    // categoryid: categorydata[0].categoryid,
    categoryid: req.body.selectcategory,
    subcategoryid: req.body.selectsubcategory,
    name: req.body.name,
    path: req.file.path,
    created: formatted,
  });

  await data.save();
  res.redirect("/directory/childcategory");
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
  res.render("directory/childcategory/edit", {
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
            categoryid: req.body.selectcategory,
            subcategoryid: req.body.selectsubcategory,
            name: req.body.name,
            updated: formatted,
          },
        }
      )
      .then(() => {
        // res.sendFile(static_path + "edit.html");
        res.redirect("/directory/childcategory");
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
  res.redirect("/directory/childcategory");
});

module.exports = route;
