const jwt = require("jsonwebtoken");

const tokenVerify = (request, response, next) => {
  const authHeader = request.headers["authorization"];

  if (!authHeader) {
    return response.status(401).json({ message: "No token provided" });
  }

  if (!authHeader.includes("Bearer ")) {
    return response.status(401).json({ message: "Invalid Bearer" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.SECRET_KEY, (err) => {
    if (err) {
      return response.status(401).json({ invalidToken: err });
    }

    next();
  });
};

module.exports = tokenVerify;
