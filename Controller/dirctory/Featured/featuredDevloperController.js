//Other Class Define
const express = require("express");
const route = express.Router();
const path = require("path");
const bodyparser = require("body-parser");
var dateTime = require("node-datetime");
require("../../../Connection/connection");
const css_path = path.join(__dirname, "../../Public/");
const moment = require("moment");

const ObjectId = require("mongodb").ObjectId;
const multer = require("multer");
const fcategory = require("../../../Modules/Directory/featured/featuredCategory");
const featureddevloper = require("../../../Modules/Directory/featured/featuredDevloper");

const temp = path.join(__dirname, "../../upload/featureddevloper/");
// console.log(css_path);

route.use("/upload/featureddevloper/", express.static(temp));
route.use(express.static(css_path));

const Storage = multer.diskStorage({
  destination: "./upload/featureddevloper/",
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
  const data = await featureddevloper.find({});
  const cdata = await fcategory.find({});

  // console.log(data);
  res.render("directory/featureddevloper/index", {
    data: data,
    cdata: cdata,
    moment: moment,
    message: req.flash("message"),
  });
});

route.get("/search/:key", async (req, resp) => {
  let data = await featureddevloper.find({
    $or: [{ name: { $regex: req.params.key } }],
  });
  const cdata = await fcategory.find({});
  resp.send(data);
});

//Create List
route.get("/create", async (req, res) => {
  const data = await fcategory.find({});
  res.render("directory/featureddevloper/create", {
    data: data,
    moment: moment,
    message: req.flash("message"),
  });
});

// Add Category
route.post("/create", upload.single("image"), async (req, res) => {
  // console.log(req.body);
  const categorydata = await fcategory.find({
    _id: new ObjectId(req.body.selectcategory.trim()),
  });
  const find = await featureddevloper.find({
    featuredcategoryid: req.body.selectcategory,
    name: req.body.name,
  });
  if (find.length !== 0) {
    req.flash("message", "featureddevloper Already Exists");
    res.redirect("/directory/featureddevloper/create");
  } else {
    if (categorydata) {
      const data = featureddevloper({
        featuredcategoryid: req.body.selectcategory,
        name: req.body.name,
        review: req.body.review,
        location: req.body.location,
        path: req.file.path,
        created: formatted,
      });

      await data.save();
      req.flash("message", "featureddevloper saved successfully");
      res.redirect("/directory/featureddevloper/");
    }
  }
});

let id;
//Edit List
route.get("/edit/:id", async (req, res) => {
  id = req.params.id;
  const cdata = await fcategory.find({});
  const data = await featureddevloper.find({
    _id: new ObjectId(req.params.id.trim()),
  });
  // console.log(data);
  // console.log(cdata);
  res.render("directory/featureddevloper/edit", {
    data: data,
    cdata: cdata,
    moment: moment,
  });
});

route.post("/edit", async (req, res) => {
  // console.log(req.body.selectcategory, id);
  try {
    await featureddevloper
      .findOneAndUpdate(
        { _id: id },
        {
          $set: {
            featuredcategoryid: req.body.selectcategory,
            name: req.body.name,
            review: req.body.review,
            location: req.body.location,
            updated: formatted,
          },
        }
      )
      .then(() => {
        // res.sendFile(static_path + "edit.html");
        res.redirect("/directory/featureddevloper");
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
    let status = await featureddevloper.find(
      { _id: req.params.id },
      { status: 1 }
    );
    // console.log(status);
    let value;
    if (status[0].status == true) {
      value = false;
    } else {
      value = true;
    }

    await featureddevloper
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
        res.redirect("/directory/featureddevloper");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
});

route.get("/delete/:id", async (req, res) => {
  await featureddevloper.findByIdAndDelete(req.params.id);

  res.redirect("/directory/featureddevloper");
});

module.exports = route;
