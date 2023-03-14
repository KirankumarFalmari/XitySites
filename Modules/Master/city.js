const mongoose = require("mongoose");

const City = mongoose.Schema({
  countryid: {
    type: String,
    required: true,
  },
  stateid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    required: true,
  },
  updated: {
    type: Date,
  },
  deleted: {
    type: Date,
  },
});

const collection = mongoose.model("city", City);

module.exports = collection;
