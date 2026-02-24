<template>
  <div>

    <h1>Edit Blog</h1>

    <form @submit.prevent="updatePost">

      <input
        v-model="title"
        placeholder="Title"
        required
      />

      <textarea
        v-model="content"
        placeholder="Content"
        required
      ></textarea>

      <button type="submit">
        Update
      </button>

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

  async mounted() {

    const id = this.$route.params.id

    const res = await this.$axios.get('/posts')

    const post = res.data.find(p => p.id == id)

    if (!post) {
      this.$router.push('/dashboard')
      return
    }

    if (post.email !== this.$store.state.user.email) {
      this.$router.push('/dashboard')
      return
    }

    this.title = post.title
    this.content = post.content

  },

  methods: {

    async updatePost() {

      const id = this.$route.params.id

      await this.$axios.put(`/posts/${id}`, {
        title: this.title,
        content: this.content
      })

      this.$toast.success('Updated')

      this.$router.push('/dashboard')

    }

  }

}
</script>
