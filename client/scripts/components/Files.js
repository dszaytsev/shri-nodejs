import { Component, connectStore } from 'redux-store'

import store from '../store'
import { fetchFiles } from '../actions'

class Files extends Component {
  constructor(props) {
    super(props)

    this.dispatch(fetchFiles())
  }

  render({ files = [] }) {

    return files.search.reduce((acc, { type, name, commit, message, committer, updated }) => {
      return acc + `
      <div class="Table-row">
        <div class="Table-cell">
          <div class="RepositoryFiles-icon">
            <div class="FileIcon FileIcon_${type}"></div>
          </div>${name}</div>
        <div class="Table-cell"><a class="Link" href="#">${commit}</a></div>
        <div class="Table-cell">${message}</div>
        <div class="Table-cell">
          <div class="Committer">${committer}</div>
        </div>
        <div class="Table-cell">${updated}</div>
      </div>
    `
    }, '')
  }
}

export default connectStore(store, Files)
