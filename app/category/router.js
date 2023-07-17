const router = require("express").Router();

const { policies_check } = require("../../middlewares");
const categoriesController = require("./controller");
router.get("/category", categoriesController.view);
router.get("/category/:id", categoriesController.view);
router.post("/category", policies_check("create", "Category"), categoriesController.store);
router.put("/category/:id", policies_check("update", "Category"), categoriesController.update);
router.delete("/category/:id", policies_check("delete", "Category"), categoriesController.destroy);

module.exports = router;
