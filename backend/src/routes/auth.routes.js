const express = require("express");
const router = express.Router();

const authController = require("../controller/auth.controller");
const productsController = require("../controller/products.controller")
const authMiddleware = require("../middleware/auth.middleware");
const orderController = require("../controller/order.controller")

router.put('/update-tranwin', orderController.updateTranwin)

router.put("/update-profile", authController.updateProfile);

router.post("/order", orderController.createSale);

router.get("/order/:id", orderController.getorder);

router.get("/orders/user/:userId", orderController.getOrdersByUser);

router.get("/getorder", orderController.getOrdersAll);

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