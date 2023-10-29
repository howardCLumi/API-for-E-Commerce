const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");

mongoose.connect(
  "mongodb+srv://node-shop:" +
    process.env.MONGO_ATLAS_PW +
    "@cluster0.p3gbtlj.mongodb.net/?retryWrites=true&w=majority"
);

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.use((res, req, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
// These two are middlewares
app.use("/products", productRoutes);
app.use("/orders", ordersRoutes);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
