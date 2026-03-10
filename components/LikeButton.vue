<template>
  <button class="like-btn" :class="{ liked }" @click="toggle">
    {{ liked ? '♥' : '♡' }} {{ count }}
  </button>
</template>

<script>
export default {

  props: {
    postId: { type: Number, required: true },
    initialCount: { type: Number, default: 0 }
  },

  data() {
    return {
      liked: false,
      count: this.initialCount
    }
  },

  async mounted() {
    if (this.$store.state.token) {
      try {
        const res = await this.$axios.get(`/posts/${this.postId}/like-status`)
        this.liked = res.data.liked
      } catch {}
    }
  },

  methods: {
    async toggle() {
      if (!this.$store.state.token) {
        this.$router.push('/login')
        return
      }
      try {
        const res = await this.$axios.post(`/posts/${this.postId}/like`)
        this.liked = res.data.liked
        this.count = res.data.count
      } catch {
        this.$toast.error('Failed to update like')
      }
    }
  }

}
</script>

<style scoped>
.like-btn {
  background: none;
  border: 1px solid #ccc;
  color: #6b7280;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
}

.like-btn:hover {
  border-color: #e11d48;
  color: #e11d48;
  background: none;
}

.like-btn.liked {
  border-color: #e11d48;
  color: #e11d48;
  background: none;
}
</style>
