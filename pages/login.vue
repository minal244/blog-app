<template>
  <div class="auth-box">

    <h1>Login</h1>

    <form @submit.prevent="handleLogin">

      <input
        v-model="email"
        placeholder="Email"
        type="email"
      />

      <FormError :validation="$v.email" />

      <PasswordInput
        v-model="password"
        placeholder="Password"
      />

      <FormError :validation="$v.password" />

      <button :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>

      <nuxt-link to="/register">
        Create Account
      </nuxt-link>

    </form>

  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import FormError from '~/components/FormError.vue'
import PasswordInput from '~/components/PasswordInput.vue'

export default {

  layout: 'auth',

  components: { FormError, PasswordInput },

  data() {
    return {
      email: '',
      password: '',
      loading: false
    }
  },

  validations: {
    email: { required, email },
    password: { required }
  },

  methods: {

    handleLogin() {

      this.$v.$touch()
      if (this.$v.$invalid) return

      this.loading = true

      setTimeout(() => {

        let users = JSON.parse(localStorage.getItem('users')) || []

        const user = users.find(
          u => u.email === this.email &&
               u.password === this.password
        )

        if (!user) {
          this.$toast.error('Invalid credentials')
          this.loading = false
          return
        }

        this.$store.dispatch('login', user)

        this.$toast.success('Welcome back!')

        this.$router.push('/dashboard')

      }, 800)
    }

  }

}
</script>
