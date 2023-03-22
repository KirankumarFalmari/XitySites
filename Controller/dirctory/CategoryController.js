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
// route.use(express.static(moment));
const multer = require("multer");
const category = require("../../Modules/Directory/category");
const subcategory = require("../../Modules/Directory/subcategory");
const childcategory = require("../../Modules/Directory/childcategory");

const temp = path.join(__dirname, "../../upload/category/");
// console.log(temp);

route.use("/upload/category/", express.static(temp));
route.use(express.static(css_path));

const Storage = multer.diskStorage({
  destination: "./upload/category/",
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
  const data = await category.find({});
  res.render("directory/category/index", {
    data: data,
    moment: moment,
  });
});

//Create List
route.get("/create", (req, res) => {
  res.render("directory/category/create");
});

// Add Category
route.post("/create", upload.single("image"), async (req, res) => {
  const data = category({
    name: req.body.name,
    path: req.file.path,
    created: formatted,
  });

  await data.save();
  res.redirect("/directory/category");
});

route.get("/search/:key", async (req, resp) => {
  let data = await category.find({
    $or: [{ name: { $regex: req.params.key } }],
  });
  // console.log(data);
  resp.send(data);
});

let id;
//Edit List
route.get("/edit/:id", async (req, res) => {
  id = req.params.id;
  const data = await category.find({ _id: new ObjectId(req.params.id.trim()) });
  // console.log(data);
  res.render("directory/category/edit", {
    data: data,
    moment: moment,
  });
});

route.post("/edit", async (req, res) => {
  // console.log(req.body, id);
  try {
    await category
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
        // res.sendFile(static_path + "edit.html");
        res.redirect("/directory/category");
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
    let status = await category.find({ _id: req.params.id }, { status: 1 });
    // console.log(status);
    let value;

    if (status[0].status == true) {
      value = false;
    } else {
      value = true;
    }

    await category
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
        res.redirect("/directory/category");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
});

route.get("/delete/:id", async (req, res) => {
  await category.findByIdAndDelete(req.params.id);
  await subcategory.deleteMany({ categoryid: req.params.id });
  await childcategory.deleteMany({ categoryid: req.params.id });

  res.redirect("/directory/category");
});

module.exports = route;
