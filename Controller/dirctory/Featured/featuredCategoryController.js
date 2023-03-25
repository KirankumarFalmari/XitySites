//Other Class Define
const express = require("express");
const route = express.Router();
const path = require("path");

var dateTime = require("node-datetime");
const ObjectId = require("mongodb").ObjectId;
const moment = require("moment");

const flash = require("connect-flash");

require("../../../Connection/connection");
const css_path = path.join(__dirname, "../../../Public/");
// console.log(css_path);
route.use(express.static(css_path));
route.use(flash());

const featuredcategory = require("../../../Modules/Directory/featured/featuredCategory");

var dt = dateTime.create();
var formatted = dt.format("Y-m-d H:M:S");

//Fetch List
route.get("/", async (req, res) => {
  const data = await featuredcategory.find({});
  // console.log(data);
  res.render("directory/featuredcategory/index", {
    data: data,
    moment: moment,
    message: req.flash("message"),
  });
});

//Create List
route.get("/create", (req, res) => {
  res.render("directory/featuredcategory/create", {
    message: req.flash("message"),
  });
});

route.post("/create", async (req, res) => {
  const find = await featuredcategory.find({ name: req.body.name });

  if (find.length !== 0) {
    req.flash("message", "Featured Category Already Exists");
    res.redirect("/directory/featuredcategory/create");
  } else {
    const data = featuredcategory({
      name: req.body.name,
      created: formatted,
    });
    await data.save();
    req.flash("message", "Featured Category saved successfully");
    res.redirect("/directory/featuredcategory");
  }
});

let id;
//Edit List
route.get("/edit/:id", async (req, res) => {
  id = req.params.id;
  const data = await featuredcategory.find({
    _id: new ObjectId(req.params.id.trim()),
  });
  // console.log(data);
  res.render("directory/featuredcategory/edit", {
    data: data,
    moment: moment,
  });
});

route.post("/edit", async (req, res) => {
  try {
    await featuredcategory
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
        res.redirect("/directory/featuredcategory");
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
    let status = await featuredcategory.find(
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

    await featuredcategory
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
        res.redirect("/directory/featuredcategory");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
});

route.get("/delete/:id", async (req, res) => {
  await featuredcategory.findByIdAndDelete(req.params.id);

  res.redirect("/directory/featuredcategory");
});

module.exports = route;
