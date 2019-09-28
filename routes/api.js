const Router = require('express').Router
const api = Router()

const reposController = require('../api/repos')
const commitsController = require('../api/commits')
const contentController = require('../api/content')
const blobController = require('../api/blob')

api.get('/', reposController.get)
api.post('/', reposController.post)
api.delete('/:repositoryId', reposController.delete)
api.get('/:repositoryId/commits/:commitHash?', commitsController.getCommits)
api.get('/:repositoryId/commits/:commitHash/diff', commitsController.diff)
api.get('/:repositoryId/tree/:commitHash?/:path([^/]*)?', contentController.repoContent) // *TODO: make (/tree...)? | Created at: 14.Sep.2019
api.get('/:repositoryId/blob/:commitHash/:pathToFile([^/]*)', blobController.show)

module.exports = api
