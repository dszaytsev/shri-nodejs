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

exports.repoContent = (req, res) => {
  res.json([
    {type: 'folder', name: 'api', commit: 'd53dsv', message: '[vcs] move http to arc', commiter: 'noxoomo', updated: '4 s ago'},
    {type: 'folder', name: 'ci', commit: 'c53dsv', message: '[vcs] test for empty commit message', commiter: 'nikitxskv', updated: '1 min ago'},
    {type: 'folder', name: 'contrlib', commit: 's53dsv', message: '[vcs] change owner to g:arc', commiter: 'nalpp', updated: '16:25'},
    {type: 'folder', name: 'http', commit: 'h5jdsv', message: '[vcs] move http to arc', commiter: 'somov', updated: '4 s ago'},
    {type: 'folder', name: 'lib', commit: 'f5jdsv', message: 'ARCADIA-771: append /trunk/arcadia/', commiter: 'deshevoy', updated: 'Yesterday, 14:50'},
    {type: 'folder', name: 'local', commit: 'k5jdsv', message: 'ARCADIA-771: append /trunk/arcadia/', commiter: 'exprmntr', updated: 'Jan 11, 12:01'},
    {type: 'folder', name: 'packages', commit: 'a5jdsv', message: '[vcs] VCS-803: packages for services', commiter: 'levanov', updated: 'Jan 10, 12:01'},
    {type: 'folder', name: 'robots', commit: 'l5jdsv', message: 'ARCADIA-771: convert string to json object', commiter: 'torkve', updated: 'Jan 1, 12:01'},
    {type: 'folder', name: 'server', commit: 'j5jdsv', message: '[vcs] get list of refs', commiter: 'spreis', updated: 'Dec 29, 2017'},
    {type: 'folder', name: 'ut', commit: '5jdsvk', message: '[vsc] store merge conflicts', commiter: 'noxoomo', updated: 'Dec 29, 2017'},
    {type: 'markup', name: 'README.md', commit: 'h5jdsl', message: '[vcs] add readme', commiter: 'pg', updated: 'Dec 29, 2017'},
    {type: 'file', name: 'ya.make', commit: 'k5jdsv', message: '[vcs] move http to arc', commiter: 'mvel', updated: 'Dec 29, 2017'}
  ])
}
