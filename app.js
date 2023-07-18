//- Import middlewares
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
//custom
const { decodeToken } = require("./middlewares");

//-Import custom
//-auth
//-product
const productRoute = require("./app/product/router");
const categoryRoute = require("./app/category/router");
const tagRoute = require("./app/tag/router");
const deliveryAddressRoute = require("./app/deliveryAddress/router");
const cartRoute = require("./app/cart/router");
const orderRoute = require("./app/order/router");
const invoiceRoute = require("./app/invoice/router");
const authRoute = require("./app/auth/router");

//Initialize
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
//custom middlewares
app.use(decodeToken());
//page
//home
app.use("/auth", authRoute);
app.use(
  "/api",
  productRoute,
  categoryRoute,
  tagRoute,
  deliveryAddressRoute,
  cartRoute,
  orderRoute,
  invoiceRoute
);
app.get("/", async function (req, res, next) {
  try {
    res.render("index", {
      title: "Eduwork API Services",
    });
  } catch (err) {
    console.log(err);
  }
  next();
});

// catch 404 and forward to error handler
app.use(async function (req, res, next) {
  try {
    next(createError(404));
  } catch (err) {
    console.log(err);
  }
});

// error handler
app.use(function (err, req, res, next) {
  try {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
  } catch (error) {
    res.status(err.status || 500);
    res.render("error");
  }
});

module.exports = app;
