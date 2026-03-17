const express = require("express");
const router = express.Router();

const authController = require("../controller/auth.controller");
const productsController = require("../controller/products.controller")
const authMiddleware = require("../middleware/auth.middleware");
const orderController = require("../controller/order.controller")

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // .jpg .png
    const filename = Date.now() + ext;
    cb(null, filename);
  }
});

const upload = multer({ storage });


router.post('/products', upload.single('image'), productsController.createProduct);

router.get('/getCategory', orderController.getCategory)
//delete
router.delete('/products/:id', productsController.deleteProduct);
//updateProduct
router.put('/products/:id', productsController.updateProduct)

router.put('/update-tranwin',upload.single('image'), orderController.updateTranwin)

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