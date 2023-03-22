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
    type: Boolean,
  },
  rating: {
    type: Number,
  },
  created: {
    type: Date,
  },
});

const collection = mongoose.model("testimonial", Testimonial);

module.exports = collection;
