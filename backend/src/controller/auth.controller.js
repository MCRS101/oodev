const prisma = require("../prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {

  try {

    const { name, email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hash
      }
    });

    res.json({
      message: "register success",
      user
    });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

};

exports.login = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    const check = await bcrypt.compare(password, user.password);

    if (!check) {
      return res.status(400).json({ message: "password incorrect" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "login success",
      token,
      user
    });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

};