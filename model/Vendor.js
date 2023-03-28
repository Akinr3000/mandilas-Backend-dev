const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const vendorSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: "USERS",
    required: true,
  },
  seller: {
    type: ObjectId,
    ref: "form",
  },
  // uniqueID: String,
  storeToken: String,
  storeTokenExpiration: Date,
});

module.exports = mongoose.model("vendor", vendorSchema);
