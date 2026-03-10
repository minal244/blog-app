<template>
  <div class="card">

    <nuxt-link :to="`/blog/${post.id}`" class="post-title">
      <h2>{{ post.title }}</h2>
    </nuxt-link>

    <p class="meta">
      By {{ post.username }} • {{ formattedDate }}
      <span v-if="post.updated_at" class="edited-tag">• Edited</span>
    </p>

    <img
      v-for="(src, i) in postImages"
      :key="i"
      :src="src"
      class="blog-image"
      @click="openImage(src)"
    />

    <ImageModal
      :show="showModal"
      :src="selectedImage"
      @close="showModal = false"
    />

    <p class="content">
      {{ post.content }}
    </p>

    <CommentsSection :postId="post.id" />

    <div class="card-footer">
      <div class="footer-left">
        <LikeButton :postId="post.id" :initialCount="post.like_count || 0" />
        <button class="share-btn" @click="share">Share</button>
      </div>

      <div v-if="editable" class="actions">
        <nuxt-link :to="`/edit/${post.id}`">Edit</nuxt-link>
        <button @click="$emit('delete')" class="delete">Delete</button>
      </div>
    </div>

  </div>
</template>

<script>
import ImageModal from '~/components/ImageModal.vue'
import LikeButton from '~/components/LikeButton.vue'
import CommentsSection from '~/components/CommentsSection.vue'

export default {
  components: { ImageModal, LikeButton, CommentsSection },
  data() {
    return {
      showModal: false,
      selectedImage: null
    }
  },

  methods: {
    openImage(image) {
      this.selectedImage = image
      this.showModal = true
    },
    share() {
      navigator.clipboard.writeText(window.location.origin + `/blog/${this.post.id}`)
      this.$toast.success('Link copied!')
    }
  },

  props: {
    post: {
      type: Object,
      required: true
    },
    editable: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    postImages() {
      if (!this.post.image) return []
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
.post-title {
  color: inherit;
  font-weight: inherit;
}

.post-title:hover h2 {
  text-decoration: underline;
}

.meta {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 10px;
}

.edited-tag {
  font-style: italic;
}

.content {
  margin-bottom: 15px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.footer-left {
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

.actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.delete {
  background: #ef4444;
}

.delete:hover {
  background: #dc2626;
}

.blog-image {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin: 10px 0;
}
</style>
