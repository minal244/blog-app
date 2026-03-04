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

    <div v-if="myPosts.length === 0" class="empty-state">
      <p>No blogs yet.</p>
      <nuxt-link to="/create">Create your first blog →</nuxt-link>
    </div>

    <BlogCard
      v-for="post in myPosts"
      :key="post.id"
      :post="post"
      :editable="true"
      @delete="deletePost(post.id)"
    />

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
      posts: []
    }
  },

  async mounted() {

    this.$store.dispatch('initAuth')

    const res = await this.$axios.get('/posts')
    this.posts = res.data

  },

  computed: {

    myPosts() {
      return this.posts.filter(
        p => p.username === this.$store.state.user?.username
      )
    }

  },

  methods: {

    async deletePost(id) {

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

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #6b7280;
}
</style>
