const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );
};

const hashPassword = async (password) => {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
};

const comparePassword = async (password, hashedPassword) => {
  return bcryptjs.compare(password, hashedPassword);
};

const sendSuccess = (res, data, statusCode = 200, message = "Success") => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, error, statusCode = 400, message = "Error") => {
  res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};

module.exports = {
  generateToken,
  hashPassword,
  comparePassword,
  sendSuccess,
  sendError,
};
