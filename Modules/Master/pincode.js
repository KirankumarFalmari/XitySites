const mongoose = require("mongoose");

const Pincode = mongoose.Schema({
  countryid: {
    type: String,
  },
  stateid: {
    type: String,
  },
  cityid: {
    type: String,
  },
  name: {
    type: String,
  },
  pincodeno: {
    type: Number,
    required: true,
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

const collection = mongoose.model("pincode", Pincode);

module.exports = collection;
