/**
 *
 * authController에서는 try catch구조를 사용해 err를 관리하고
 * try안의 if, elseif, else를 사용해 등록되지 않거나 중복된 정보들을 관리하게 끔 구현했습니다.
 * 회원가입 시 sms인증, pw찾기 시  sms인증은 추후 수정이 필요합니다.
 * ajax로 실시간 검증을 해야하는데 제가 ajax를 알지 못해
 * 우선은 전송 버튼을 누르면 휴대폰번호와 인증번호를 동시에 받게 만들었으나
 * 각각 따로 받을 수 있게 끔 수정 부탁드립니다.
 *
 */

// User model
const User = require("../models/User");
// Middleware
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
// Modules
const smsController = require("../controllers/smsController");

// 회원가입
module.exports.signup_get = (res) => {
  res.render("signup");
};

module.exports.signup_post = async (req, res) => {
  const { nickname, userId, password, phoneNum } = req.body; // body로 부터 입력 받은 값들 저장
  const users = await User.findOne({ userId }); // 입력받은 userId에 해당하는 계정을 DB로 부터 받아옴

  let salt = await bcrypt.genSalt(); // 지금 사용된 salt를 password 재설정 시에도 사용할 예정
  const hashedPassword = await bcrypt.hash(password, salt); // password 암호화

  try {
    user = new User({
      // 입력 값을 통해 새 유저 생성
      nickname,
      userId,
      password: hashedPassword,
      phoneNum,
      salt,
    });
    await user.save(); // 유저 정보 DB에 저장
    req.session.user = user; // 유저 정보 session에 저장
    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.log(err);
  }
};

// 로그인
module.exports.login_get = (res) => {
  res.render("login");
};

module.exports.login_post = async (req, res) => {
  const { userId, password } = req.body; // 위와 동일
  const users = await User.findOne({ userId }); // 위와 동일
  try {
    if (!users) {
      return res.json({
        success: false,
        message: "아이디를 확인해 주세요.",
      });
    }
    const isMatch = await bcrypt.compare(password, users.password);
    if (!isMatch) {
      return res.json({
        success: false,
        messgae: "비밀번호를 확인해 주세요.",
      });
    } else {
      req.session.user = users;
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "로그인 실패",
    });
  }
};

// 로그아웃
module.exports.logout_get = (res) => {
  res.send("<h1>안녕? 여기는 로그아웃 페이지야</h1>");
};

module.exports.logout_post = async (req, res) => {
  try {
    req.session.destroy((err) => {
      // Session Store에 있는 session 삭제
      if (err) throw err;
      else res.redirect("/");
    });
  } catch (err) {
    console.log(err);
  }
};

// 회원 탈퇴
module.exports.withdraw_get = (res) => {
  res.send("<h1>안녕? 여기는 회원탈퇴 페이지야</h1>");
};

module.exports.withdraw_delete = async (req, res) => {
  try {
    await User.findOneAndDelete(
      // url의 query parameter를 받아 해당 user정보를 조회하고 삭제
      { _id: new mongoose.Types.ObjectId(req.query.id) }, // _id의 type이 ObjectId이므로 json 형식의 parameter를 ObjectId로 변환
      (err, docs) => {
        // findOneAndDelete의 callback함수는 err와, 삭제한 user정보를(docs)를 인수로 갖는다.
        if (err) console.log(err);
        else {
          req.session.destroy();
          res.json({
            msg: "회원탈퇴 완료. 이용해주셔서 감사합니다.",
            deleted: docs,
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

// ID 찾기
module.exports.findID_get = (res) => {
  res.send("<h1>안녕? 여기는 ID찾기 페이지야</h1>");
};

module.exports.findID_post = async (req, res) => {
  const { phoneNum } = req.body; // 입력받은 전화번호를 사용해
  const users = await User.findOne({ phoneNum }); // DB에서 사용자 정보 조회
  const userPhoneNum = users.phoneNum; // 조회한 사용자 정보속 phoneNum를 사용

  try {
    if (userPhoneNum === phoneNum) {
      // -------------------------- ID를 암호화 하는 알고리즘(미완성)
      const a = "***";
      const use = users.userId;
      const halfUse = use.length / 2;
      const slicedUse = use.slice(halfUse);
      const hashedUserId = use.replace(slicedUse, a);
      // --------------------------
      res.json({
        userId: hashedUserId,
      });
    } else {
      res.json("일치하는 핸드폰번호가 없습니다.");
    }
  } catch (err) {
    console.log(err);
  }
};

// 비밀번호 찾기
module.exports.findPW_get = async (res) => {
  res.send("<h1>안녕? 여기는 PW찾기 페이지야</h1>");
};

module.exports.findPW_post = async (req, res) => {
  const { userId, phoneNum, authNum, password } = req.body;
  // userId는 DB에서 유저 정보를 조회하기 위함, phoneNum는 인증번호를 발송하기 위함
  // authNum은 수신받은 SMS의 인증번호를 입력하기 위함, password는 password를 재설정하기 위함 (phoneNum, authNum) ajax 처리 필요

  const users = await User.findOne({ userId });
  const savedPhoneNum = users.phoneNum;

  if (!users) {
    console.log("아이디가 존재하지 않습니다.");
  } else if (savedPhoneNum !== phoneNum) {
    console.log("핸드폰 번호를 확인해 주세요");
  } else {
    try {
      // const savedAuthNum = smsController.sendsms(phoneNum); // 인증번호 전송 모듈 사용
      const savedAuthNum = 123456;
      if (savedAuthNum === authNum) {
        // 인증번호 일치시
        const salt = users.salt;
        const hashedPassword = await bcrypt.hash(password, salt); // 회원가입과 동일한 salt로 암호화
        await User.findOneAndUpdate(
          // User정보 조회 후 Update
          {},
          { password: hashedPassword },
          { new: true, useFindAndModify: false }, // findOnAndUpdate 사용위해 useFindAndModify: false 설정 추가, 업데이트된 User 정보 확인을 위한 new:true
          (err, docs) => {
            if (err) console.log(err);
            else {
              res.json({
                message: "비밀번호 변경 완료",
                docs,
              });
            }
          }
        );
      }
    } catch (err) {
      console.log(err);
    }
  }
};

// SMS 인증
module.exports.smsAuth_post = (req, res) => {
  const { phoneNum, authNum } = req.body;
  // const { phoneNum } = req.body.phoneNum;
  // const { authNum } = req.body.authNum;
  const savedAuthNum = smsController.sendsms(phoneNum);
  try {
    if (authNum === savedAuthNum) {
      res.json({
        success: true,
        message: "인증되었습니다.",
      });
    } else {
      res.json({
        success: false,
        message: "인증번호를 확인해주세요.",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

// ID 중복 확인
module.exports.dup_id_post = async (req, res) => {
  const { userId } = req.body;
  const users = await User.findOne({ userId });
  try {
    if (users) {
      console.log("이미 사용중인 ID 입니다.");
      return res.redirect("/auth/register");
    } else {
      res.json("사용가능");
    }
  } catch (err) {
    console.log(err);
  }
};

// NICKNAME 중복 확인
module.exports.dup_nickname_post = async (req, res) => {
  const { nickname } = req.body;
  const users = await User.findOne({ nickname });
  try {
    if (users) {
      console.log("이미 사용중인 닉네임 입니다.");
      return res.redirect("/auth/register");
    } else {
      res.json("사용가능");
    }
  } catch (err) {
    console.log(err);
  }
};
