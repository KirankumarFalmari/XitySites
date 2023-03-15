const express = require("express");
const route = express.Router();
const path = require("path");
// const cookie = require("cookie-parser");
require("../../Connection/connection");
const Register = require("../../Modules/Admin-users/admin-users");
const bodyparser = require("body-parser");

route.use(express.json());
route.use(bodyparser.json());
route.use(bodyparser.urlencoded({ extended: true }));
route.use(express.urlencoded({ extended: false }));
const static_path = path.join(__dirname, "../../Views/");

module.exports = route;
