const express = require("express");
const app = express();
const connectDB = require("./config/db");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { notFound, errorHandler } = require("./middlewares/error");
// routes imported
const swagger = require("./Routes/swagger");
const admin = require("./Routes/admin");
const { authRoutes, productRoutes, mainMenuDataRoutes } = require("./Routes/");

// DB function call
connectDB();

// middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods: POST,GET,OPTIONS");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  next();
});
app.use(cors());
app.use(cookieParser());

// routes declared
app.use("/api", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/menu", mainMenuDataRoutes);
app.use("/admin", admin);
app.use("/", swagger);

// errorHandling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server is running on: " + PORT));
