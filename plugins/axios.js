export default function ({ $axios, store, redirect }) {

  $axios.onRequest(config => {

    const token = localStorage.getItem('token')

    if (token) {
      config.headers.common['Authorization'] = `Bearer ${token}`
    }

  })

  $axios.onResponseError(error => {

    if (error.response?.status === 401) {
      store.dispatch('logout')
      redirect('/login')
    }

    return Promise.reject(error)

  })

}
