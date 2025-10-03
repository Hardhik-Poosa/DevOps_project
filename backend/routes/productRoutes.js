const express = require("express");
const { getProducts, getProductById, addProduct } = require("../controllers/productController.js");
const { protect, admin } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", protect, admin, addProduct);

module.exports = router;