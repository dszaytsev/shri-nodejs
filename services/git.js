const { spawn } = require('child_process')

exports.log = (path, commit = '') => {
  const SEPARATOR = ';separator;'

  return git(`log --pretty=format:"%H${SEPARATOR}%ad${SEPARATOR}%s" ${commit}`, { path, acc: [] },
    (data, acc) => {
      const commitEntities = data
        .toString().split('\n').filter(Boolean)
        .map(commit => {
          const [hash, data, author] = commit.split(SEPARATOR)
          return { hash, data, author }
        })

      acc.push(...commitEntities)
      return acc
    })
}

exports.diff = (path, commit = '') => git(`diff ${commit}`,
  { path, acc: '' },
  (data, acc) => acc += data
)

// git ls-tree HEAD --name-only | xargs -n1 git log HEAD -n 1 --pretty=oneline
exports.tree = (path, commitHash = '') => git(`ls-tree --name-only -r ${commitHash}`,
  { path, acc: [] },
  (data, acc) => {
    acc.push(...data.toString().split('\n'))
    return acc
  }
)

exports.showFile = async (path, commitHash, filePath) => {
  const chunks = await git(`--no-pager  show ${commitHash}:${filePath}`,
    { path, acc: [] },
    (data, acc) => {
      acc.push(Buffer.from(data))
      return acc
    }
  )

  return Buffer.concat(chunks)
}

exports.getMainBranchHash = path => git('symbolic-ref --short HEAD | xargs git rev-parse',
  { path, acc: '' },
  (data, acc) => data += acc)

exports.getRevHash = (path, commitHash) => git(`rev-parse ${commitHash}`,
  { path, acc: '' },
  (data, acc) => data += acc
)

exports.clone = (repoUrl, path) => new Promise((resolve, reject) => {
  let errors = ''

  const child = spawn(`git clone ${repoUrl}`, { cwd: path, shell: true })

  child.stderr.on('data', data => {
    // horrible crutch cause git clone writes to stderr
    if (!data.includes('Cloning into')) errors += data
  })

  child.on('close', () => errors === '' ? resolve() : reject(errors))
  child.on('error', reject)
})

function git(command, { path, acc = '' }, readFn) {
  return new Promise((resolve, reject) => {
    let errors = ''

    const child = spawn(`git ${command}`, { cwd: path, shell: true })

    child.stdout.on('data', data => {
      acc = readFn(data, acc)
    })
    child.stderr.on('data', data => errors += data)

    child.on('close', () => errors === '' ? resolve(acc) : reject(errors))
    child.on('error', reject)
  })
}
