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
// route.use(express.static(moment));
const multer = require("multer");
const getContact = require("../../../Modules/Directory/getContact/getcontact");

const temp = path.join(__dirname, "../../upload/getContact/");
// console.log(temp);

route.use("/upload/getContact/", express.static(temp));
route.use(express.static(css_path));

const Storage = multer.diskStorage({
  destination: "./upload/getContact/",
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
  const data = await getContact.find({});
  res.render("directory/getcontact/index", {
    data: data,
    moment: moment,
  });
});

// Add Category
route.post("/", upload.single("image"), async (req, res) => {
  try {
    const data = getContact({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      bussinessname: req.body.bussinessname,
      email: req.body.email,
      phoneno: req.body.phoneno,
      subject: req.body.subject,
      message: req.body.message,
      attachment: req.file.path,
      created: formatted,
    });
    let result = await data.save();

    if (result) {
      res.json({
        success: "true",
        error: "Data Inserted",
      });
    } else {
      res.json({
        success: "false",
        error: "Data not inserted",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = route;
