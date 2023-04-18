const Joi = require("joi");

const adminSchema = Joi.object({
  full_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
});

module.exports = adminSchema;
