<template>
  <div class="auth-box">

    <h1>Register</h1>

    <form @submit.prevent="handleRegister">

      <!-- Username -->
      <input
        v-model="username"
        placeholder="Username"
        :class="{ error: $v.username.$error }"
        @blur="$v.username.$touch()"
        @input="checkUsername"
      />
      <FormError :message="getError($v.username)" />
      <p v-if="usernameStatus === 'checking'" class="username-status checking">Checking...</p>
      <p v-else-if="usernameStatus === 'available'" class="username-status available">✓ Username available</p>
      <p v-else-if="usernameStatus === 'taken'" class="username-status taken">✗ Username already taken</p>

      <!-- Email -->
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        :class="{ error: $v.email.$error }"
        @blur="$v.email.$touch()"
      />
      <FormError :message="getError($v.email)" />

      <!-- Password -->
      <PasswordInput
        v-model="password"
        placeholder="Password"
        :visible="showPassword"
        @blur="$v.password.$touch()"
      />
      <FormError :message="getError($v.password)" />

      <!-- Confirm Password -->
      <PasswordInput
        v-model="confirmPassword"
        placeholder="Confirm Password"
        :visible="showPassword"
        @blur="$v.confirmPassword.$touch()"
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
      showPassword: false,
      usernameStatus: null,
      usernameTimer: null
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

    checkUsername() {
      clearTimeout(this.usernameTimer)

      if (!this.username) {
        this.usernameStatus = null
        return
      }

      this.usernameStatus = 'checking'

      this.usernameTimer = setTimeout(async () => {
        const res = await this.$axios.get('/auth/check-username', {
          params: { username: this.username }
        })
        this.usernameStatus = res.data.available ? 'available' : 'taken'
      }, 400)
    },

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

