const mongoose = require("mongoose");

const Banner = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  pagename: {
    type: String,
    required: true,
  },
  path: {
    // required: true,
    default: "None",
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

const collection = mongoose.model("banner", Banner);

module.exports = collection;
