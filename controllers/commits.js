const git = require('../services/git')
const db = require('../services/db')
const { error } = require('../utils')

// *TODO: add DRY if there's time | Created at: 14.Sep.2019
exports.getCommits = async (req, res, next) => {
  const { repositoryId, commitHash } = req.params

  const repo = db.repos.get(repositoryId).value()

  if (!repo) next(error('Repo not found', 422))

  try {
    const hash = commitHash || await git.getMainBranchHash(repo.path)
    const commits = await git.log(repo.path, hash)

    res.json(commits)
  } catch (err) {
    next(error(err, 422))
  }
}

exports.diff = async (req, res, next) => {
  const { repositoryId, commitHash } = req.params

  const repo = db.repos.get(repositoryId).value()

  if (!repo) next(error('Repo not found', 422))

  try {
    const diff = await git.diff(repo.path, commitHash)

    res.json({ diff })
  } catch (err) {
    next(error(err, 422))
  }
}
