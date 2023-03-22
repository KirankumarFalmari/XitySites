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
const testimonials = require("../../../Modules/Directory/Testimonials/testimonials");

const temp = path.join(__dirname, "../../upload/testimonials/");

route.use("/upload/testimonials/", express.static(temp));
route.use(express.static(css_path));

const Storage = multer.diskStorage({
  destination: "./upload/testimonials/",
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

// //Fetch List
route.get("/", async (req, res) => {
  const data = await testimonials.find({});
  res.render("directory/Testimonial/index", {
    data: data,
    moment: moment,
  });
});

//Create List
route.get("/create", (req, res) => {
  res.render("directory/testimonial/create");
});

// Add testimonials
route.post("/create", upload.single("image"), async (req, res) => {
  const data = testimonials({
    name: req.body.name,
    bussinesname: req.body.bname,
    path: req.file.path,
    content: req.body.content,
    rating: req.body.rating,
    created: formatted,
  });

  await data.save();
  res.redirect("/directory/testimonial");
});

// route.get("/search/:key", async (req, resp) => {
//   let data = await testimonials.find({
//     $or: [{ name: { $regex: req.params.key } }],
//   });
//   // console.log(data);
//   resp.send(data);
// });

let id;
//Edit List
route.get("/edit/:id", async (req, res) => {
  id = req.params.id;
  const data = await testimonials.find({
    _id: new ObjectId(req.params.id.trim()),
  });
  // console.log(data);
  res.render("directory/testimonial/edit", {
    data: data,
    moment: moment,
  });
});

route.post("/edit", async (req, res) => {
  // console.log(req.body, id);
  try {
    await testimonials
      .findOneAndUpdate(
        { _id: id },
        {
          $set: {
            name: req.body.name,
            bussinesname: req.body.bname,
            // path: req.file.path,
            content: req.body.content,
            rating: req.body.rating,
            updated: formatted,
          },
        }
      )
      .then(() => {
        // res.sendFile(static_path + "edit.html");
        res.redirect("/directory/testimonial");
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
    let status = await testimonials.find({ _id: req.params.id }, { status: 1 });
    // console.log(status);
    let value;

    if (status[0].status == true) {
      value = false;
    } else {
      value = true;
    }

    await testimonials
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
        res.redirect("/directory/testimonial");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
});

route.get("/delete/:id", async (req, res) => {
  await testimonials.findByIdAndDelete(req.params.id);
  res.redirect("/directory/testimonial");
});

module.exports = route;
