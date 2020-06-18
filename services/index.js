const path = require('path')
const Enumerable = require('node-enumerable')
const { resolve } = path
const { readdir } = require('fs').promises
const { createHash } = require('crypto')

const { uploadFile } = require('./uploader')

async function getFiles (dir) {
  const children = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(children.map((child) => {
    const res = resolve(dir, child.name)
    return child.isDirectory() ? getFiles(res) : res
  }))

  return Array.prototype.concat(...files)
}

const listFiles = async (host, skip, limit) => {
  const root = path.join(process.cwd(), 'albums')
  const files = await getFiles(root)

  const documents = Enumerable.from(files)
    .select(x => {
      const url = x.replace(root, '')
      const parts = url.split('/').filter(x => x) || []

      const raw = `${host}/photos/${parts.join('/')}`
      const name = parts.pop()
      const album = (parts[0] || '').replace(/\b\S/g, t => t.toUpperCase())
      const path = `/albums/${album}/${name}`

      return {
        id: createHash('md5').update(raw).digest('hex'),
        album,
        name,
        path,
        raw
      }
    })
    .where(x => x.album)
    .orderByDescending(x => x.id)
    .skip(skip)
    .take(limit)
    .toArray()

  return {
    documents,
    count: files.length
  }
}

module.exports = {
  uploadFile,
  listFiles
}
