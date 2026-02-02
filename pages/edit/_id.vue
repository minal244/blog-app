<template>
  <div class="form-box">

    <h1 class="page-title">Edit Blog</h1>

    <div class="card">

      <form @submit.prevent="updatePost">

        <input v-model="title" required />

        <textarea v-model="content"></textarea>

        <button class="btn btn-dark">
          Update Blog
        </button>

      </form>

    </div>

  </div>
</template>


<script>
export default {
  middleware: 'auth',

  data() {
    return {
      title: '',
      content: '',
      postIndex: null
    }
  },

  mounted() {
    const id = this.$route.params.id

    const posts = JSON.parse(localStorage.getItem('posts')) || []
    const user = JSON.parse(localStorage.getItem('user'))

    const myPosts = posts.filter(p => p.email === user.email)

    const post = myPosts[id]

    if (!post) {
      return this.$router.push('/dashboard')
    }

    this.title = post.title
    this.content = post.content
    this.postIndex = id
  },

  methods: {
    updatePost() {
      let posts = JSON.parse(localStorage.getItem('posts')) || []
      const user = JSON.parse(localStorage.getItem('user'))

      let myPosts = posts.filter(p => p.email === user.email)

      const oldPost = myPosts[this.postIndex]

      // update main array
      const index = posts.findIndex(p => p === oldPost)

      posts[index].title = this.title
      posts[index].content = this.content
      posts[index].date = new Date().toLocaleString()

      localStorage.setItem('posts', JSON.stringify(posts))

      this.$router.push('/dashboard')
    }
  }
}
</script>
