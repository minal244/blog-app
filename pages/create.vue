<template>
  <div>

    <h1>Create Blog</h1>

    <form @submit.prevent="submitPost">

      <input v-model="title" placeholder="Title" />

      <input type="file" accept="image/*" @change="handleImage" />

      <img v-if="preview" :src="preview" class="preview" />

      <textarea v-model="content" placeholder="Content"></textarea>

      <button>Publish</button>

    </form>

  </div>
</template>

<script>
export default {

  middleware: 'auth',

  data() {
    return {
      title: '',
      content: '',
      image: null,
      preview: null
    }
  },

  methods: {

    handleImage(e) {
      const file = e.target.files[0]
      if (!file) return

      const reader = new FileReader()

      reader.onload = () => {
        this.preview = reader.result
        this.image = reader.result
      }

      reader.readAsDataURL(file)
    },

    submitPost() {

      const user = this.$store.state.user

      let posts = JSON.parse(localStorage.getItem('posts')) || []

      posts.push({
        title: this.title,
        content: this.content,
        image: this.image,
        author: user.name,
        email: user.email,
        date: new Date().toLocaleString()
      })

      localStorage.setItem('posts', JSON.stringify(posts))

      this.$router.push('/dashboard')
    }

  }

}
</script>
