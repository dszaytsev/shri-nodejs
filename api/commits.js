const git = require('../services/git')
const db = require('../services/db')
const { error } = require('../utils')

// *TODO: add DRY if there's time | Created at: 14.Sep.2019
exports.getCommits = async (req, res, next) => {
  const PER_PAGE = 20
  let { page = 1 } = req.query
  page = page < 1 ? 1 : page
  const range = [PER_PAGE * (page - 1), PER_PAGE * page]

  const { repositoryId, commitHash } = req.params

  const repo = db.repos.get(repositoryId).value()

  if (!repo) next(error('Repo not found', 422))

  try {
    const hash = commitHash || await git.getMainBranchHash(repo.path)

    const commitsPath = `${repositoryId}.commits.${hash}`
    const commitsFromDb = db.repos.get(commitsPath).value()
    const commits = commitsFromDb || await git.log(repo.path, hash)

    if (!commitsFromDb) db.repos.set(commitsPath, commits).write()

    res.json(commits.slice(...range))
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
