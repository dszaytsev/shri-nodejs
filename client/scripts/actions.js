export function updateFiles(files) {
  return { type: 'Files/update', files }
}

export function fetchFiles() {
  return dispatch => {
    fetch('/api/repos/task1/tree')
      .then(res => res.json())
      .then(data => dispatch(updateFiles(data)))
  }
}

export function findFile(value) {
  return { type: 'Files/search', value }
}
