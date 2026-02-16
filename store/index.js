export const state = () => ({
  user: null,
  token: null
})

export const mutations = {

  setAuth(state, payload) {
    state.user = payload.user
    state.token = payload.token
  },

  clearAuth(state) {
    state.user = null
    state.token = null
  }

}

export const actions = {

  login({ commit }, data) {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    commit('setAuth', data)
  },

  logout({ commit }) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    commit('clearAuth')
  },

  initAuth({ commit }) {
    if (process.client) {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')

      if (token && user) {
        commit('setAuth', {
          token,
          user: JSON.parse(user)
        })
      }
    }
  }

}
