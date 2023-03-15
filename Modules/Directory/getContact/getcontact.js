const mongoose = require("mongoose");

const GetInvite = mongoose.Schema({
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  bussinessname: {
    type: String,
  },
  email: {
    type: String,
  },
  phoneno: {
    type: Number,
  },
  subject: {
    type: String,
    // required: true,
  },
  message: {
    type: String,
    // required: true,
  },
  attachment: {
    type: String,
    // required: true,
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

const collection = mongoose.model("getContact", GetInvite);

module.exports = collection;
