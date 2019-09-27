import store from './scripts/store'

import Index from './scripts/screens/index'

document.addEventListener('DOMContentLoaded', () => {
  const indexPage = document.querySelector('[data-screen="Index"]')

  new Index(indexPage, store)
})
