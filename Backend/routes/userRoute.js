
const router = require("express").Router();
const User = require("../Schema/userSchema.js");
const bcrypt=require('bcrypt')


router.post("/register", async (req, res) => {
     console.log(req.body);
  const { name, email, password } = req.body;
    
  const salt=await bcrypt.genSalt(10);
  const hashed=await bcrypt.hash(password,salt)

  try {
    const newUser = new User({
      name,
      email,
      password: hashed,
    });

    await newUser.save();

    res.status(201).json({ message: "User Registered Successfully", newUser });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
});


router.post('/login',async(req,res)=>{

    try {
        const { email, password } = req.body;
         const user = await User.findOne({ email: email });
       if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({ message: "User Login Successfully", user });
    } catch (error) {
        res.status(500).json({message: "Error registering user", error: error.message })
    }
})

module.exports = router;
