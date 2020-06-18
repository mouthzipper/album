const Joi = require('@hapi/joi')

const schema = Joi.object().keys({
  album: Joi.string()
    .required()
    .lowercase()
    .valid('travel', 'personal', 'food', 'nature', 'other'),
  documents: Joi.any()
})

module.exports = schema
