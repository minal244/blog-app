<template>
  <div class="card">

    <h2>{{ post.title }}</h2>

    <p class="meta">
      By {{ post.username }} • {{ formattedDate }}
    </p>

    <img
      v-if="post.image" 
      :src="post.image"
      class="blog-image" 
      @click="openImage(post.image)"
    />

    <ImageModal
      :show="showModal"
      :src="selectedImage"
      @close="showModal = false"
    />

    <p class="content">
      {{ post.content }}
    </p>

    <div v-if="editable" class="actions">
      <nuxt-link :to="`/edit/${post.id}`">
        Edit
      </nuxt-link>

      <button @click="$emit('delete')" class="delete">
        Delete
      </button>
    </div>

  </div>
</template>

<script>
import ImageModal from '~/components/ImageModal.vue'

export default {
  components: { ImageModal },
  data() {
    return {
      showModal: false,
      selectedImage: 'null'
    }
  },

  methods: {
    openImage(image) {
      this.selectedImage = image
      this.showModal = true
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
.meta {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 10px;
}

.content {
  margin-bottom: 15px;
}

.actions {
  display: flex;
  gap: 15px;
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
