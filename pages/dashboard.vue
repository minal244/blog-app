<template>
  <div>

    <h1 class="page-title">Dashboard</h1>

    <!-- User Info -->
    <div class="card">

      <p>Welcome, <b>{{ user.name }}</b></p>

      <div class="dash-actions">

        <nuxt-link to="/create" class="btn">
          ➕ Create Blog
        </nuxt-link>

        <nuxt-link to="/view" class="btn">
          🌍 All Blogs
        </nuxt-link>

        <nuxt-link to="/profile" class="btn">
          👤 Profile
        </nuxt-link>

      </div>

    </div>

    <!-- Blogs -->
    <h2>My Blogs</h2>

    <div
      v-for="(post, i) in myPosts"
      :key="i"
      class="card"
    >
      <img
        v-if="post.image"
        :src="post.image"
        class="blog-img"
      />

      <h3>{{ post.title }}</h3>

      <p>{{ post.content }}</p>

      <div class="blog-actions">

        <button
          class="btn"
          @click="editPost(i)"
        >
          Edit
        </button>

        <button
          class="btn btn-danger"
          @click="deletePost(i)"
        >
          Delete
        </button>

      </div>

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

    // filter user's posts
    this.myPosts = posts.filter(
      p => p.email === this.user.email
    )
  },

  methods: {
    logout() {
      localStorage.removeItem('user')
      this.$router.push('/login')
    },
    editPost(index) {
      this.$router.push('/edit/' + index)
    },

    deletePost(index) {
      if (!confirm('Are you sure you want to delete this blog?')) return

      this.$toast.success('Blog deleted')

      let posts = JSON.parse(localStorage.getItem('posts')) || []

      const user = this.user

      // get only user posts
      const myAll = posts.filter(p => p.email === user.email)

      const target = myAll[index]

      // remove from main array
      const updated = posts.filter(p => p !== target)

      localStorage.setItem('posts', JSON.stringify(updated))

      this.myPosts.splice(index, 1)
    }

  }
}
</script>

<style scoped>
.dash-actions {
  margin-top: 15px;
}

.dash-actions .btn {
  margin-right: 10px;
}

.blog-actions {
  margin-top: 10px;
}

.blog-actions .btn {
  margin-right: 8px;
}

.blog-img {
  width: 100%;
  height: 180px;

  object-fit: cover;
  border-radius: 6px;

  margin-bottom: 10px;
}
</style>
