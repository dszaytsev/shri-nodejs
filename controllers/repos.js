const db = require('../services/db')

exports.get = (res, req) => {
  req.json(Object.keys(db.repos.value()))
}
