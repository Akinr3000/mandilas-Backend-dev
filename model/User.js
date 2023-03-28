const mongoose = require("mongoose");

const Product = require("../model/Product");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  phoneNumber: {
    type: String,
  },
  cart:{
    items:[{
      productid:{
      type:mongoose.Types.ObjectId,
      required:true
    },
    qty: {
      type:Number,
      required:true,
    },
    }],
    totalprice:Number
  },
  resetToken: String,
  resetTokenExpiration: Date,
});

UserSchema.methods.addtocart = async function(productid){
  const product = await Product.findById(productid);
  if(product){
    const cart = this.cart;
    const isExisting = cart.items.findIndex(cp => {
      cp.productid.toString() === product._id.toString();
      if(isExisting >= 0){
        cart.items[isExisting].qty += 1;
      } else{
        cart.items.push({productid:product._id, qty: 1})
      }
        if (!cart.totalprice) {
          cart.totalprice = 0
        }
        cart.totalprice += product.price;
        return this.save();
    })
  }
  };
  
UserSchema.methods.removefromcart = async function (productid){
    const cart = this.cart
    const isExisting = cart.items.findIndex(pc => {
      cp.productid.toString() === productid.toString()
    });
    if(isExisting >= 0){
      const prod = await Product.findById(productid);
      cart.totalprice -= prod.price * cart.items[isExisting].qty;
      cart.items.splice(isExisting, 1);
      return this.save();
    }
  }
  
UserSchema.methods.clearcart = function(){
  this.cart = { cart: [] };
  return this.save();
};

module.exports = mongoose.model("User", UserSchema, "USERS");
