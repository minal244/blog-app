<template>
  <div>

    <h1>All Blogs</h1>

    <BlogCard
      v-for="post in posts"
      :key="post.id"
      :post="post"
    />

  </div>
</template>

<script>
import BlogCard from '~/components/BlogCard.vue'

export default {

  components: { BlogCard },

  data() {
    return {
      posts: []
    }
  },

  async mounted() {

    try {

      const res = await this.$axios.get('/posts')
      this.posts = res.data

    } catch {
      this.$toast.error('Failed to load posts')
    }

  }

}
</script>
