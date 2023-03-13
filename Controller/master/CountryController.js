//Other Class Define
const express = require("express");
const route = express.Router();
const path = require("path");
require("../../Connection/connection");
const css_path = path.join(__dirname, "../../Public/");
// console.log(css_path);
route.use(express.static(css_path));

//Fetch List
route.get("/", (req, res) => {
  res.render("master/country/index");
});

module.exports = route;
