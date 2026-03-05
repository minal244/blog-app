<template>
  <div class="auth-box">

    <h1>Register</h1>

    <form @submit.prevent="handleRegister">

      <!-- Username -->
      <input
        v-model="username"
        placeholder="Username"
        @blur="$v.username.$touch()"
      />
      <FormError :message="getError($v.username)" />

      <!-- Email -->
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        @blur="$v.email.$touch()"
      />
      <FormError :message="getError($v.email)" />

      <!-- Password -->
      <PasswordInput
        v-model="password"
        placeholder="Password"
        :visible="showPassword"
      />
      <FormError :message="getError($v.password)" />

      <!-- Confirm Password -->
      <PasswordInput
        v-model="confirmPassword"
        placeholder="Confirm Password"
        :visible="showPassword"
      />
      <FormError :message="getError($v.confirmPassword)" />

      <button
        type="button"
        @click="showPassword = !showPassword"
        class="btn"
      >
        {{ showPassword ? 'Hide Password' : 'Show Password' }}
      </button>

      <button type="submit" class="btn">
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
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false
    }
  },

  validations() {
    return {
      username: rules.required,
      email: rules.email,
      password: rules.password,
      confirmPassword: rules.confirmPassword(() => this.password)
    }
  },

  methods: {

    getError,

    async handleRegister() {

      this.$v.$touch()

      if (this.$v.$invalid) {
        this.$toast.error('Fix form errors')
        return
      }

      try {

        const res = await this.$axios.post('/auth/register', {
          username: this.username,
          email: this.email,
          password: this.password
        })

        this.$store.dispatch('login', res.data)

        this.$toast.success('Account created')

        this.$router.push('/dashboard')

      } catch {
        this.$toast.error('User already exists')
      }

    }

  }

}
</script>