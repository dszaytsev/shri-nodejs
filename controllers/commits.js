const git = require('../services/git')
const db = require('../services/db')
const { error } = require('../utils')

exports.getCommits = async (req, res, next) => {
  const { repositoryId, commitHash } = req.params

  const repo = db.repos.get(repositoryId).value()

  if (!repo) {
    next(error('Repo not found', 422))
  }

  try {
    const commits = await git.log(repo.path, commitHash)

    res.json(commits)
  } catch (err) {
    next(error(err, 422))
  }
}
