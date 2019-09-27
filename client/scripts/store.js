import Store, { useThunk } from 'redux-store'

const initState = {
  files: {
    content: [],
    search: [],
  }
}

const reducer = (state, action) => {
  switch (action.type) {
  case 'Files/update': {
    const search = state.files.search.length ? state.files.search : action.payload
    return { ...state,
      files: { content: action.payload, search }
    }
  }

  case 'Files/search': {
    const value = action.payload
    const search = state.files.content.filter(file => file.toLowerCase().includes(value.toLowerCase()))

    return { ...state, files: { ...state.files, search } }
  }

  default:
    return state
  }
}

const store = new Store(reducer, initState)

store.use(useThunk())

export default store
