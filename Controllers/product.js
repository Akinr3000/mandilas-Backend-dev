const DB = require("../model");
const asyncHandler = require("express-async-handler");
const forms = require("../model/sellers-val");
const { ErrorResponse, showError, cloudinary } = require("../utils/");

const getpage = async (req, res) => {
  try {
    const form = await forms.find({ approved: true });
    res.render("product", { form });
  } catch (error) {
    console.log(error);
    res.sendstatus(500);
  }
};

const addProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    image,
    category,
    inStock,
    shippingFee,
    weight,
  } = req.body;
  console.log("still good");

  const quickCheck =
    !name ||
    !description ||
    !price ||
    !image ||
    !category ||
    !inStock ||
    !shippingFee ||
    !weight;

  if (quickCheck) {
    throw new ErrorResponse("Bad Request", 400);
  }

  console.log("still good");
  try {
    const duplicateProduct = await DB.Product.findOne({ name });
    if (duplicateProduct) {
      throw new ErrorResponse("Product exists please add to stock", 409);
    }

    const storedImage = await cloudinary.uploader.upload(image, {
      folder: "products",
    });
    if (!storedImage) {
      throw new ErrorResponse("could not save image", 500);
    }

    const product = await DB.Product.create({
      name,
      description,
      price,
      image: {
        public_id: storedImage.public_id,
        url: storedImage.secure_url,
      },
      category,
      inStock,
      shippingFee,
      weight,
    });

    if (product) {
      res.status(201).json({
        success: true,
        product,
      });
    } else {
      throw new ErrorResponse("Product not saved", 422);
    }
  } catch (error) {
    const message = error.message || "Internal Server error";
    const cs = error.statusCode || 500;
    res.status(cs).json(showError(message, cs));
  }
});

const increaseStock = asyncHandler(async (req, res) => {
  const { name, inStock } = req.body;

  if (!inStock || !name) {
    res.status(400).json(showError("invalid request", 400));
  }

  try {
    const product = await DB.Product.findOne({ name });

    if (!product) {
      throw new ErrorResponse("product with given name does not exist", 409);
    }

    let currentStock = parseInt(product.inStock);
    let incomingStock = parseInt(inStock);

    currentStock += incomingStock;
    const nowInStock = String(currentStock);

    // update the product
    product.inStock = nowInStock;
    await product.save();

    res.status(200).json({
      success: true,
      totalStock: product.inStock,
    });
  } catch (error) {
    const message = error.message || "Internal Server error";
    const cs = error.statusCode || 500;
    res.status(cs).json(showError(message, cs));
  }
});

const addtocart = (req,res)=>{
  req.user.addtocart(req.body.id)
    .then(() => {
      res.redirect("/cart")
    }).catch(err => console.log(err));
}

const getcart = (req,res) => {
req.user.populate("cart.items.productid").execPopulate().then(user => {
  res.render("user", {cart:user.cart});
}).catch(err => {console.log(err);})
}

const removecart = (req,res) => {
  req.user.removefromcart(req.body.prodId)
  .then(() => {
    res.redirect("/cart");
  }).catch((err) => {
    console.log(err);
  })
};

module.exports = { addProduct, getpage, increaseStock, addtocart, getcart, removecart};

// massive products addition
