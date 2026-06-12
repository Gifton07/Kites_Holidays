const jwt = require("jsonwebtoken")
const ApiError = require("../utils/ApiError")

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Not authorized, no token"))
  }
  try {
    const token = authHeader.split(" ")[1]
    req.admin = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    next(new ApiError(401, "Not authorized, invalid token"))
  }
}

module.exports = { protect }
