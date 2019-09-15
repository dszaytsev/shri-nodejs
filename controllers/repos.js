const db = require('../services/db')
const { dir, error } = require('../utils')

exports.get = (req, res) => {
  res.json(Object.keys(db.repos.value()))
}

exports.delete = async (req, res, next) => {
  const { repositoryId } = req.params

  const repo = db.repos.get(repositoryId).value()

  if (!repo) next(error('Repo not found', 422))

  try {
    await dir.rmdir(repo.path)

    res.json({ status: 'ok', message: 'Repo deleted' })
  } catch (e) {
    next(error('Failed', 500))
  }
}
