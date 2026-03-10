<template>
  <div class="container">

    <h1>All Blogs</h1>

    <p v-if="loading" class="centered-state">Loading blogs...</p>

    <template v-else>
      <p v-if="posts.length === 0" class="centered-state">No blogs published yet.</p>

      <BlogCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
      />
    </template>

  </div>
</template>

<script>
import BlogCard from '~/components/BlogCard.vue'

export default {

  components: { BlogCard },

  data() {
    return {
      posts: [],
      loading: false
    }
  },

  async mounted() {

    this.loading = true

    try {
      const res = await this.$axios.get('/posts')
      this.posts = res.data
    } catch {
      this.$toast.error('Failed to load posts')
    }

    this.loading = false

  }

}
</script>
