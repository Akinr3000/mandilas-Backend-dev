const asyncHandler = require("express-async-handler");
const DB = require("../model");
const { ErrorResponse, showError } = require("../utils/");

const getCategoriesCount = async () => {
  const bagsCount = await DB.Product.countDocuments({ category: "bags" });
  const clothingsCount = await DB.Product.countDocuments({
    category: "clothings",
  });
  const shoesCount = await DB.Product.countDocuments({ category: "shoes" });
  const jewelryCount = await DB.Product.countDocuments({
    category: "jewelry",
  });
  const weddingWearsCount = await DB.Product.countDocuments({
    category: "wedding-wears",
  });
  const accessoriesCount = await DB.Product.countDocuments({
    category: "accessories",
  });

  return [
    { bags: bagsCount },
    { clothings: clothingsCount },
    { shoes: shoesCount },
    { jewelries: jewelryCount },
    { weddingWears: weddingWearsCount },
    { accessories: accessoriesCount },
  ];
};

const getFlashSales = async () => {
  const availableFlashSales = await DB.Product.find({ flashSale: true }).select(
    "name description price image inStock shippingFee discountPrice flashSale"
  );

  return availableFlashSales;
};

const mainMenuData = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    res
      .status(400)
      .json(showError("Invalid request, check that User with ID exists", 400));
  }

  try {
    const user = await DB.User.findById(userId);
    if (!user) throw new ErrorResponse(`User does not exist`, 409);

    // query products
    const categories = await getCategoriesCount();

    const flashSales = await getFlashSales();

    res.status(200).json({
      success: true,
      generalInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
      numberOfProductsInEachCategory: categories,
      reels: [],
      flashSales,
      stores: [],
    });
  } catch (error) {
    const message = error.message || "Internal Server error";
    const cs = error.statusCode || 500;
    res.status(cs).json(showError(message, cs));
  }
});

module.exports = { mainMenuData };
