<template>
  <div>

    <h2>Register</h2>

    <form @submit.prevent="register">

      <!-- Name -->
      <input v-model="name" placeholder="Name" />

      <div v-if="$v.name.$error" class="error">
        Name is required
      </div>

      <!-- Email -->
      <input
        v-model="email"
        type="email"
        placeholder="Email"
      />

      <div v-if="$v.email.$error" class="error">
        Invalid email
      </div>

      <!-- Password -->
      <input
        v-model="password"
        type="password"
        placeholder="Password"
      />

      <div v-if="$v.password.$error" class="error">
        Minimum 6 characters
      </div>

      <!-- Strength -->
    <div class="strength">

      <span>Password Strength:</span>

      <b :class="strengthClass">
        {{ passwordStrength }}
      </b>

      <div class="bar">
        <div
          class="fill"
          :style="{ width: barWidth }"
          :class="strengthClass"
        ></div>
      </div>

    </div>


      <!-- Confirm -->
      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm Password"
      />

      <div v-if="$v.confirmPassword.$error" class="error">
        Passwords do not match
      </div>

      <button type="submit">
        Register
      </button>

    </form>
    <br>

    <nuxt-link to="/login">
      Already have account? Login
    </nuxt-link>

  </div>
</template>

<script>
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'
import zxcvbn from 'zxcvbn'

export default {

  layout: 'auth',

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

    email: {
      required,
      email
    },

    password: {
      required,
      minLength: minLength(6)
    },

    confirmPassword: {
      required,
      sameAsPassword: sameAs('password')
    }

  },

  computed: {

    passwordScore() {
      if (!this.password) return 0
      return zxcvbn(this.password).score
    },

    passwordStrength() {
      const levels = [
        'Very Weak',
        'Weak',
        'Okay',
        'Good',
        'Strong'
      ]

      return levels[this.passwordScore]
    },
    strengthClass() {
      return {
        weak: this.passwordScore < 2,
        medium: this.passwordScore === 2,
        strong: this.passwordScore > 2
      }
    },

    barWidth() {
      return (this.passwordScore + 1) * 20 + '%'
    }
  },

  methods: {

    register() {

      this.$v.$touch()

      if (this.$v.$invalid) return

      if (this.passwordScore < 2) {
        this.$toast.error('Password is too weak')
        return
      }

      let users = JSON.parse(localStorage.getItem('users')) || []

      const exists = users.find(
        u => u.email === this.email
      )

      if (exists) {
        this.$toast.warning('User already exists')
        return
      }

      const newUser = {
        name: this.name,
        email: this.email,
        password: this.password
      }

      users.push(newUser)

      localStorage.setItem(
        'users',
        JSON.stringify(users)
      )

      this.$toast.success('Account created')

      this.$store.dispatch('login', newUser)

      this.$router.push('/dashboard')
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

.strength {
  margin: 10px 0;
  font-size: 14px;
}

.bar {
  width: 100%;
  height: 6px;
  background: #ddd;
  border-radius: 4px;
  margin-top: 5px;
  overflow: hidden;
}

.fill {
  height: 100%;
  transition: all 0.3s;
}

.weak {
  color: red;
  background: red;
}

.medium {
  color: orange;
  background: orange;
}

.strong {
  color: green;
  background: green;
}
</style>
