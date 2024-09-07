require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { sequelize } = require("./models");

const indexRouter = require("./routes/index");
const ordersRouter = require("./routes/orders");
const usersRouter = require("./routes/users");
const bannerRouter = require("./routes/banners");
const blogsRouter = require("./routes/blogs");
const servicesRouter = require("./routes/services");
const fleetRouter = require("./routes/fleet");
const adminRouter = require("./routes/admin");
const { telegram_listener } = require("./utils/telegram_bot");
const cors = require("cors");
const app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/orders", ordersRouter);
app.use("/admin", adminRouter);
app.use("/banners", bannerRouter);
app.use("/blogs", blogsRouter);
app.use("/fleet", fleetRouter);
app.use("/services", servicesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

const syncDB = process.env.SYNC_DB === "true";

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected!");
    if (syncDB) {
      return sequelize.sync({ alter: true });
    }
  })
  .catch((err) => {
    console.log("Couldn't connect to the database! ", err);
  });

telegram_listener();

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

require("./models/index");

module.exports = app;
