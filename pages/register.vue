<template>
  <div class="auth-box">

    <h1>Register</h1>

    <form @submit.prevent="handleRegister">

      <input v-model="name" placeholder="Name" required />
      <input v-model="email" type="email" placeholder="Email" required />

      <PasswordInput
        v-model="password"
        placeholder="Password"
      />

      <button type="submit">
        Register
      </button>

      <nuxt-link to="/login">
        Already have account?
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
      name: '',
      email: '',
      password: ''
    }
  },

  methods: {

    async handleRegister() {

      try {

        await this.$axios.post('/auth/register', {
          name: this.name,
          email: this.email,
          password: this.password
        })

        this.$toast.success('Account created')

        this.$router.push('/login')

      } catch {
        this.$toast.error('User already exists')
      }

    }

  }

}
</script>
