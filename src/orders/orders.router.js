const router = require("express").Router();
const controller = require("../orders/orders.controller")

router.route("/").get(controller.list).post(controller.create)
router.route("/:orderId").get(controller.read)
module.exports = router;
