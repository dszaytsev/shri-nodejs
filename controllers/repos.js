const db = require('../services/db')

exports.get = (req, res) => {
  res.json(Object.keys(db.repos.value()))
}
