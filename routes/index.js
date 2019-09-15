const Router = require('express').Router
const reposController = require('../controllers/repos')
const commitsController = require('../controllers/commits')
const contentController = require('../controllers/content')
const blobController = require('../controllers/blob')

const router = Router()
const repos = Router()

repos.get('/', reposController.get)
repos.post('/', reposController.post)
repos.delete('/:repositoryId', reposController.delete)
repos.get('/:repositoryId/commits/:commitHash?', commitsController.getCommits)
repos.get('/:repositoryId/commits/:commitHash/diff', commitsController.diff)
repos.get('/:repositoryId/tree/:commitHash?/:path([^/]*)?', contentController.repoContent) // *TODO: make (/tree...)? | Created at: 14.Sep.2019
repos.get('/:repositoryId/blob/:commitHash/:pathToFile([^/]*)', blobController.show)

router.use('/api/repos', repos)

module.exports = router
