<template>
  <div>

    <h1 class="page-title">All Blogs</h1>

    <div
      v-for="(post, i) in posts"
      :key="i"
      class="card"
    >
      <img
        v-if="post.image"
        :src="post.image"
        class="blog-img"
      />
      <h3>{{ post.title }}</h3>

      <small>
        By {{ post.author }} | {{ post.date }}
      </small>

      <p>{{ post.content }}</p>

    </div>

  </div>
</template>


<script>
export default {
  middleware: 'auth',

  data() {
    return {
      posts: []
    }
  },

  mounted() {
    this.posts = JSON.parse(localStorage.getItem('posts')) || []
  }
}
</script>

<style scoped>
.blog-img {
  width: 100%;
  height: 180px;

  object-fit: cover;
  border-radius: 6px;

  margin-bottom: 10px;
}
</style>
