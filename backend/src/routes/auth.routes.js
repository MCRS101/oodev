const express = require("express");
const router = express.Router();

const authController = require("../controller/auth.controller");
const productsController = require("../controller/products.controller")
const authMiddleware = require("../middleware/auth.middleware");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "profile success",
    user: req.user
  });
});

router.get("/products",productsController.getproduct);

router.post("/products",productsController.createProduct);

module.exports = router;