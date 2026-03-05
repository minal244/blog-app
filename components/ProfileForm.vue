<template>
  <div class="profile-card">

    <h2>Update Profile</h2>

    <form @submit.prevent="update">

      <input
        v-model="username"
        :class="{ error: $v.username.$error }"
        @blur="$v.username.$touch()"
        @input="checkUsername"
      />

      <FormError :message="getError($v.username)" />
      <p v-if="usernameStatus === 'checking'" class="username-status checking">Checking...</p>
      <p v-else-if="usernameStatus === 'available'" class="username-status available">✓ Username available</p>
      <p v-else-if="usernameStatus === 'taken'" class="username-status taken">✗ Username already taken</p>

      <button type="submit" :disabled="usernameStatus === 'taken'">
        Update Username
      </button>

    </form>

  </div>
</template>

<script>
import FormError from '~/components/FormError.vue'
import { rules } from '~/utils/validations/rules'
import { getError } from '~/utils/validations/getError'

export default {

  components: {
    FormError
  },

  data() {
    return {
      username: this.$store.state.user?.username || '',
      usernameStatus: null,
      usernameTimer: null
    }
  },

  validations() {
    return {
      username: rules.required
    }
  },

  methods: {

    getError,

    checkUsername() {
      clearTimeout(this.usernameTimer)

      const current = this.$store.state.user?.username

      if (!this.username || this.username === current) {
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

    async update() {

      this.$v.$touch()

      if (this.$v.$invalid) {
        this.$toast.error('Fix form errors')
        return
      }

      try {

        await this.$axios.put('/auth/update', {
          username: this.username
        })

        const updatedUser = { ...this.$store.state.user, username: this.username }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        this.$store.commit('setAuth', {
          token: this.$store.state.token,
          user: updatedUser
        })

        this.$toast.success('Profile updated')

      } catch (error) {
        this.$toast.error('Username is already taken')
      }

    }

  }

}
</script>

