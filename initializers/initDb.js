const db = require('../services/db')
const { readDirsOnly } = require('../utils/dir')

module.exports = async (pathToRepos) => {
  const repos = await readDirsOnly(pathToRepos)

  repos.forEach(r => db.repos
    .set(r.name, { path: r.path })
    .write()
  )
}
