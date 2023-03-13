const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://127.0.0.1:27017/XitySites")
  .then(() => {
    console.log("connected successfully");
  })
  .catch((error) => {
    console.log("connection Failed");
  });
