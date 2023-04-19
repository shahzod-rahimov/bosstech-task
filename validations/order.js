const Joi = require("joi");

const orderSchema = Joi.object({
  admin_id: Joi.string().required(),
  user_id: Joi.string().required(),
  products: Joi.array()
    .items(Joi.object({ product_id: Joi.string() }))
    .min(1)
    .required(),
  status: Joi.number().valid(1, 2, 3, 4),
  description: Joi.string(),
});

module.exports = orderSchema;
