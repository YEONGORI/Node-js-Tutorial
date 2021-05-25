const { Router } = require("express");
const main_router = Router();
const main_controller = require("../controllers/mainController");

main_router.get("/", main_controller.main_get);

module.exports = main_router;
