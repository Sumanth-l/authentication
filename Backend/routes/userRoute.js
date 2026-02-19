
const router = require("express").Router();
const pool=require('../db')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')


router.post("/register", async (req, res) => {
  console.log(req.body);

  const { name, email, password } = req.body;
  try {
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

  
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

  
    const newUser = await pool.query(
      "INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING *",
      [name, email, hashed]
    );

    res.status(201).json({
      message: "User Registered Successfully",
      newUser: newUser.rows[0],
    });

  } catch (error) {
    res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true });

    return res.status(200).json({
      message: "User Login Successfully",
      token,
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error login user",
      error: error.message,
    });
  }
});




module.exports = router;
