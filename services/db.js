const fs = require('fs')
const low = require('lowdb')
const path = require('path')
const FileSync = require('lowdb/adapters/FileSync')

const dbPath = path.join(__dirname, '../db.json')
fs.writeFileSync(dbPath, '{}')

const adapter = new FileSync(dbPath)
const db = low(adapter)

db.defaults({
  repos: {}
}).write()

db['repos'] = db.get('repos')

module.exports = db

