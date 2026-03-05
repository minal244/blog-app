export default function ({ redirect, store }) {

  if (process.client) {

    const token = localStorage.getItem('token')

    if (!token) {
      return redirect('/login')
    }

    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (Date.now() >= payload.exp * 1000) {
        store.dispatch('logout')
        return redirect('/login')
      }
    } catch {
      store.dispatch('logout')
      return redirect('/login')
    }

  }

}
