const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const app = express();
const middlewares = require("./middlewares");

require("dotenv").config();
const User = require("./models/User");
require("./auth/passport");

// routes header
const authRoutes = require("./routes/authRoutes");
const mainRoutes = require("./routes/mainRoutes");
const passport = require("passport");

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(helmet());

// view engine
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const dbURI =
  "mongodb+srv://gori_test:test1234@withlogis.dcjcw.mongodb.net/forauth?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true, // warn 제거용
  })
  .then((result) => app.listen(3001))
  .catch((err) => console.log(err));

// routes
app.use("/", mainRoutes);
app.use("/user", passport.authenticate("jwt", { session: false }), authRoutes);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);
