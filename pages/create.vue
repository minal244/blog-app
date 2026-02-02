<template>
  <div class="form-box">

    <h1 class="page-title">Create Blog</h1>

    <div class="card">

      <form @submit.prevent="submitPost">

        <!-- Title -->
        <input
          v-model="title"
          placeholder="Enter title"
          required
        />

        <!-- Image Upload -->
        <input
          type="file"
          accept="image/*"
          @change="handleImage"
        />

        <!-- Preview -->
        <div v-if="preview" class="preview">
          <img :src="preview" />
        </div>

        <!-- Content -->
        <textarea
          v-model="content"
          placeholder="Write your blog..."
        ></textarea>

        <button class="btn btn-dark">
          Publish
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
      image: null,
      preview: null
    }
  },

  methods: {

    handleImage(e) {

      const file = e.target.files[0]

      if (!file) return

      if (!file.type.startsWith('image/')) {
        this.$toast.error('Only images allowed')
        return
      }

      const reader = new FileReader()

      reader.onload = () => {
        this.preview = reader.result
        this.image = reader.result
      }

      reader.readAsDataURL(file)
    },

    submitPost() {

      if (!this.title || !this.content) {
        this.$toast.error('Fill all fields')
        return
      }

      let posts = JSON.parse(
        localStorage.getItem('posts')
      ) || []

      const user = JSON.parse(
        localStorage.getItem('user')
      )

      posts.push({
        title: this.title,
        content: this.content,
        image: this.image,
        author: user.name,
        email: user.email,
        date: new Date().toLocaleString()
      })

      localStorage.setItem(
        'posts',
        JSON.stringify(posts)
      )

      this.$toast.success('Blog published')

      this.$router.push('/dashboard')
    }

  }

}
</script>

<style scoped>
.preview {
  margin: 10px 0;
}

.preview img {
  max-width: 100%;
  max-height: 200px;

  border-radius: 6px;
  object-fit: cover;
}
</style>
