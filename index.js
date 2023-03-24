//Other Class
const express = require("express");
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const cookie = require("cookie-parser");
require("./Connection/connection");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);
app.use(cookie());
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/Views"));
const css_path = path.join(__dirname, "./Public/");
app.use(express.static(css_path));
app.use(
  session({
    key: "flash",
    secret: "secret",
    cookie: {
      maxAge: 60000,
    },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

dotenv.config();

const auth = require("./Controller/auth/auth");
const login = require("./Controller/Login/login");
const bussinessuser = require("./Controller/dirctory/Bussines-user/Bussiness-user");
const bussinesslogin = require("./Controller/dirctory/Bussines-user/bussiness-login");
// const dashboard = require("./Controls/Dashboard/dashboard");

app.use("/", login);

app.get("/logout", (req, res) => {
  if (req.cookies.jwtoken) {
    res.clearCookie("jwtoken");
    res.clearCookie("flash");
    res.redirect("/");
  } else {
    res.redirect("/");
  }
});

// api get dada Country state city pincode
const api = require("./route/api");
app.use("/api", api);

// bussiness login and create api
app.use("/bussiness-user", bussinessuser);
app.use("/bussiness-login", bussinesslogin);
// app.use("/dashboard", auth, dashboard);

//Start Route
const directoryroute = require("./route/directoryadmin");
app.use("/directory", directoryroute);
//End Route

//Start Route
const masterroute = require("./route/masteradmin");
app.use("/master", masterroute);
//End Route
// console.log(process.env.PORT);
let PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is up and running on ${PORT} ...`);
});
