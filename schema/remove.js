const Joi = require('@hapi/joi')

const schema = Joi.array().items(Joi.object().keys({
  album: Joi.string()
    .required()
    .lowercase()
    .valid('travel', 'personal', 'food', 'nature', 'other'),
  documents: Joi.string()
}))

module.exports = schema
