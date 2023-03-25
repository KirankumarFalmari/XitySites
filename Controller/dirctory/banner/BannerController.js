//Other Class Define
const express = require("express");
const route = express.Router();
const path = require("path");

var dateTime = require("node-datetime");
require("../../../Connection/connection");
const css_path = path.join(__dirname, "../../../Public/");

const moment = require("moment");
const ObjectId = require("mongodb").ObjectId;
const multer = require("multer");
const banner = require("../../../Modules/Directory/banner/banner");

const temp = path.join(__dirname, "../../../upload/banner/");

route.use("/upload/banner/", express.static(temp));
route.use(express.static(css_path));

const Storage = multer.diskStorage({
  destination: "./upload/banner/",
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
  const data = await banner.find({});
  res.render("directory/banner/index", {
    data: data,
    moment: moment,
    message: req.flash("message"),
  });
});

//Create List
route.get("/create", (req, res) => {
  res.render("directory/banner/create", { message: req.flash("message") });
});

// Add banner
route.post("/create", upload.single("image"), async (req, res) => {
  const find = await banner.find({ name: req.body.name });

  if (find.length !== 0) {
    req.flash("message", "banner Already Exists");
    res.redirect("/directory/banner/create");
  } else {
    const data = banner({
      name: req.body.name,
      details: req.body.details,
      pagename: req.body.pagename,
      path: req.file.path,
      created: formatted,
    });
    await data.save();
    req.flash("message", "banner saved successfully");
    res.redirect("/directory/banner");
  }
});

route.get("/search/:key", async (req, resp) => {
  let data = await banner.find({
    $or: [{ name: { $regex: req.params.key } }],
  });
  // console.log(data);
  resp.send(data);
});

let id;
//Edit List
route.get("/edit/:id", async (req, res) => {
  id = req.params.id;
  const data = await banner.find({ _id: new ObjectId(req.params.id.trim()) });
  // console.log(data);
  res.render("directory/banner/edit", {
    data: data,
    moment: moment,
  });
});

route.post("/edit", async (req, res) => {
  // console.log(req.body, id);
  try {
    await banner
      .findOneAndUpdate(
        { _id: id },
        {
          $set: {
            name: req.body.name,
            details: req.body.details,
            pagename: req.body.pagename,
            updated: formatted,
          },
        }
      )
      .then(() => {
        // res.sendFile(static_path + "edit.html");
        res.redirect("/directory/banner");
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
    let status = await banner.find({ _id: req.params.id }, { status: 1 });
    let value;

    if (status[0].status == true) {
      value = false;
    } else {
      value = true;
    }

    await banner
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
        res.redirect("/directory/banner");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
});

route.get("/delete/:id", async (req, res) => {
  await banner.findByIdAndDelete(req.params.id);

  res.redirect("/directory/banner");
});

module.exports = route;
