const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const readdir = promisify(fs.readdir)
const unlink = promisify(fs.unlink)
const rmdir = promisify(fs.rmdir)

exports.rmdir = async dir => {
  const [files, dirs] = readDir(dir)

  await Promise.all(files.map(file => unlink(file)))

  const dirsToRemove = [dir, ...dirs]
    .reverse().map(d => rmdir(d))

  return Promise.all(dirsToRemove)
}


exports.readDirsOnly = dirPath => readdir(dirPath, { withFileTypes: true })
  .then(dirents => dirents
    .filter(d => d.isDirectory())
    .map(d => ({ name: d.name, path: path.join(dirPath, d.name) }))
  )

exports.parsePathToTree = (paths = []) => {
  const result = {}

  paths.forEach(p => p
    .split('/')
    .reduce((acc, curr) => acc[curr] = acc[curr] || {}, result)
  )

  return result
}

function readDir(dir) {
  const files = []
  const dirs = []

  const readDirFiles = (base, level) => {
    const entities = fs.readdirSync(base)

    entities.forEach(entity => {
      const localBase = path.join(base, entity)
      const state = fs.statSync(localBase)

      if (state.isDirectory()) {
        dirs.push(localBase)
        readDirFiles(localBase, level + 1)
      } else {
        files.push(localBase)
      }
    })
  }

  readDirFiles(dir, 0)

  return [files, dirs]
}
