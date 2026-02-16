<template>
  <div class="profile-card">

    <h2>Update Profile</h2>

    <form @submit.prevent="update">

      <input v-model="name" />

      <button type="submit">
        Update Name
      </button>

    </form>

  </div>
</template>

<script>
export default {

  data() {
    return {
      name: this.$store.state.user.name
    }
  },

  methods: {

    async update() {

      await this.$axios.put('/auth/update', {
        name: this.name
      })

      this.$store.commit('setAuth', {
        token: this.$store.state.token,
        user: {
          ...this.$store.state.user,
          name: this.name
        }
      })

      this.$toast.success('Profile updated')
    }

  }

}
</script>
