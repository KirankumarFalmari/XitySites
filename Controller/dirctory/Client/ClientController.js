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
const client = require("../../../Modules/Directory/client/client");

const temp = path.join(__dirname, "../../upload/client/");

route.use("/upload/client/", express.static(temp));
route.use(express.static(css_path));

const Storage = multer.diskStorage({
  destination: "./upload/client/",
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
  const data = await client.find({});
  res.render("directory/client/index", {
    data: data,
    moment: moment,
  });
});

//Create List
route.get("/create", (req, res) => {
  res.render("directory/client/create");
});

// Add Category
route.post("/create", upload.single("image"), async (req, res) => {
  const data = client({
    name: req.body.name,
    path: req.file.path,
    created: formatted,
  });

  await data.save();
  res.redirect("/directory/client");
});

route.get("/search/:key", async (req, resp) => {
  let data = await client.find({
    $or: [{ name: { $regex: req.params.key } }],
  });
  // console.log(data);
  resp.send(data);
});

let id;
//Edit List
route.get("/edit/:id", async (req, res) => {
  id = req.params.id;
  const data = await client.find({ _id: new ObjectId(req.params.id.trim()) });
  // console.log(data);
  res.render("directory/client/edit", {
    data: data,
    moment: moment,
  });
});

route.post("/edit", async (req, res) => {
  // console.log(req.body, id);
  try {
    await client
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
        res.redirect("/directory/client");
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
    let status = await client.find({ _id: req.params.id }, { status: 1 });
    // console.log(status);
    let value;

    if (status[0].status == true) {
      value = false;
    } else {
      value = true;
    }

    await client
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
        res.redirect("/directory/client");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
});

route.get("/delete/:id", async (req, res) => {
  await client.findByIdAndDelete(req.params.id);
  res.redirect("/directory/client");
});

module.exports = route;
