const router = require("express").Router();
const { policies_check } = require("../../middlewares");
const tagController = require("./controller");
router.get("/tags", tagController.view);
router.get("/tags/:id", tagController.view);
router.post("/tags", policies_check("create", "Tag"), tagController.store);
router.put("/tags/:id", policies_check("update", "Tag"), tagController.update);
router.delete("/tags/:id", policies_check("delete", "Tag"), tagController.destroy);

module.exports = router;
