const router = require("express").Router();
const authController = require("../controllers/authController");
const smsController = require("../controllers/smsController");

router.get("/signup", authController.signup_get);
router.post("/signup", authController.signup_post);
router.get("/login", authController.login_get);
router.post("/login", authController.login_post);
router.get("/logout", authController.logout_get);
router.post("/logout", authController.logout_post);
router.post("/sendsms", smsController.sendsms);
router.get("/withdraw", authController.withdraw_get);
router.delete("/withdraw", authController.withdraw_delete);

module.exports = router;
