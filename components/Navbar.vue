<template>
  <nav class="navbar">

    <div class="nav-container">

      <nuxt-link to="/" class="logo">
        WE Blog
      </nuxt-link>

      <div class="links">

        <template v-if="isAuthenticated">
          <nuxt-link to="/dashboard">Dashboard</nuxt-link>
          <nuxt-link to="/view">Blogs</nuxt-link>
          <nuxt-link to="/profile">Profile</nuxt-link>
          <button class="logout-btn" @click="logout">
            Logout
          </button>
        </template>

        <template v-else>
          <nuxt-link to="/view">Blogs</nuxt-link>
          <nuxt-link to="/login">Login</nuxt-link>
          <nuxt-link to="/register">Register</nuxt-link>
        </template>

      </div>

    </div>

  </nav>
</template>

<script>
export default {

  computed: {
    isAuthenticated() {
      return !!this.$store.state.token
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
.navbar {
  background: white;
  padding: 15px 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.nav-container {
  max-width: 1100px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-weight: 700;
  font-size: 18px;
}

.links {
  display: flex;
  gap: 20px;
  align-items: center;
}

.logout-btn {
  background: #ef4444;
  padding: 8px 14px;
  border-radius: 6px;
}

.logout-btn:hover {
  background: #dc2626;
}
</style>
