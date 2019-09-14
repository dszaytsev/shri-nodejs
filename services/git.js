const { spawn } = require('child_process')

exports.log = (path, commit = '') => new Promise((resolve, reject) => {
  const SEPARATOR = ';separator;'
  const commits = []
  let errors = ''

  const child = spawn(`git log --pretty=format:"%H${SEPARATOR}%ad${SEPARATOR}%s" ${commit}`, {
    cwd: path,
    shell: true
  })

  child.stdout.on('data', data => {
    const commitEntities = data
      .toString().split('\n').filter(Boolean)
      .map(commit => {
        const [hash, data, author] = commit.split(SEPARATOR)
        return { hash, data, author }
      })

    commits.push(...commitEntities)
  })

  child.stderr.on('data', data => errors += data)

  child.on('close', () => {
    errors === ''
      ? resolve(commits)
      : reject(errors)
  })

  child.on('error', err => reject(err))
})
