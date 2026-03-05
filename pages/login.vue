<template>
  <div class="auth-box">

    <h1>Login</h1>

    <form @submit.prevent="handleLogin">

      <!-- Identifier -->
      <input
        v-model="identifier"
        type="text"
        placeholder="Username or Email"
        @blur="$v.identifier.$touch()"
      />

      <FormError :message="getError($v.identifier)" />

      <!-- Password -->
      <PasswordInput
        v-model="password"
        placeholder="Password"
        :visible="showPassword"
      />

      <FormError :message="getError($v.password)" />

      <button
        type="button"
        @click="showPassword = !showPassword"
        class="btn"
      >
        {{ showPassword ? 'Hide Password' : 'Show Password' }}
      </button>

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
import FormError from '~/components/FormError.vue'
import { rules } from '~/utils/validations/rules'
import { getError } from '~/utils/validations/getError'

export default {

  layout: 'auth',
  middleware: 'guest',

  components: {
    PasswordInput,
    FormError
  },

  data() {
    return {
      identifier: '',
      password: '',
      showPassword: false
    }
  },

  validations() {
    return {
      identifier: rules.required,
      password: rules.password
    }
  },

  methods: {

    getError,

    async handleLogin() {

      this.$v.$touch()

      if (this.$v.$invalid) {
        this.$toast.error('Fix form errors')
        return
      }

      try {

        const res = await this.$axios.post('/auth/login', {
          identifier: this.identifier,
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