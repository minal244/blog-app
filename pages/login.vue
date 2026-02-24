<template>
  <div class="auth-box">

    <h1>Login</h1>

    <form @submit.prevent="handleLogin">

      <input
        v-model="email"
        type="email"
        placeholder="Email"
        required
      />

      <PasswordInput
        v-model="password"
        placeholder="Password"
      />

      <button type="submit">
        Login
      </button>

      <nuxt-link to="/register">
        Create Account
      </nuxt-link>

    </form>

  </div>
</template>

<script>
import PasswordInput from '~/components/PasswordInput.vue'

export default {

  layout: 'auth',
  middleware: 'guest',
  components: { PasswordInput },

  data() {
    return {
      email: '',
      password: ''
    }
  },

  methods: {

    async handleLogin() {

      try {

        const res = await this.$axios.post('/auth/login', {
          email: this.email,
          password: this.password
        })

        this.$store.dispatch('login', res.data)

        this.$toast.success('Welcome back')

        this.$router.push('/dashboard')

      } catch {
        this.$toast.error('Invalid credentials')
      }

    }

  }

}
</script>
