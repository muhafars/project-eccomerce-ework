const router = require("express").Router();

const categoriesController = require("./controller");
router.get("category", categoriesController.view);
router.get("/category/:id", categoriesController.view);
router.post("/category", categoriesController.store);
router.put("/category/:id", categoriesController.update);
router.delete("/category/:id", categoriesController.destroy);

module.exports = router;
