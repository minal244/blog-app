<template>
  <div class="comments-section">

    <div v-if="$store.state.token" class="comment-input-row">
      <input
        v-model="newComment"
        placeholder="Add a comment..."
        @keyup.enter="addComment"
      />
      <button class="post-btn" @click="addComment" :disabled="!newComment.trim()">
        Post
      </button>
    </div>

    <p v-else class="login-prompt">
      <nuxt-link :to="'/login'">Log in</nuxt-link> to comment.
    </p>

    <p v-if="comments.length === 0" class="no-comments">No comments yet.</p>

    <div v-for="comment in visibleComments" :key="comment.id" class="comment">
      <span class="comment-author">{{ comment.username }}</span>
      <span class="comment-content">{{ comment.content }}</span>
      <button
        v-if="$store.state.user && $store.state.user.username === comment.username"
        class="delete-comment"
        @click="deleteComment(comment.id)"
      >×</button>
    </div>

    <nuxt-link v-if="comments.length > 3" :to="`/blog/${postId}`" class="view-all">
      View all {{ comments.length }} comments
    </nuxt-link>

  </div>
</template>

<script>
export default {

  props: {
    postId: { type: Number, required: true }
  },

  data() {
    return {
      comments: [],
      newComment: ''
    }
  },

  async mounted() {
    try {
      const res = await this.$axios.get(`/posts/${this.postId}/comments`)
      this.comments = res.data
    } catch {}
  },

  computed: {
    visibleComments() {
      return this.comments.slice(-3)
    }
  },

  methods: {
    async addComment() {
      if (!this.newComment.trim()) return
      try {
        const res = await this.$axios.post(`/posts/${this.postId}/comments`, {
          content: this.newComment
        })
        this.comments.push(res.data)
        this.newComment = ''
      } catch {
        this.$toast.error('Failed to post comment')
      }
    },

    async deleteComment(commentId) {
      try {
        await this.$axios.delete(`/posts/${this.postId}/comments/${commentId}`)
        this.comments = this.comments.filter(c => c.id !== commentId)
      } catch {
        this.$toast.error('Failed to delete comment')
      }
    }
  }

}
</script>

<style scoped>
.comments-section {
  margin-top: 12px;
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
}

.comment-input-row {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.comment-input-row input {
  flex: 1;
  margin-bottom: 0;
  padding: 7px 10px;
  font-size: 13px;
}

.post-btn {
  padding: 7px 14px;
  font-size: 13px;
  white-space: nowrap;
}

.login-prompt {
  font-size: 13px;
  color: var(--color-muted);
  margin-bottom: 8px;
}

.no-comments {
  font-size: 13px;
  color: #9ca3af;
  margin-bottom: 4px;
}

.comment {
  font-size: 14px;
  margin-bottom: 6px;
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.comment-author {
  font-weight: 600;
  flex-shrink: 0;
}

.comment-content {
  color: #374151;
  flex: 1;
}

.delete-comment {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 16px;
  padding: 0 2px;
  cursor: pointer;
  line-height: 1;
  flex-shrink: 0;
}

.delete-comment:hover {
  color: var(--color-danger);
  background: none;
}

.view-all {
  font-size: 13px;
  color: var(--color-muted);
  font-weight: 400;
  display: block;
  margin-top: 4px;
}
</style>
