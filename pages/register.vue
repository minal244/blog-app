<template>
  <div class="auth-box">

    <h1>Register</h1>

    <form @submit.prevent="handleRegister">

      <input v-model="name" placeholder="Name" />
      <FormError :validation="$v.name" />

      <input v-model="email" placeholder="Email" />
      <FormError :validation="$v.email" />

      <PasswordInput
        v-model="password"
        placeholder="Password"
      />
      <FormError :validation="$v.password" />

      <PasswordInput
        v-model="confirmPassword"
        placeholder="Confirm Password"
      />
      <FormError :validation="$v.confirmPassword" />

      <button>
        Register
      </button>

      <nuxt-link to="/login">
        Already have account?
      </nuxt-link>

    </form>

  </div>
</template>

<script>
import { required, email, sameAs } from 'vuelidate/lib/validators'
import FormError from '~/components/FormError.vue'
import PasswordInput from '~/components/PasswordInput.vue'

export default {

  layout: 'auth',

  components: { FormError, PasswordInput },

  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  },

  validations: {
    name: { required },
    email: { required, email },
    password: { required },
    confirmPassword: {
      required,
      sameAsPassword: sameAs('password')
    }
  },

  methods: {

    handleRegister() {

      this.$v.$touch()
      if (this.$v.$invalid) return

      let users = JSON.parse(localStorage.getItem('users')) || []

      if (users.find(u => u.email === this.email)) {
        this.$toast.warning('User already exists')
        return
      }

      const newUser = {
        name: this.name,
        email: this.email,
        password: this.password
      }

      users.push(newUser)

      localStorage.setItem('users', JSON.stringify(users))

      this.$store.dispatch('login', newUser)

      this.$toast.success('Account created')

      this.$router.push('/dashboard')
    }

  }

}
</script>