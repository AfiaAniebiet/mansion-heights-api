// Importing node core modules
const path = require("path");

// Importing npm modules
const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const chalk = require("chalk");
require("express-async-errors");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const cors = require("cors");

// Invoking express app
const app = express();

// Importing custom modules and mongodb
const mongodbConnection = require("./db/database");
const authUserRoute = require("./routes/authUser.routes");
const propertyRoute = require("./routes/property.routes");
const adminRoute = require("./routes/adminUser.routes");
const sessionMiddleware = require("./middlewares/sessions.middleware");
const flashMiddleware = require("./middlewares/flash.middleware");

const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/errorHandler.middleware");

// middlewares
app.use(morgan("tiny"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser(process.env.SECRET));
app.use(sessionMiddleware);
app.use(flash(flashMiddleware));
app.use(methodOverride("_method"));

// Setting up the ejs
app.set("view engine", "ejs");
app.set("views", "views");

// app middlewares
app.use(propertyRoute);
app.use("/lodge-finder/user", authUserRoute);
app.use("/lodge-finder/admin", adminRoute);

// Error Handling
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 8000;

const start = () => {
  try {
    mongodbConnection(process.env.MONGODB_URL);
    app.listen(PORT, () => {
      console.log(`server running on http://localhost:${chalk.blue(PORT)}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
