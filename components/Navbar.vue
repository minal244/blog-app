<template>
  <nav class="nav">

    <h2>NuxtBlog</h2>

    <div class="links">

      <nuxt-link to="/">Home</nuxt-link>

      <template v-if="user">

        <nuxt-link to="/dashboard">Dashboard</nuxt-link>
        <nuxt-link to="/view">Blogs</nuxt-link>
        <nuxt-link to="/profile">Profile</nuxt-link>

        <button @click="logout">
          Logout
        </button>

      </template>

      <template v-else>

        <nuxt-link to="/login">Login</nuxt-link>
        <nuxt-link to="/register">Register</nuxt-link>

      </template>

    </div>

  </nav>
</template>

<script>
export default {

  computed: {
    user() {
      return this.$store.state.user
    }
  },

  methods: {
    logout() {
      this.$store.dispatch('logout')
      this.$router.push('/login')
    }
  }

}
</script>

<style scoped>
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1f2937;
  color: white;
  padding: 15px 30px;
}

.links a,
.links button {
  margin-left: 15px;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
}
</style>
