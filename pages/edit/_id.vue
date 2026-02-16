<template>
  <div>

    <h1>Edit Blog</h1>

    <form @submit.prevent="updatePost">

      <input v-model="title" />
      <textarea v-model="content"></textarea>

      <button>Update</button>

    </form>

  </div>
</template>

<script>
export default {

  middleware: 'auth',

  data() {
    return {
      title: '',
      content: ''
    }
  },

  mounted() {

    const id = this.$route.params.id

    const posts = JSON.parse(localStorage.getItem('posts')) || []

    const post = posts[id]

    if (!post) {
      this.$toast.error('Invalid blog ID')
      return this.$router.replace('/dashboard')
    }

    this.title = post.title
    this.content = post.content
  },

  methods: {

    updatePost() {

      const id = this.$route.params.id

      let posts = JSON.parse(localStorage.getItem('posts')) || []

      posts[id].title = this.title
      posts[id].content = this.content

      localStorage.setItem('posts', JSON.stringify(posts))

      this.$router.push('/dashboard')
    }

  }

}
</script>