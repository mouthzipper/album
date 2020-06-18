const path = require('path')
const fu = require('../utils/file')
const ALLOWED_DATAROOM_EXTENSIONS = 'png,jpg,jpeg,gif,tif,svg'

const invalid = (message, code) => {
  return {
    valid: false,
    message,
    code
  }
}

const validateRemoveHelper = async (album, file) => {
  const container = path.join(process.cwd(), 'albums')
  const filePath = path.join(container, album, file)

  const isParent = fu.isParent(container, filePath)

  if (!isParent) {
    return invalid('Please don\'t try that!', 403)
  }

  const exists = await fu.exists(filePath)

  if (!exists) {
    return invalid(`Unknown file ${file}`, 404)
  }

  return {
    valid: true
  }
}

const validateRemoveFile = async (req) => {
  const { album, file } = req.params

  return validateRemoveHelper(album, file)
}

const validateRemove = async (req) => {
  const getFiles = () => {
    const list = req.body || []
    const files = []

    for (const item of list) {
      const { album, documents } = item
      const candidates = (documents || []).split(',').map(x => x.trim())

      for (const file of candidates) {
        files.push({ album, filePath: file })
      }
    }

    return files
  }

  const files = getFiles()

  for await (const file of files) {
    const { album, filePath } = file
    const result = await validateRemoveHelper(album, filePath)

    if (!result.valid) {
      return result
    }
  }

  return {
    valid: true
  }
}

const validateUpload = async (req) => {
  const { files } = req

  if (!files || !files.documents) {
    return invalid('Please provide something to upload.', 400)
  }

  const { documents } = files
  const uploads = documents.length ? documents : [documents]

  // File type validation
  for (let i = 0; i < uploads.length; i++) {
    const document = uploads[i]
    const { name } = document

    const extension = (name || '').split('.').pop()

    if (ALLOWED_DATAROOM_EXTENSIONS.indexOf(extension) === -1) {
      return invalid(`Unacceptable file extension "${extension}".`, 400)
    }
  }

  return {
    valid: true
  }
}

module.exports = { validateUpload, validateRemove, validateRemoveFile }
