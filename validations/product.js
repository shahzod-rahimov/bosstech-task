const Joi = require("joi");

const productSchema = Joi.object({
  name: Joi.string(),
  price: Joi.number(),
  description: Joi.string(),
});

module.exports = productSchema;
