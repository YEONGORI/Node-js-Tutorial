const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv").config(); // .env 파일을 자동으로 로드해서 그 값들을 초기화
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
    key: "user_sid",
    secret: process.env.SESSION_SECRETKEY,
    resave: "false",
    saveUninitialized: "false",
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 14,
    },
  })
);

const sessionChecker = (req, res, next) => {
  /**
   * 유저의 로그인 여부를 매 요청마다 확인해 주면서 route를 보호해 주어야 합니다.
   * 이 함수를 기능마다 다르게 배치해 로그인을 관리해줄 필요가 있습니다.
   * 제가 테스트를 postman으로 진행하고 있어 지금은 추가하지 않았지만
   * react 연결해서 테스트 할때는
   * app.use("/", sessionChecker, mainRoutes)와 같은 형태로 바꿔주시면 되겠습니다!
   */

  if (req.session.user && req.cookies.user_sid) {
    next();
  } else {
    res.redirect("/auth/login");
  }
};

// routes
app.use("/", mainRoutes);
app.use("/auth", authRoutes);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);
