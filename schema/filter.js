const Joi = require('@hapi/joi')
const keys = {
  skip: Joi.number()
    .integer()
    .required(),
  limit: Joi.number()
    .integer()
    .required()
    .valid(5, 10, 25, 50, 100, 250, 500)
}

const schema = Joi.object().keys(keys)

module.exports = schema
