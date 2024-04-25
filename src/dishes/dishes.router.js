const router = require("express").Router();
const controller = require("../dishes/dishes.controller")

router.route("/").get(controller.list)

module.exports = router;
