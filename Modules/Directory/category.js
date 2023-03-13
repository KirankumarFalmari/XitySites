const mongoose = require("mongoose");

const Category = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  path: {
    required: true,
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

const collection = mongoose.model("category", Category);

module.exports = collection;
