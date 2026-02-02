export const state = () => ({
  user: null
})

export const mutations = {

  setUser(state, user) {
    state.user = user
  },

  logout(state) {
    state.user = null
  }

}

export const actions = {

  login({ commit }, user) {
    localStorage.setItem('user', JSON.stringify(user))
    commit('setUser', user)
  },

  loadUser({ commit }) {
    const user = localStorage.getItem('user')

    if (user) {
      commit('setUser', JSON.parse(user))
    }
  },

  logout({ commit }) {
    localStorage.removeItem('user')
    commit('logout')
  }

}
