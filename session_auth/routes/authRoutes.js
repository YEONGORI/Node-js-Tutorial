const router = require("express").Router();
const authController = require("../controllers/authController");

// 회원가입 (필수 파라미터: userId, nickname, password, phoneNum)
router.get("/signup", authController.signup_get);
router.post("/signup", authController.signup_post);

// 로그인 (필수 파라미터: userId, password)
router.get("/login", authController.login_get);
router.post("/login", authController.login_post);

// 로그아웃 (필수 파라미터: -)
router.get("/logout", authController.logout_get);
router.post("/logout", authController.logout_post);

// 회원탈퇴 (필수 파라미터: _id(url에 query형식으로 전달))
// 이를 위해선 로그인시 url에 _id정보를 필수로 포함시킨 후 숨겨야 할 것 같습니다.
router.get("/withdraw", authController.withdraw_get);
router.delete("/withdraw", authController.withdraw_delete);

// ID 찾기 (필수 파라미터: phoneNum)
router.get("/find-id", authController.findID_get);
router.post("/find-id", authController.findID_post);

// PW 찾기 (필수 파라미터: userId, phoneNum, authNum, password)
router.get("/find-pw", authController.findPW_get);
router.post("/find-pw", authController.findPW_post);

// SMS 인증 (PW 찾기에 속해있음, 필수 파라미터: phoneNum)
router.post("/sms-auth", authController.smsAuth_post);

// ID 중복 검사 (필수 파라미터: userId)
router.post("/dup-id", authController.dup_id_post);

// NICKNAME 중복 검사 (필수 파라미터: nickname)
router.post("/dup-nickname", authController.dup_nickname_post);

module.exports = router;
