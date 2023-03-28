const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = require("./config/db");
const morgan = require("morgan");
const { faker } = require("@faker-js/faker");
// const { notFound, errorHandler } = require("./middlewares/error");
const DB = require("./model/");
// routes imported

// DB function call
connectDB();

//Connect to database
try {
  mongoose.connect(process.env.DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  console.log("connected to db");
} catch (error) {
  handleError(error);
}
process.on("unhandledRejection", (error) => {
  console.log("unhandledRejection", error.message);
});

// parse requests of content-type - application/json
app.use(express.json());
app.use(morgan("dev"));

app.use(
  express.urlencoded({
    extended: true,
  })
);

const User = DB.User;

for (let i = 0; i < 40; i++) {
  const user = new User({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    isAdmin: false,
    phoneNumber: Array.from({ length: 10 }, () =>
      faker.random.numeric({ min: 1000000000, max: 9999999999 })
    ).toString(),
    resetToken: "",
    resetTokenExpiration: "",
  });
  user
    .save()
    .then(() => console.log("User saved to database"))
    .catch((err) => console.error(err));
}

app.listen(8000, function () {
  console.log("App running!");
});
