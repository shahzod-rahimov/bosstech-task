const Joi = require("joi");

const userSchema = Joi.object({
  full_name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(6).max(20),
  phone_number: Joi.string()
    .pattern(new RegExp(/^([378]{2}|(9[013-57-9]))\d{7}$/))
    .message("Invalid phone number! Ex: 991234567"),
});

module.exports = userSchema;
