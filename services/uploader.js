const path = require('path')
const fu = require('../utils/file')

const uploadFile = async (info, uploads) => {
  const { album, host } = info
  const directory = path.join(process.cwd(), 'albums', album)

  await fu.ensureDirectory(directory)
  const result = []

  for (const upload of uploads) {
    const { name } = upload
    const destination = path.join(directory, name)
    upload.mv(destination)

    result.push({
      album: album.replace(/\b(\w)/g, s => s.toUpperCase()),
      name,
      path: destination.replace(process.cwd(), ''),
      raw: `${host}/photos/${album}/${name}`
    })
  }

  return result
}

module.exports = { uploadFile }
