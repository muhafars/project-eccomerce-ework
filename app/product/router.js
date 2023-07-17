const router = require("express").Router();
const multer = require("multer");
const os = require("os");
const { policies_check } = require("../../middlewares");

const productController = require("./controller");
// router.get("/products", productController.view);
// router.get("/products/:id", productController.view);
router.get("/products", productController.index);
router.post(
  "/products",
  multer({ dest: os.tmpdir() }).single("image"),
  policies_check("create", "Product"),
  productController.store
);
router.put(
  "/products/:id",
  multer({ dest: os.tmpdir() }).single("image"),
  policies_check("update", "Product"),
  productController.update
);
router.delete("/products/:id", policies_check("delete", "Product"), productController.destroy);

module.exports = router;
