const router = require("express").Router();
const { policies_check } = require("../../middlewares");
const orderController = require("./controller");

router.post("/orders", policies_check("create", "Order"), orderController.store);
router.get("/orders", policies_check("view", "Order"), orderController.index);
module.exports = router;
