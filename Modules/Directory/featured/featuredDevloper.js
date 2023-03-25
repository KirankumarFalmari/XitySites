const mongoose = require("mongoose");

const Category = mongoose.Schema({
  featuredcategoryid: {
    required: true,
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  review: {
    required: true,
    type: Number,
  },
  location: {
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
    default: true,
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

const collection = mongoose.model("featuredDevloper", Category);

module.exports = collection;
