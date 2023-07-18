const router = require("express").Router();
const { policies_check } = require("../../middlewares");
const deliveryAddressController = require("./controller");

router.get("/delivery", policies_check("view", "DeliveryAddress"), deliveryAddressController.index);
router.post(
  "/delivery",
  policies_check("create", "DeliveryAddress"),
  deliveryAddressController.store
);
router.put("/delivery/:id", deliveryAddressController.update);
router.delete("/delivery/:id", deliveryAddressController.destroy);

module.exports = router;
