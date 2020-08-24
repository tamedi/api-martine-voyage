var express = require("express");
const productController = require("../controllers/products");
const multer = require("../middlewares/multer");
var router = express.Router();

/* GET users listing. */
router.post("/new-travels", multer, productController.productCreate);
router.get("/new-travels", productController.getProduct);
router.get("/category/:category", productController.categoryProduct);
router.get("/:product", productController.product);
router.post("/reservation", authentification, productController.reservation);
router.get("/more/:product/:category", productController.more);

module.exports = router;
