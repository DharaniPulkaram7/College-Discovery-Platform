const Joi = require("joi");

const registerValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
});

const loginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const collegeListValidator = Joi.object({
  search: Joi.string().optional(),
  location: Joi.string().optional(),
  maxFees: Joi.number().optional(),
  minFees: Joi.number().optional(),
  minRating: Joi.number().min(0).max(5).optional(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
});

const reviewValidator = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  title: Joi.string().required(),
  content: Joi.string().required(),
});

module.exports = {
  registerValidator,
  loginValidator,
  collegeListValidator,
  reviewValidator,
};
