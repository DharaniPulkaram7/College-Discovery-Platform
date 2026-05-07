const { PrismaClient } = require("@prisma/client");
const {
  generateToken,
  hashPassword,
  comparePassword,
  sendSuccess,
  sendError,
} = require("../utils/auth");
const { registerValidator, loginValidator } = require("../validators");

const prisma = new PrismaClient();

const register = async (req, res, next) => {
  try {
    const { error, value } = registerValidator.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    const { email, password, firstName, lastName } = value;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return sendError(res, "User already exists", 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    // Generate token
    const token = generateToken(user);

    sendSuccess(
      res,
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        token,
      },
      201,
      "User registered successfully"
    );
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { error, value } = loginValidator.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    const { email, password } = value;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return sendError(res, "User not found", 401);
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return sendError(res, "Invalid password", 401);
    }

    // Generate token
    const token = generateToken(user);

    sendSuccess(res, {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      token,
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
