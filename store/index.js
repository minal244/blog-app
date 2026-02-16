export const state = () => ({
  user: null
})

export const mutations = {

  setUser(state, user) {
    state.user = user
  },

  clearUser(state) {
    state.user = null
  }

}

export const actions = {

  login({ commit }, user) {
    localStorage.setItem('user', JSON.stringify(user))
    commit('setUser', user)
  },

  logout({ commit }) {
    localStorage.removeItem('user')
    commit('clearUser')
  },

  initAuth({ commit }) {
    if (process.client) {
      const user = localStorage.getItem('user')
      if (user) {
        commit('setUser', JSON.parse(user))
      }
    }
  }

}
