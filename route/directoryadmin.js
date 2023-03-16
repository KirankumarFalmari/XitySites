//Other Class
const express = require("express");
const auth = require("../Controller/auth/auth");
const verify = require("../Controller/auth/verifyToken");
const app = express.Router();

//Define Controller
const category = require("../Controller/dirctory/CategoryController");
const subcategory = require("../Controller/dirctory/SubcategoryController");
const childcategory = require("../Controller/dirctory/ChildcategoryController");
const bussinessuser = require("../Controller/dirctory/Bussines-user/Bussiness-user");
const getinvite = require("../Controller/dirctory/getInvite/GetInviteController");
const getcontact = require("../Controller/dirctory/getcontact/GetContactController");

app.use("/category", verify, category);
app.use("/subcategory", verify, subcategory);
app.use("/childcategory", verify, childcategory);
app.use("/bussiness-user", bussinessuser);
app.use("/getinvite", getinvite);
app.use("/getcontact", getcontact);

module.exports = app;
