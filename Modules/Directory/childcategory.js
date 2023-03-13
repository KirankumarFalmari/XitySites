const mongoose = require("mongoose");

const Childcategory = mongoose.Schema({
  categoryid: {
    required: true,
    type: String,
  },
  subcategoryid: {
    required: true,
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  path: {
    default: "None",
    // required: true,
    type: String,
  },
  status: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
  },
  updated: {
    type: Date,
  },
  deleted: {
    type: Date,
  },
});

const collection = mongoose.model("childcategory", Childcategory);

module.exports = collection;
