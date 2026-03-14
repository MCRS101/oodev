const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.getorder = async (req,res)=>{

 const order = await prisma.sale.findUnique({
   where:{
     id: Number(req.params.id)
   },
   include:{
     items:{
       include:{
         product:true
       }
     }
   }
 })

 res.json(order)

}

exports.createSale = async (req, res) => {
  try {

    const { userId, items } = req.body

    let total = 0

    items.forEach(i => {
      total += i.price * i.qty
    })

    const sale = await prisma.sale.create({
      data: {
        userId: userId,
        total: total,
        items: {
          create: items.map(i => ({
            productId: i.productId,
            qty: i.qty,
            price: i.price
          }))
        }
      },
      include: {
        items: {
            include: {
            product: true
    }
        }
      }
    })

    // ตัด stock
    for (const i of items) {

      await prisma.product.update({
        where: { id: i.productId },
        data: {
          stock: {
            decrement: i.qty
          }
        }
      })

      // บันทึก movement
      await prisma.stockMovement.create({
        data: {
          productId: i.productId,
          qty: i.qty,
          type: "SALE"
        }
      })

    }

    res.json(sale)

  } catch (err) {
    res.status(500).json(err)
  }
}