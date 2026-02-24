<template>
  <div class="profile-card">

    <h2>Change Password</h2>

    <form @submit.prevent="change">

      <PasswordInput v-model="password" />

      <button type="submit">
        Update Password
      </button>

    </form>

  </div>
</template>

<script>
import PasswordInput from './PasswordInput.vue'

export default {

  components: { PasswordInput },

  data() {
    return {
      password: ''
    }
  },

  methods: {

    async change() {

      await this.$axios.put('/auth/change-password', {
        password: this.password
      })

      this.$toast.success('Password updated')

      this.password = ''
    }

  }

}
</script>
