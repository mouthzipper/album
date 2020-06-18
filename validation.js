function validate (schema) {
  return async (req, res, next) => {
    try {
      if (!schema) {
        next()
        return
      }

      const result = schema ? await schema.validate(req.body) : {}

      const { error } = result

      if (!error) {
        req.body = result.value
        next()
        return
      }

      const { details } = error

      res.status(400).send({
        message: details.map(x => x.message).join('\n')
      })
    } catch (error) {
      console.error(error)

      res.status(500).send({
        message: 'An error occurred while processing your request'
      })
    }
  }
}

module.exports = { validate }
