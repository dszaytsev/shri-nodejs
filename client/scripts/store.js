import { useThunk, Store } from 'redux-store'

const initState = {
  files: {
    content: [],
    search: [],
  }
}

const reducer = (state, { type, ...payload }) => {
  switch (type) {
  case 'Files/update': {
    const search = state.files.search.length ? state.files.search : payload.files

    return { ...state,
      files: { content: payload.files, search }
    }
  }

  case 'Files/search': {
    const value = payload.value.toLowerCase()
    const search = state.files.content.filter(({ name }) => name.toLowerCase().includes(value.toLowerCase()))

    return { ...state, files: { ...state.files, search } }
  }

  default:
    return state
  }
}

const store = new Store(reducer, initState)

store.use(useThunk())

export default store
