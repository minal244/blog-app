<template>
  <div class="container">

    <div class="dashboard-header">

      <div>
        <h1>My Dashboard</h1>
        <p class="subtitle">
          Manage and edit your blogs
        </p>
      </div>

      <nuxt-link to="/create" class="create-btn">
        + Create Blog
      </nuxt-link>

    </div>

    <QuoteWidget />

    <p v-if="loading" class="centered-state">Loading your blogs...</p>

    <template v-else>
      <div v-if="posts.length === 0" class="centered-state">
        <p>No blogs yet.</p>
        <nuxt-link to="/create">Create your first blog →</nuxt-link>
      </div>

      <BlogCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
        :editable="true"
        @delete="deletePost(post.id)"
      />
    </template>

  </div>
</template>

<script>
import BlogCard from '~/components/BlogCard.vue'
import QuoteWidget from '~/components/QuoteWidget.vue'

export default {

  middleware: 'auth',
  components: { BlogCard, QuoteWidget },

  data() {
    return {
      posts: [],
      loading: false
    }
  },

  async mounted() {

    this.loading = true
    const res = await this.$axios.get('/posts/mine')
    this.posts = res.data
    this.loading = false

  },

  methods: {

    async deletePost(id) {

      if (!window.confirm('Delete this blog? This cannot be undone.')) return

      await this.$axios.delete(`/posts/${id}`)

      this.posts = this.posts.filter(p => p.id !== id)

      this.$toast.success('Blog deleted')

    }

  }

}
</script>

<style scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.subtitle {
  font-size: 14px;
  color: #6b7280;
}

.create-btn {
  background: #4f46e5;
  padding: 10px 18px;
  border-radius: 6px;
  color: white;
  font-weight: 500;
}

.create-btn:hover {
  background: #4338ca;
}

</style>
