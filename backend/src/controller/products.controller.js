const express = require("express");
const router = express.Router();
const prisma = require("../prisma"); // import prisma client
const fs = require('fs');
const path = require('path');
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.image) {
      const filePath = path.join(__dirname, '../../uploads', product.image);

      console.log('DELETE FILE PATH:', filePath); // 🔥 debug

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('✅ File deleted');
      } else {
        console.log('❌ File not found');
      }
    }

    await prisma.product.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Deleted successfully' });

  } catch (err) {
    console.error('DELETE ERROR:', err);
    res.status(500).json({ error: 'Delete failed' });
  }
};
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, barcode, categoryId, price, stock, image } = req.body;

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        barcode,
        categoryId: Number(categoryId),
        price: Number(price),
        stock: Number(stock),
        image,
      },
    });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
};

// GET products
exports.getproduct = async (req, res)=>{

  console.log("API HIT /products")

  const products = await prisma.product.findMany({
    include:{ category:true }
  })
const host = req.protocol + '://' + req.get('host');

  const result = products.map(p => ({
    ...p,
    image: p.image
      ? `${host}/uploads/${p.image}`
      : null
  }));
  console.log(products)
res.json(result);
 
}

exports.createProduct = async (req, res) => {
  try {
    console.log('BODY:', req.body); // debug

    const {
      name,
      price,
      cost,
      barcode,
      description,
      categoryId,
      stock
    } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        cost: Number(cost),
        barcode,
        description,
        categoryId: Number(categoryId), // ⭐ สำคัญ
        stock: Number(stock),
        image: req.file ? req.file.filename : null // ⭐ รองรับรูป
      }
    });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'create product error' });
  }
};