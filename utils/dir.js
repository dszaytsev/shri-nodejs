const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const readdir = promisify(fs.readdir)

exports.readDirsOnly = dirPath => readdir(dirPath, { withFileTypes: true })
  .then(dirents => dirents
    .filter(d => d.isDirectory())
    .map(d => ({ name: d.name, path: path.join(dirPath, d.name) }))
  )
