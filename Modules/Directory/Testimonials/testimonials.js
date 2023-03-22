const mongoose = require("mongoose");

const Testimonial = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  bussinesname: {
    type: String,
    required: true,
  },
  path: {
    // required: true,
    default: "None",
    type: String,
  },
  content: {
    type: String,
  },
  rating: {
    type: Number,
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

const collection = mongoose.model("testimonial", Testimonial);

module.exports = collection;
