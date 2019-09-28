const Router = require('express').Router
const api = require('./api')

const router = Router()

const PAGES = ['branches', 'commit', 'details', 'directory', 'history']

// Временное решение
router.get('/', (req, res) => res.render('pages/index'))
PAGES.forEach(page => router.get(`/${page}`, (req, res) => res.render(`pages/${page}`)))


router.use('/api/repos', api)

module.exports = router
