export default function ({ store, redirect }) {

  if (!store.state.user) {

    const user = process.client
      ? localStorage.getItem('user')
      : null

    if (user) {
      store.commit('setUser', JSON.parse(user))
      return
    }

    return redirect('/login')
  }
}
