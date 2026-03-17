const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs');
const path = require('path');




exports.getCategory = async (req, res) => {
  try {

 const categories = await prisma.category.findMany({
      orderBy: { id: 'asc' }
    });

    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }



}
exports.updateManager = async (req, res) => {
  try {
    const { id, tranwin } = req.body;

    console.log('BODY:', req.body);
    console.log('FILE:', req.file);

    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }

    const image = req.file ? req.file.filename : null;

    const order = await prisma.manager.update({ // 👈 แก้ตรงนี้ถ้าใช้ Manager
      where: { id: Number(id) },
      data: {
        tranwin,
        imgpath: image ? `/uploads/${image}` : undefined
      }
    });

    res.json({
      message: 'updated',
      data: order
    });

  } catch (err) {
    console.error('🔥 UPDATE ERROR:', err);

    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'not found id' });
    }

    res.status(500).json({ error: 'update failed' });
  }
};

exports.getManager = async (req, res) => {
  try {

    const orders = await prisma.manager.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(orders);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createManager = async (req, res) => {
  try {
    const { total, username } = req.body;

    console.log('BODY:', req.body);
    console.log('FILE:', req.file);

    // กันค่า null / undefined
    if (!total || !username) {
      return res.status(400).json({
        error: 'total และ username จำเป็น'
      });
    }

    const image = req.file ? req.file.filename : null;

    const manager = await prisma.manager.create({
      data: {
        total: Number(total),
        username,
        tranwin: "รอโอน", // default (จะไม่ใส่ก็ได้ เพราะ schema มี default)
        imgpath: image ? `/uploads/${image}` : null
      }
    });

    res.json({
      message: 'created',
      data: manager
    });

  } catch (err) {
    console.error('🔥 CREATE ERROR:', err);
    res.status(500).json({ error: 'create failed' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    console.log('BODY:', req.body);

    if (!id || !status) {
      return res.status(400).json({ error: 'missing data' });
    }

    const order = await prisma.sale.update({
      where: { id: Number(id) },
      data: {
        status, // 🔥 ใช้ field นี้
      }
    });

    res.json({
      message: 'updated',
      data: order
    });

  } catch (err) {
    console.error('🔥 UPDATE ERROR:', err);
    res.status(500).json({ error: 'update failed' });
  }
};
exports.updateTranwin = async (req, res) => {
  try {
    const { id, tranwin } = req.body;

    console.log('BODY:', req.body);
    console.log('FILE:', req.file);

    const image = req.file ? req.file.filename : null;

    const order = await prisma.sale.update({
      where: { id: Number(id) },
      data: {
        tranwin,
        imgpath: image ? `/uploads/${image}` : undefined
      }
    });

    res.json({
      message: 'updated',
      image: image
    });

  } catch (err) {
    console.error('🔥 UPDATE ERROR:', err);
    res.status(500).json({ error: 'update failed' });
  }
};

exports.getOrdersByUser = async (req, res) => {

  const userId = Number(req.params.userId);
  const page = Number(req.query.page) || 1;
  const limit = 12;
  const orders = await prisma.sale.findMany({
    where: {
      userId: userId
    },
    include: {
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: "asc"
    },
     skip: (page - 1) * limit,
    take: limit
  });

  res.json(orders);

};
exports.getOrdersAll = async (req, res) => {
  try {

    const orders = await prisma.sale.findMany({
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        }
      },
       orderBy: {
      createdAt: "desc"
    }
    })

    res.json(orders)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
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