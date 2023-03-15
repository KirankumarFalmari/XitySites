//Other Class
const express = require("express");
const auth = require("../Controller/auth/auth");
const app = express.Router();

//Define Controller
const category = require("../Controller/dirctory/CategoryController");
const subcategory = require("../Controller/dirctory/SubcategoryController");
// const childcategory = require("../Controller/dirctory/ChildcategoryController");
// const bussinessuser = require("../Controller/dirctory/Bussines-user/Bussiness-user");

app.use("/category", auth, category);
app.use("/subcategory", subcategory);
app.use("/childcategory", childcategory);
// app.use("/bussiness-user", bussinessuser);

module.exports = app;
