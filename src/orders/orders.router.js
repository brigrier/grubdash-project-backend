const router = require("express").Router();
const controller = require("../orders/orders.controller")

router.route("/").get(controller.list)

module.exports = router;
