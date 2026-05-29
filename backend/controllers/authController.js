const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });
    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    console.log(`✅ Registered: ${user.name} (${user.email}) | role: ${user.role}`);
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email, role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    console.error("❌ Register error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return res.status(404).json({ message: "No account found with this email. Please sign up first." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log(`❌ Wrong password: ${email}`);
      return res.status(401).json({ message: "Incorrect password. Please try again." });
    }

    user.lastLogin = new Date();
    await user.save();

    console.log(`✅ Login: ${user.name} (${user.email}) | role: ${user.role}`);
    res.json({
      _id: user._id, name: user.name, email: user.email, role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login };
