<template>
  <div class="login">

    <h2>Login</h2>

    <form @submit.prevent="login">

      <!-- Email -->
      <FormInput
        v-model="email"
        placeholder="Email"
        type="email"
        :validation="$v.email"
      />

      <div v-if="$v.email.$error" class="error">
        <span v-if="!$v.email.required">
          Email is required
        </span>
        <span v-if="!$v.email.email">
          Invalid email format
        </span>
      </div>

      <!-- Password -->
      <div class="password-field">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          placeholder="Password"
        />

        <span
          class="toggle"
          @click="showPassword = !showPassword"
        >
          {{ showPassword ? 'Hide' : 'Show' }}
        </span>
      </div>

      <div v-if="$v.password.$error" class="error">
        <span v-if="!$v.password.required">
          Password is required
        </span>
        <span v-if="!$v.password.minLength">
          Minimum 6 characters
        </span>
      </div>

      <nuxt-link to="/register">
        Create Account
      </nuxt-link>

      <button type="submit" :disabled="loading">

        <span v-if="!loading">Login</span>
        <span v-else>Logging in...</span>

      </button>


    </form>

  </div>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators'

export default {

  layout: 'auth',

  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      loading: false 
    }
  },

  validations: {

    email: {
      required,
      email
    },

    password: {
      required,
      minLength: minLength(6)
    }
  },

  methods: {

    async login() {

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

      }, 800) // fake delay
    }
  }

}
</script>

<style scoped>
input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;

  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  width: 100%;
  padding: 10px;

  background: #2c3e50;
  color: white;

  border: none;
  border-radius: 5px;

  cursor: pointer;
}

button:hover {
  background: #1a252f;
}

a {
  color: #4ca1af;
  font-weight: bold;
}

.error {
  color: red;
  font-size: 13px;
  margin-bottom: 10px;
}
.password-field {
  position: relative;
}

.toggle {
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
  font-size: 12px;
  color: #4ca1af;
}
</style>
