const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registerSchema = new mongoose.Schema({
  fullname: {
    type: String,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  phoneno: {
    type: Number,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  polices: {
    type: Boolean,
    // required: true,
    default: true,
  },
  token: {
    type: String,
    required: true,
  },
});

registerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  }
});

registerSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.token = token;
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

const Register = mongoose.model("Bussiness-user", registerSchema);
module.exports = Register;
