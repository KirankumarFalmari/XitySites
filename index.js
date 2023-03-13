//Other Class
const express = require("express");
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
const path = require("path");
const cookie = require("cookie-parser");
require("./Connection/connection");
const app = express();
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookie());
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
const css_path = path.join(__dirname, "./Public/");
app.use(express.static(css_path));

dotenv.config();

const auth = require("./Controls/auth/auth");
const login = require("./Controls/Login/login");
// const bussinessuser = require("./Controls/Bussines-user/Bussiness-user");
// const bussinesslogin = require("./Controls/Bussines-user/bussiness-login");
// const dashboard = require("./Controls/Dashboard/dashboard");
// const registrationControl = require("./Controls/Admin-user/Admin-user");

app.use("/", login);
// app.use("/bussiness-user", bussinessuser);
// app.use("/bussiness-login", bussinesslogin);

// app.use("/dashboard", auth, dashboard);

// app.use("/create", registrationControl);

//Start Route
const directoryroute = require("./route/directoryadmin");
app.use("/directory", directoryroute);
//End Route

//Start Route
const masterroute = require("./route/masteradmin");
app.use("/master", masterroute);
//End Route
let PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is up and running on ${PORT} ...`);
});
