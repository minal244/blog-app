<template>
  <div class="container">

    <div class="card">

      <h1>Create New Blog</h1>

      <form @submit.prevent="submitPost">

        <label>Title</label>
        <input
          v-model="title"
          placeholder="Enter blog title"
          required
        />

        <label>Content</label>
        <textarea
          v-model="content"
          placeholder="Write your blog content here..."
          required
        ></textarea>

        <div class="actions">
          <nuxt-link to="/dashboard" class="secondary-btn">
            Cancel
          </nuxt-link>

          <button type="submit">
            Publish
          </button>
        </div>

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
      content: ''
    }
  },

  methods: {

    async submitPost() {

      await this.$axios.post('/posts', {
        title: this.title,
        content: this.content
      })

      this.$toast.success('Blog published successfully')

      this.$router.push('/dashboard')

    }

  }

}
</script>

<style scoped>
label {
  display: block;
  font-weight: 500;
  margin-bottom: 6px;
  margin-top: 15px;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.secondary-btn {
  background: #e5e7eb;
  padding: 10px 16px;
  border-radius: 6px;
  color: #374151;
  font-weight: 500;
}

.secondary-btn:hover {
  background: #d1d5db;
}
</style>
