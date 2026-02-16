<template>
  <div>

    <h1>Dashboard</h1>

    <div class="actions">
      <nuxt-link to="/create">Create Blog</nuxt-link>
      <nuxt-link to="/view">All Blogs</nuxt-link>
    </div>

    <BlogCard
      v-for="(post, i) in myPosts"
      :key="i"
      :post="post"
      :editable="true"
      @edit="editPost(i)"
      @delete="deletePost(i)"
    />

  </div>
</template>

<script>
import BlogCard from '~/components/BlogCard.vue'

export default {

  middleware: 'auth',

  components: { BlogCard },

  computed: {
    user() {
      return this.$store.state.user
    },

    myPosts() {
      const posts = JSON.parse(localStorage.getItem('posts')) || []
      return posts.filter(p => p.email === this.user.email)
    }
  },

  methods: {

    editPost(index) {
      this.$router.push('/edit/' + index)
    },

    deletePost(index) {

      if (!confirm('Delete this blog?')) return

      let posts = JSON.parse(localStorage.getItem('posts')) || []

      posts.splice(index, 1)

      localStorage.setItem('posts', JSON.stringify(posts))

      this.$toast.success('Deleted')
    }

  }

}
</script>