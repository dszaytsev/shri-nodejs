const { spawn, exec } = require('child_process')

// *TODO: add DRY if there's time | Created at: 14.Sep.2019
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

  child.on('close', () => errors === '' ? resolve(commits) : reject(errors))
  child.on('error', err => reject(err))
})

exports.diff = (path, commit = '') => new Promise((resolve, reject) => {
  let diff = ''
  let errors = ''

  const child = spawn(`git diff ${commit}`, {
    cwd: path,
    shell: true
  })

  child.stdout.on('data', data => diff += data)
  child.stderr.on('data', data => errors += data)

  child.on('close', () => errors === '' ? resolve(diff) : reject(errors))
  child.on('error', err => reject(err))
})

exports.tree = async (repoPath, commitHash = '') => new Promise((resolve, reject) => {
  const files = []
  let errors = ''

  const child = spawn(`git ls-tree --name-only -r ${commitHash}`, {
    cwd: repoPath,
    shell: true
  })

  child.stdout.on('data', data => files.push(...data.toString().split('\n')))
  child.stderr.on('data', data => errors += data)

  child.on('close', () => errors === '' ? resolve(files) : reject(errors))
  child.on('error', err => reject(err))
})

exports.getMainBranchHash = path => new Promise((resolve, reject) => {
  exec('git symbolic-ref --short HEAD | xargs git rev-parse', { cwd: path }, (err, stdout, stderr) => {
    if (err) reject(err)
    if (stderr) reject(stderr)

    resolve(stdout.trim())
  })
})

exports.getRevHash = (path, commitHash) => new Promise((resolve, reject) => {
  exec(`git rev-parse ${commitHash}`, { cwd: path }, (err, stdout, stderr) => {
    if (err) reject(err)
    if (stderr) reject(stderr)

    resolve(stdout.trim())
  })
})

exports.showFile = (path, commitHash, filePath) => new Promise((resolve, reject) => {
  const chunks = []
  let errors = ''

  const child = spawn(`git --no-pager show ${commitHash}:${filePath} `, {
    cwd: path,
    shell: true
  })

  child.stdout.on('data', data => chunks.push(Buffer.from(data)))
  child.stderr.on('data', data => errors += data)

  child.on('close', () => errors === ''
    ? resolve(Buffer.concat(chunks))
    : reject(errors)
  )
  child.on('error', err => reject(err))
})

exports.clone = (repoUrl, path) => new Promise((resolve, reject) => {
  let errors = ''

  const child = spawn(`git clone ${repoUrl}`, {
    cwd: path,
    shell: true
  })

  child.stderr.on('data', data => {
    // horrible crutch cause git clone writes to stderr
    if (!data.includes('Cloning into')) errors += data
  })

  child.on('close', () => errors === ''
    ? resolve()
    : reject(errors)
  )
  child.on('error', err => {
    reject(err)
  })
})
