import store from '../../store'
import { fetchFiles, findFile } from './actions'

export default class Index {
  constructor(el, store) {
    this._store = store

    const [searchEl, files] = ['search', 'files']
      .map(name => el.querySelector(`[data-el="Index/${name}"]`))

    this._searchEl = searchEl
    this._files = files

    this._searchEl.addEventListener('input', this.handleInput)

    store.dispatch(fetchFiles('repos params'))
    store.subscribe(this.render.bind(this))
  }

  handleInput(e) {
    const value = e.currentTarget.value

    store.dispatch(findFile(value))
  }

  // *TODO: поменять структуру файла в апи | Created at: 27.Sep.2019
  renderFile(fileName) {
    return `
      <div class="Table-row">
        <div class="Table-cell">
          <div class="RepositoryFiles-icon">
            <div class="FileIcon FileIcon_folder"></div>
          </div>${fileName}</div>
        <div class="Table-cell"><a class="Link" href="#">d53dsv</a></div>
        <div class="Table-cell">[vcs] test for empty commit message</div>
        <div class="Table-cell">
          <div class="Committer">nikitxskv</div>
        </div>
        <div class="Table-cell">1 min ago</div>
      </div>
    `
  }

  render(state) {
    const files = state.files.search.reduce((acc, file) => acc += this.renderFile(file), '')

    this._files.innerHTML = files
  }
}
