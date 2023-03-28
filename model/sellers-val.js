const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const form = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: "USERS",
    required: true,
  },
  storename: {
    type: String,
    required: true,
    unique: true,
  },
  business: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  LGA: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("seller-validation", form, "form");
