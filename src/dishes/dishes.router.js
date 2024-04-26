const router = require("express").Router();
const controller = require("../dishes/dishes.controller")
const methodNotAllowed = require("../errors/methodNotAllowed")

router.route("/").get(controller.list).post(controller.create).all(methodNotAllowed)
router.route("/:dishId").get(controller.read).put(controller.update).delete(controller.destroy).all(methodNotAllowed)

module.exports = router;
