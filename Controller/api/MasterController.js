const base = require("./BaseController");
const state = require("../../Modules/Master/state");
const city = require("../../Modules/Master/city");
const country = require("../../Modules/Master/country");
const pincode = require("../../Modules/Master/pincode");

const getState = async (res) => {
  const statelist = await state.find({ status: false }, { _id: 1, name: 1 });
  res.send(base.sendResponse(statelist, "State Sucess"));
};

const getCity = async (res) => {
  const citylist = await city.find({ status: false }, { _id: 1, name: 1 });
  res.send(base.sendResponse(citylist, "City List detail"));
};

const getCountry = async (res) => {
  const countrylist = await country.find(
    { status: false },
    { _id: 1, name: 1 }
  );
  res.send(base.sendResponse(countrylist, "Country List detail"));
};

const getPincode = async (res) => {
  const countrylist = await pincode.find(
    { status: false },
    { _id: 1, name: 1, pincodeno: 1 }
  );
  res.send(base.sendResponse(countrylist, "Pincode and Town List detail"));
};

const data = {
  getState,
  getCity,
  getCountry,
  getPincode,
};

module.exports = data;
