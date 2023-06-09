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
const testimonial = require("../Controller/dirctory/Testimonials/TestimonialsController");
const client = require("../Controller/dirctory/Client/ClientController");
const banner = require("../Controller/dirctory/banner/BannerController");
const featured = require("../Controller/dirctory/Featured/featuredCategoryController");
const featureddevloper = require("../Controller/dirctory/Featured/featuredDevloperController");

app.use("/category", verify, category);
app.use("/subcategory", verify, subcategory);
app.use("/childcategory", verify, childcategory);
app.use("/bussiness-user", bussinessuser);
app.use("/getinvite", getinvite);
app.use("/getcontact", getcontact);
app.use("/testimonial", testimonial);
app.use("/client", client);
app.use("/banner", banner);
app.use("/featuredcategory", featured);
app.use("/featureddevloper", featureddevloper);

module.exports = app;
