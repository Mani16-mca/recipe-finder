const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ Access denied: No token");
    return res.status(401).json({ message: "Access denied. No token." });
  }
  try {
    const token = authHeader.split(" ")[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    console.log("❌ Invalid token");
    res.status(401).json({ message: "Invalid token." });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    console.log(`❌ Access denied: not admin`);
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

module.exports = { protect, adminOnly };
