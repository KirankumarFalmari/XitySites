const mongoose = require("mongoose");

const GetInvite = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phoneno: {
    type: Number,
  },
  message: {
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

const collection = mongoose.model("getInvite", GetInvite);

module.exports = collection;
