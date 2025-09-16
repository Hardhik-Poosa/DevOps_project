const Product = require("../models/Product.js");

// GET all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

// POST add product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;
    const product = new Product({ name, description, price, image, category, stock });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error adding product" });
  }
};

module.exports = { getProducts, addProduct };
