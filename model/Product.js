const mongoose = require("mongoose");
// const { ObjectId } = mongoose.Types;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: 2000,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
    },
    image: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    inStock: {
      type: String,
      required: true,
    },
    shippingFee: {
      type: String,
      trim: true,
      required: true,
    },
    weight: {
      type: String,
      trim: true,
    },
    discountPrice: {
      type: String,
      trim: true,
    },
    flashSale: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      enum: [
        "clothings",
        "shoes",
        "bags",
        "jewelry",
        "wedding-wears",
        "accessories",
      ],
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
