import { Search, Files } from './components'

export default function () {
  const filesEl = document.querySelector('[data-component="Files"]')
  const searchEl = document.querySelector('[data-component="Search"')

  if (!filesEl || !searchEl) return

  new Search(searchEl)
  new Files(filesEl)
}
