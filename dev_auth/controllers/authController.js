const passport = require("passport");
const jwt = require("jsonwebtoken");
// User model
const User = require("../models/User");

module.exports.signup_get = (req, res) => {
  res.send("<h1>여기는 signup</h1>");
};

module.exports.login_get = (req, res) => {
  res.send("<h1>여기는 login</h1>");
};

module.exports.signup_post = async (req, res) => {
  //const { user_id, nickname, password } = req.body;
  passport.authenticate("signup", { session: false }), // user정보를 session에 저장하지 않고 안전한 경로에 token을 보내기 위함
    (req, res) => {
      res.json({
        message: "회원가입 성공",
        user: req.user,
      });
    };
};

module.exports.login_post = async (req, res) => {
  //const { user_id, password } = req.body;
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        const err = new Error("에러");
        return next(err);
      }
      const body = { _id: user._id, user_id: user.user_id }; // _id : 유저 생성시 자동으로 등록되는 DB id, user_id : 유저 로그인 id
      const token = jwt.sign({ user: body }, "TOP_SECRET");
      return res.json({ token });
    } catch (err) {
      return next(err);
    }
  });
};

module.exports.logout_get = async (req, res) => {
  res.redirect("/");
};

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { user_id: "", password: "" };

  if (err.message === "아이디 오류") {
    errors.user_id = "존재하지 않는 아이디 입니다.";
  }
  if (err.message === "비밀번호 오류") {
    errors.password = "비밀번호가 올바르지 않습니다.";
  }

  // ID 중복 에러
  if (err.code === 11000) {
    errors.email = "이미 등록된 아이디 입니다.";
    return errors;
  }

  // SNS 인증 에러
  if (err.message.includes("인증에 실패하였습니다.")) {
    //
  }
  return errors;
};
