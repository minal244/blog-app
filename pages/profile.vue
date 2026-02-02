<template>
  <div class="form-box">

    <h1 class="page-title">My Profile</h1>

    <div class="card">

      <p><b>Name:</b> {{ user.name }}</p>
      <p><b>Email:</b> {{ user.email }}</p>
      <p><b>Blogs:</b> {{ myPosts.length }}</p>

    </div>

  </div>
</template>


<script>
export default {
  middleware: 'auth',

  data() {
    return {
      user: {},
      myPosts: []
    }
  },

  mounted() {
    this.user = JSON.parse(localStorage.getItem('user'))

    const posts = JSON.parse(localStorage.getItem('posts')) || []

    this.myPosts = posts.filter(
      p => p.email === this.user.email
    )
  },

  methods: {
    logout() {
      localStorage.removeItem('user')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  padding: 15px;
  width: 300px;
}
</style>

<style scoped>
.card {
  background: white;
  padding: 25px;
  width: 350px;

  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>
