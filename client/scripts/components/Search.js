import { connectStore, Component } from 'redux-store'

import store from '../store'
import { findFile } from '../actions'

class Search extends Component {
  constructor(elem, props) {
    super(elem, props)

    this.elem.addEventListener('input', this.handleInput.bind(this))
  }

  handleInput(e) {
    this.dispatch(findFile(e.target.value))
  }

  render() {
    return null
  }
}

export default connectStore(store, Search)
