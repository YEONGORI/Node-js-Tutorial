// User model
const User = require("../models/User");
// Middleware
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

require("express-session");

module.exports.signup_post = async (req, res) => {
  const { nickname, userId, password, phoneNum } = req.body;
  const users = await User.findOne({ userId });

  if (users) {
    console.log("이미 사용중인 ID 입니다.");
    return res.redirect("/auth/register");
  }

  let salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  salt = await bcrypt.genSalt();
  const hashedPhoneNum = await bcrypt.hash(phoneNum, salt);

  try {
    user = new User({
      nickname,
      userId,
      password: hashedPassword,
      phoneNum: hashedPhoneNum,
    });
    console.log(user);
    await user.save();
    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.log(err);
  }

  //res.redirect("/auth/login");
};

module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_post = async (req, res) => {
  const { userId, password } = req.body;

  const users = await User.findOne({ userId });
  if (!users) {
    console.log("아이디가 존재하지 않습니다.");
    return res.redirect("/auth/login");
  }

  const isMatch = await bcrypt.compare(password, users.password);
  if (!isMatch) {
    console.log("비밀번호가 다릅니다.");
    return res.redirect("/auth/login");
  }

  res.redirect(`/:${userId}`);
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.logout_post = async (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  });
};

module.exports.logout_get = async (req, res) => {
  res.send("<h1>안녕? 여기는 로그아웃 페이지야</h1>");
};
module.exports.withdraw_get = async (req, res) => {
  res.send("<h1>안녕? 여기는 회원탈퇴 페이지야</h1>");
};

// 회원탈퇴 예시 url http://localhost:3333/auth/withdraw?id=60acd16c3baeb10a1263cb1e

module.exports.withdraw_delete = async (req, res) => {
  try {
    await User.findOneAndDelete(
      { _id: new mongoose.Types.ObjectId(req.query.id) },
      (err, docs) => {
        if (err) console.log(err);
        else {
          res.json({
            msg: "회원탈퇴 완료.\n이용해주셔서 감사합니다.",
            deleted: docs,
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

// const handleErrors = (err) => {
//   console.log(err.message, err.code);
//   let errors = { userId: "", password: "" };

//   if (err.message === "아이디 오류") {
//     errors.userId = "존재하지 않는 아이디 입니다.";
//   }
//   if (err.message === "비밀번호 오류") {
//     errors.password = "비밀번호가 올바르지 않습니다.";
//   }

//   // ID 중복 에러
//   if (err.code === 11000) {
//     errors.email = "이미 등록된 아이디 입니다.";
//     return errors;
//   }

//   // SNS 인증 에러
//   if (err.message.includes("인증에 실패하였습니다.")) {
//     //
//   }
//   return errors;
// };
