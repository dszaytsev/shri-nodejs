export function updateFiles(files) {
  return {
    type: 'Files/update',
    payload: Object.keys(files).filter(Boolean)
  }
}

export function fetchFiles(params) {
  return dispatch => {
    fetch('/api/repos/task1/tree')
      .then(res => res.json())
      .then(data => dispatch(updateFiles(data)))
  }
}

export function findFile(value) {
  return {
    type: 'Files/search',
    payload: value
  }
}
