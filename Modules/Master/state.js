const mongoose = require("mongoose");

const State = mongoose.Schema({
  countryid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    // required: true,
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

const collection = mongoose.model("state", State);

module.exports = collection;
