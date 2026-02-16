<template>
  <div class="card">

    <h2>Change Password</h2>

    <form @submit.prevent="changePassword">

      <PasswordInput
        v-model="oldPassword"
        placeholder="Current Password"
      />

      <PasswordInput
        v-model="newPassword"
        placeholder="New Password"
      />

      <PasswordInput
        v-model="confirmPassword"
        placeholder="Confirm Password"
      />

      <button>
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
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  },

  computed: {
    user() {
      return this.$store.state.user
    }
  },

  methods: {

    changePassword() {

      if (this.oldPassword !== this.user.password) {
        this.$toast.error('Wrong current password')
        return
      }

      if (this.newPassword !== this.confirmPassword) {
        this.$toast.error('Passwords do not match')
        return
      }

      let users = JSON.parse(localStorage.getItem('users')) || []

      const index = users.findIndex(
        u => u.email === this.user.email
      )

      users[index].password = this.newPassword

      localStorage.setItem('users', JSON.stringify(users))

      this.$store.commit('setUser', users[index])

      this.$toast.success('Password updated')

      this.oldPassword = ''
      this.newPassword = ''
      this.confirmPassword = ''
    }

  }

}
</script>

<style scoped>
.card {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>
