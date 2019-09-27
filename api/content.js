const db = require('../services/db')
const git = require('../services/git')
const { error, dir } = require('../utils')

exports.repoContent = async (req, res, next) => {
  const { repositoryId, commitHash, path } = req.params

  const repo = db.repos.get(repositoryId).value()

  if (!repo) next(error('Repo not found', 422))

  try {
    const hash = commitHash
      ? await git.getRevHash(repo.path, commitHash)
      : await git.getMainBranchHash(repo.path)

    const paths = await git.tree(repo.path, hash)

    const hashFilesPath = `${repositoryId}.hashes.${hash}.files`
    const treeFromDb = db.repos.get(hashFilesPath).value()
    const tree = treeFromDb || dir.parsePathToTree(paths)

    if (!treeFromDb) db.repos.set(hashFilesPath, tree).write()

    if (path) {
      const pathsFromPath = db.repos.get(`${hashFilesPath}.${path.split('/').join('.')}`).value() // :)
      res.json(pathsFromPath)
    }
    else res.json(tree)
  } catch (err) {
    next(error(err, 422))
  }
}
