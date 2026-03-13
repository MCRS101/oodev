const express = require("express");
const router = express.Router();
const prisma = require("../prisma"); // import prisma client

// GET products
exports.getproduct = async (req, res)=>{

  console.log("API HIT /products")

  const products = await prisma.product.findMany({
    include:{ category:true }
  })

  console.log(products)

  res.json(products)
}

exports.createProduct = async (req, res) => {
  try {

    const {
      image,
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
        image,
        name,
        price: Number(price),
        cost: Number(cost),
        barcode,
        description,
        categoryId: Number(categoryId),
        stock: Number(stock)
      }
      
    });

    res.json(product);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "create product error" });
  }
  
};

