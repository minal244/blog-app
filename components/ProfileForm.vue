<template>
  <div class="card">

    <h2>Account Information</h2>

    <form @submit.prevent="updateProfile">

      <input
        v-model="name"
        placeholder="Full Name"
      />

      <button>
        Update Name
      </button>

    </form>

    <hr />

    <p><strong>Email:</strong> {{ user.email }}</p>

    <button
      class="danger"
      @click="deleteAccount"
    >
      Delete Account
    </button>

  </div>
</template>

<script>
export default {

  computed: {
    user() {
      return this.$store.state.user
    }
  },

  data() {
    return {
      name: this.$store.state.user.name
    }
  },

  methods: {

    updateProfile() {

      let users = JSON.parse(localStorage.getItem('users')) || []

      const index = users.findIndex(
        u => u.email === this.user.email
      )

      users[index].name = this.name

      localStorage.setItem('users', JSON.stringify(users))

      this.$store.commit('setUser', users[index])

      this.$toast.success('Profile updated')
    },

    deleteAccount() {

      if (!confirm('Are you sure?')) return

      let users = JSON.parse(localStorage.getItem('users')) || []

      users = users.filter(
        u => u.email !== this.user.email
      )

      localStorage.setItem('users', JSON.stringify(users))

      this.$store.dispatch('logout')

      this.$toast.success('Account deleted')

      this.$router.push('/register')
    }

  }

}
</script>

<style scoped>
.card {
  background: white;
  padding: 25px;
  margin-bottom: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.danger {
  background: #e74c3c;
  color: white;
  margin-top: 10px;
}
</style>
