const Joi = require('joi');

export const product = (product) => {
  return Joi.object({
    title: Joi.string().required(),
    image: Joi.string(),
    description: Joi.string(),
    count: Joi.number(),
    price: Joi.number()
  }).validate(product, {
    abortEarly: false,
    allowUnknown: false
  });
}