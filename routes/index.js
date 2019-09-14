const Router = require('express').Router
const reposController = require('../controllers/repos')
const commitsController = require('../controllers/commits')

const router = Router()
const api = Router()

api.get('/repos', reposController.get)
api.get('/repos/:repositoryId/commits/:commitHash', commitsController.getCommits)
api.get('/repos/:repositoryId/commits/:commitHash/diff', commitsController.diff)

router.use('/api', api)

module.exports = router
