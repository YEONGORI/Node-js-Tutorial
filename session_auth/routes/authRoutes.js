const router = require("express").Router();
const authController = require("../controllers/authController");

// 회원가입
router.get("/signup", authController.signup_get);
router.post("/signup", authController.signup_post);

// 로그인
router.get("/login", authController.login_get);
router.post("/login", authController.login_post);

// 로그아웃
router.get("/logout", authController.logout_get);
router.post("/logout", authController.logout_post);

// 회원탈퇴
router.get("/withdraw", authController.withdraw_get);
router.delete("/withdraw", authController.withdraw_delete);

// ID 찾기
router.get("/find-id", authController.findID_get);
router.post("/find-id", authController.findID_post);

// PW 찾기
router.get("/find-pw", authController.findPW_get);
router.post("/find-pw", authController.findPW_post);

// SMS 인증
router.post("/sms-auth", authController.smsAuth_post);

// ID 중복 검사
router.post("/dup-id", authController.dup_id_post);

// NICKNAME 중복 검사
router.post("/dup-nickname", authController.dup_nickname_post);

module.exports = router;
