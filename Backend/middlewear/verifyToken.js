const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token =
    req.cookies.token ||
    (req.headers.authorization &&
      req.headers.authorization.split(" ")[1]);
   
  if (!token) {
    return res.status(401).json({ message: "No token found" });
  }
   
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;
