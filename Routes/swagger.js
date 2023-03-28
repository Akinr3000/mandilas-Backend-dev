const express = require("express");
const router = express.Router();
// Swagger documentation route
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mandilas Endpoints",
      version: "1.0.0",
      description: "Mandilas API documentation",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "testing server",
      },
      {
        url: "https://needless-caption-production.up.railway.app/",
        description: "Development server",
      },
    ],
  },
  apis: ["./Routes/*.js"],
};

const specs = swaggerJsdoc(swaggerOptions);

router.use("/docs", swaggerUi.serve);
router.get("/docs", swaggerUi.setup(specs));

// Console log where to access docs
console.log("Swagger documentation available at http://localhost:5000/docs");

module.exports = router;
