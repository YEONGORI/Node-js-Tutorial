const main_router = require("express").Router();
const main_controller = require("../controllers/mainController");

main_router.get("/", main_controller.main_get);

module.exports = main_router;
