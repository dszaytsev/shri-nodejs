const express = require('express')
const path = require('path')
const initDb = require('./initializers/initDb')

const [{ }, { }, pathArg = '.'] = process.argv
const pathToRepos = path.resolve(pathArg)

const app = express()

app.use('/', require('./routes'))
app.use((_, res) => res.send(404))

app.use((err, _req, res, _next) => {
  const status = err.status || 500

  res.status(status)
  res.json({
    status: 'error',
    message: err.message
  })
})

initDb(pathToRepos)
  .then(() => {
    const server = app.listen(process.env.PORT || 3000, function () {
      console.log('Сервер запущен на портe: ' + server.address().port)
    })
  })

// git rev-list --all
