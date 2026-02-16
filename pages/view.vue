<template>
  <div>

    <h1>All Blogs</h1>

    <BlogCard
      v-for="(post, i) in posts"
      :key="i"
      :post="post"
    />

  </div>
</template>

<script>
import BlogCard from '~/components/BlogCard.vue'

export default {

  middleware: 'auth',

  components: { BlogCard },

  computed: {
    posts() {
      return JSON.parse(localStorage.getItem('posts')) || []
    }
  }

}
</script>
