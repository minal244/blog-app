<template>
  <div>
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

        <div v-if="postImages.length" class="image-grid" :class="gridClass">
          <div
            v-for="(src, i) in postImages"
            :key="i"
            class="grid-img"
            @click="openImage(src)"
          >
            <img :src="src" />
          </div>
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

  <!-- Custom confirm dialog -->
  <div v-if="confirmCommentId" class="confirm-backdrop" @click.self="confirmCommentId = null">
    <div class="confirm-box">
      <p>Delete this comment?</p>
      <div class="confirm-actions">
        <button class="confirm-cancel" @click="confirmCommentId = null">Cancel</button>
        <button class="confirm-ok" @click="confirmDelete">Delete</button>
      </div>
    </div>
  </div>

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
      newComment: '',
      confirmCommentId: null
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

    deleteComment(commentId) {
      this.confirmCommentId = commentId
    },

    async confirmDelete() {
      const commentId = this.confirmCommentId
      this.confirmCommentId = null
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

    gridClass() {
      const n = this.postImages.length
      if (n === 1) return 'grid-1'
      if (n === 2) return 'grid-2'
      if (n === 3) return 'grid-3'
      if (n === 4) return 'grid-4plus'
      return 'grid-many'
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

.image-grid {
  display: grid;
  gap: 3px;
  margin-bottom: 20px;
  border-radius: 10px;
  overflow: hidden;
}

.image-grid.grid-1 { grid-template-columns: 1fr; }
.image-grid.grid-1 .grid-img { aspect-ratio: 16/9; }

.image-grid.grid-2 { grid-template-columns: 1fr 1fr; }
.image-grid.grid-2 .grid-img { aspect-ratio: 1; }

.image-grid.grid-3 { grid-template-columns: 1fr 1fr; }
.image-grid.grid-3 .grid-img:first-child { grid-column: 1 / -1; aspect-ratio: 16/9; }
.image-grid.grid-3 .grid-img:not(:first-child) { aspect-ratio: 4/3; }

.image-grid.grid-4plus { grid-template-columns: 2fr 1fr; }
.image-grid.grid-4plus .grid-img:first-child { grid-row: span 3; }
.image-grid.grid-4plus .grid-img:not(:first-child) { aspect-ratio: 4/3; }

.image-grid.grid-many { grid-template-columns: 1fr 1fr; }
.image-grid.grid-many .grid-img { aspect-ratio: 4/3; }

.grid-img {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.grid-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.2s;
}

.grid-img:hover img {
  transform: scale(1.03);
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

.confirm-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.confirm-box {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 300px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.confirm-box p {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 20px;
  color: #111827;
}

.confirm-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.confirm-cancel {
  background: #f3f4f6;
  color: #374151;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 14px;
}

.confirm-cancel:hover {
  background: #e5e7eb;
}

.confirm-ok {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 14px;
}

.confirm-ok:hover {
  background: #dc2626;
}
</style>
