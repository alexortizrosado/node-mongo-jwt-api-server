const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.header("token");
    if (!token) return res.status(401).json({
      error:"Access Denied"
    });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    console.log("Invalid Token", err);
    res.status(400).json({
      error: "Invalid Token"
    });
  }
};
