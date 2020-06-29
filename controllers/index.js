const service = require('../services')
const validation = require('./validation')
const path = require('path')
const fu = require('../utils/file')

const getList = async (req, res) => {
  try {
    const host = `${req.protocol}://${req.headers.host}`
    const { skip, limit } = req.body
    const { count, documents } = await service.listFiles(host, skip, limit)

    res.status(200).send({
      message: 'OK',
      documents,
      count,
      skip,
      limit
    })
  } catch (error) {
    console.error(error)

    res.status(500).send({
      message: 'An error occurred while processing your request.'
    })
  }
}

const raw = async (req, res) => {
  try {
    const { album, file } = req.params

    const filePath = path.join(process.cwd(), 'albums', album, file)

    if (!await fu.exists(filePath)) {
      res.status(404).send({
        message: `Unknown file ${file}`
      })

      return
    }

    res.sendFile(filePath)
  } catch (error) {
    console.error(error)

    res.status(500).send({
      message: 'An error occurred while processing your request.'
    })
  }
}

const removeFile = async (req, res) => {
  try {
    const result = await validation.validateRemoveFile(req)
    const { valid, code, message } = result

    if (!valid) {
      res.status(code).send({
        message
      })

      return
    }

    const { album, file } = req.params
    const filePath = path.join(process.cwd(), 'albums', album, file)

    await fu.deleteFile(filePath)

    res.status(200).send({
      message: 'OK'
    })
  } catch (error) {
    console.error(error)

    res.status(500).send({
      message: 'An error occurred while processing your request.'
    })
  }
}

const remove = async (req, res) => {
  try {
    const result = await validation.validateRemove(req)
    const { valid, code, message } = result

    if (!valid) {
      res.status(code).send({
        message
      })

      return
    }

    const list = req.body || []

    for (const item of list) {
      const { album, documents } = item
      const files = (documents || '').split(',').map(x => x.trim())

      for (const file of files) {
        const filePath = path.join(process.cwd(), 'albums', album, file)
        await fu.deleteFile(filePath)
      }
    }

    res.status(200).send({
      message: 'OK'
    })
  } catch (error) {
    console.error(error)

    res.status(500).send({
      message: 'An error occurred while processing your request.'
    })
  }
}

const upload = async (req, res) => {
  try {
    const host = `${req.protocol}://${req.headers.origin || req.headers.host}`
    const result = await validation.validateUpload(req)
    const { valid, code, message } = result

    if (!valid) {
      res.status(code).send({
        message
      })
    }

    const { files } = req
    const { album } = req.body
    const { documents } = files
    const uploads = documents.length ? documents : [documents]

    const data = await service.uploadFile({ album, host }, uploads)

    res.status(200).send({
      message: 'OK',
      data
    })
  } catch (error) {
    console.error(error)

    res.status(500).send({
      message: 'An error occurred while processing your request.'
    })
  }
}

module.exports = { getList, upload, raw, remove, removeFile }
