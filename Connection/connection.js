const mongoose = require("mongoose");

// mongoose.set("strictQuery", true);
const data = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose
  .connect(
    "mongodb+srv://kirankumarfalmari:Kiran123@cluster0.zretqvn.mongodb.net/xitysites?retryWrites=true&w=majority",
    data
  )
  .then(() => {
    console.log("connected successfully");
  })
  .catch((error) => {
    console.log(error);
  });

// mongodb://127.0.0.1:27017/XitySites
