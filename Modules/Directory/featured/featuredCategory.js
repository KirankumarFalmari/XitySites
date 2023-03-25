const mongoose = require("mongoose");

const Featured = mongoose.Schema({
  name: {
    type: String,
    required: true,
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

const collection = mongoose.model("featuredCategory", Featured);

module.exports = collection;
