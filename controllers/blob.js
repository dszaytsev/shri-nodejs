const mime = require('mime-types')
const git = require('../services/git')
const db = require('../services/db')
const { error } = require('../utils')

exports.show = async (req, res, next) => {
  const { repositoryId, commitHash, pathToFile } = req.params

  const repo = db.repos.get(repositoryId).value()

  if (!repo) next(error('Repo not found', 422))

  try {
    const file = await git.showFile(repo.path, commitHash, pathToFile)

    res.type(mime.lookup(pathToFile))
    res.send(file)
  } catch (err) {
    next(error(err, 422))
  }
}
