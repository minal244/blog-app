<template>
  <div class="card">

    <nuxt-link :to="`/blog/${post.id}`" class="post-title">
      <h2>{{ post.title }}</h2>
    </nuxt-link>

    <p class="meta">
      By {{ post.username }} • {{ formattedDate }}
      <span v-if="post.updated_at" class="edited-tag">• Edited</span>
    </p>

    <div v-if="postImages.length" class="image-grid" :class="gridClass">
      <div
        v-for="(src, i) in visibleImages"
        :key="i"
        class="grid-img"
        @click="openImage(src)"
      >
        <img :src="src" />
        <div v-if="extraCount && i === 3" class="more-overlay">+{{ extraCount }}</div>
      </div>
    </div>

    <ImageModal
      :show="showModal"
      :src="selectedImage"
      @close="showModal = false"
    />

    <p class="content">
      {{ truncatedContent }}
      <nuxt-link v-if="isLong && !showFull" :to="`/blog/${post.id}`" class="read-more">Read more</nuxt-link>
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
      selectedImage: null,
      showFull: false
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
    isLong() {
      return this.post.content.length > 250
    },
    truncatedContent() {
      if (!this.isLong || this.showFull) return this.post.content
      return this.post.content.slice(0, 250).trimEnd() + '...'
    },

    postImages() {
      if (!this.post.image) return []
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
      return 'grid-4plus'
    },

    visibleImages() {
      return this.postImages.slice(0, 4)
    },

    extraCount() {
      return this.postImages.length > 4 ? this.postImages.length - 4 : 0
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
  color: var(--color-muted);
  margin-bottom: 10px;
}

.edited-tag {
  font-style: italic;
}

.content {
  margin-bottom: 15px;
}

.read-more {
  font-size: 13px;
  color: var(--color-primary);
  margin-left: 4px;
  white-space: nowrap;
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
  color: var(--color-muted);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
}

.share-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: none;
}

.actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.delete {
  background: var(--color-danger);
}

.delete:hover {
  background: var(--color-danger-dark);
}

.image-grid {
  display: grid;
  gap: 3px;
  margin: 10px 0;
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

.more-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 26px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
