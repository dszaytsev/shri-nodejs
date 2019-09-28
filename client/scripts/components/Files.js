import { Component, connectStore } from 'redux-store'

import store from '../store'
import { fetchFiles } from '../actions'

class Files extends Component {
  constructor(props) {
    super(props)

    this.dispatch(fetchFiles())
  }

  render({ files = [] }) {
    return files.search.reduce((acc, file) => {
      return acc + `
      <div class="Table-row">
        <div class="Table-cell">
          <div class="RepositoryFiles-icon">
            <div class="FileIcon FileIcon_folder"></div>
          </div>${file}</div>
        <div class="Table-cell"><a class="Link" href="#">d53dsv</a></div>
        <div class="Table-cell">[vcs] test for empty commit message</div>
        <div class="Table-cell">
          <div class="Committer">nikitxskv</div>
        </div>
        <div class="Table-cell">1 min ago</div>
      </div>
    `
    }, '')
  }
}

export default connectStore(store, Files)
