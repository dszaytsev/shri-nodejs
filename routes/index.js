const Router = require('express').Router
const reposController = require('../controllers/repos')

const router = Router()
const api = Router()

api.get('/repos', reposController.get)

router.use('/api', api)

module.exports = router
