//- Import middlewares
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

//-Import custom
const productRoute = require("./app/product/router");
const categoryRoute = require("./app/category/router");
const tagRoute = require("./app/tag/router");
//-auth
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

//page
//home
app.use("/auth", authRoute);
app.use("/api", productRoute, categoryRoute, tagRoute);
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
