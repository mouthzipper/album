const path = require('path')
const fs = require('fs')

const exists = path => new Promise(resolve => fs.access(path, fs.constants.F_OK, e => resolve(!e)))

const ensureDirectory = async (directory) => {
  if (!await exists(directory)) {
    await fs.promises.mkdir(directory)
  }
}

const isParent = (parent, pathToFile) => {
  const relative = path.relative(parent, pathToFile)
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative)
}

const deleteFile = async (file) => {
  await fs.promises.unlink(file)
}

module.exports = {
  ensureDirectory,
  exists,
  deleteFile,
  isParent
}
