const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const app = express();
const middlewares = require("./middlewares");
const session = require("express-session");
const cookierParser = require("cookie-parser");
const mongoDBSession = require("connect-mongodb-session")(session);
require("dotenv").config();

// User Model
const User = require("./models/User");

// Routes Header
const authRoutes = require("./routes/authRoutes");
const mainRoutes = require("./routes/mainRoutes");

// Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookierParser());

// View Engine
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const dbURI =
  "mongodb+srv://gori_test:test1234@withlogis.dcjcw.mongodb.net/forauth?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true, // warn 제거용
  })
  .then((result) => {
    app.listen(3333);
    console.log("Database connected");
  })
  .catch((err) => console.log(err));

const store = new mongoDBSession({
  uri: dbURI,
  collection: "mySession",
});

app.use(
  session({
    secret: "egotensecretkeyya",
    resave: "false",
    saveUninitialized: "false",
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 14,
    },
  })
);

// routes
app.use("/", mainRoutes);
app.use("/auth", authRoutes);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);
