const mongoose = require("mongoose");

const client = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  path: {
    // required: true,
    default: "None",
    type: String,
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

const collection = mongoose.model("client", client);

module.exports = collection;
