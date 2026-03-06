<template>
  <div class="container">

    <nuxt-link to="/view" class="back-link">← Back to Blogs</nuxt-link>

    <p v-if="loading" class="centered-state">Loading post...</p>

    <template v-else-if="post">

      <div class="card post">

        <h1>{{ post.title }}</h1>

        <p class="meta">
          By {{ post.username }} • {{ formattedDate }}
          <span v-if="post.updated_at" class="edited-tag">• Edited</span>
        </p>

        <div class="images" v-if="postImages.length">
          <img
            v-for="(src, i) in postImages"
            :key="i"
            :src="src"
            class="post-image"
            @click="openImage(src)"
          />
        </div>

        <ImageModal
          :show="showModal"
          :src="selectedImage"
          @close="showModal = false"
        />

        <p class="content">{{ post.content }}</p>

        <div class="post-actions">
          <LikeButton :postId="post.id" :initialCount="post.like_count || 0" />
          <button class="share-btn" @click="share">Share</button>
        </div>

      </div>

      <!-- COMMENTS -->
      <div class="card comments-section">

        <h3>Comments ({{ comments.length }})</h3>

        <div v-if="$store.state.token" class="comment-form">
          <textarea
            v-model="newComment"
            placeholder="Write a comment..."
            rows="3"
          />
          <button @click="addComment" :disabled="!newComment.trim()">
            Post Comment
          </button>
        </div>

        <p v-else class="centered-state" style="padding: 15px 0">
          <nuxt-link to="/login">Log in</nuxt-link> to leave a comment.
        </p>

        <p v-if="comments.length === 0" class="centered-state" style="padding: 20px 0">
          No comments yet. Be the first!
        </p>

        <div
          v-for="comment in comments"
          :key="comment.id"
          class="comment"
        >
          <div class="comment-header">
            <span class="comment-author">{{ comment.username }}</span>
            <span class="comment-date">{{ formatCommentDate(comment.created_at) }}</span>
            <button
              v-if="$store.state.user && $store.state.user.username === comment.username"
              class="delete-comment"
              @click="deleteComment(comment.id)"
            >
              ×
            </button>
          </div>
          <p class="comment-content">{{ comment.content }}</p>
        </div>

      </div>

    </template>

    <p v-else class="centered-state">Post not found.</p>

  </div>
</template>

<script>
import ImageModal from '~/components/ImageModal.vue'
import LikeButton from '~/components/LikeButton.vue'

export default {

  components: { ImageModal, LikeButton },

  data() {
    return {
      post: null,
      loading: false,
      showModal: false,
      selectedImage: null,
      comments: [],
      newComment: ''
    }
  },

  async mounted() {
    this.loading = true
    try {
      const [postRes, commentsRes] = await Promise.all([
        this.$axios.get(`/posts/${this.$route.params.id}`),
        this.$axios.get(`/posts/${this.$route.params.id}/comments`)
      ])
      this.post = postRes.data
      this.comments = commentsRes.data
    } catch {
      this.$toast.error('Failed to load post')
    }
    this.loading = false
  },

  methods: {
    openImage(src) {
      this.selectedImage = src
      this.showModal = true
    },

    share() {
      navigator.clipboard.writeText(window.location.href)
      this.$toast.success('Link copied!')
    },

    async addComment() {
      if (!this.newComment.trim()) return
      try {
        const res = await this.$axios.post(`/posts/${this.post.id}/comments`, {
          content: this.newComment
        })
        this.comments.push(res.data)
        this.newComment = ''
      } catch {
        this.$toast.error('Failed to post comment')
      }
    },

    async deleteComment(commentId) {
      if (!window.confirm('Delete this comment?')) return
      try {
        await this.$axios.delete(`/posts/${this.post.id}/comments/${commentId}`)
        this.comments = this.comments.filter(c => c.id !== commentId)
      } catch {
        this.$toast.error('Failed to delete comment')
      }
    },

    formatCommentDate(dateStr) {
      const utc = dateStr.replace(' ', 'T') + 'Z'
      return new Date(utc).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }
  },

  computed: {
    postImages() {
      if (!this.post || !this.post.image) return []
      try {
        const parsed = JSON.parse(this.post.image)
        return Array.isArray(parsed) ? parsed : [this.post.image]
      } catch {
        return [this.post.image]
      }
    },

    formattedDate() {
      const utc = this.post.created_at.replace(' ', 'T') + 'Z'
      return new Date(utc).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }
  }

}
</script>

<style scoped>
.back-link {
  display: inline-block;
  margin-bottom: 20px;
  font-size: 14px;
}

.post h1 {
  font-size: 28px;
  margin-bottom: 10px;
}

.meta {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 20px;
}

.edited-tag {
  font-style: italic;
}

.images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.post-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
}

.content {
  font-size: 16px;
  line-height: 1.7;
  white-space: pre-wrap;
  margin-bottom: 20px;
}

.post-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.share-btn {
  background: none;
  border: 1px solid #ccc;
  color: #6b7280;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
}

.share-btn:hover {
  border-color: #2f8274;
  color: #2f8274;
  background: none;
}

/* COMMENTS */
.comments-section h3 {
  margin-bottom: 15px;
}

.comment-form {
  margin-bottom: 20px;
}

.comment-form button {
  margin-top: 4px;
}

.comment {
  border-top: 1px solid #f0f0f0;
  padding: 12px 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.comment-author {
  font-weight: 600;
  font-size: 14px;
}

.comment-date {
  font-size: 12px;
  color: #6b7280;
  flex: 1;
}

.delete-comment {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 18px;
  padding: 0 4px;
  cursor: pointer;
  line-height: 1;
}

.delete-comment:hover {
  color: #ef4444;
  background: none;
}

.comment-content {
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
}
</style>
