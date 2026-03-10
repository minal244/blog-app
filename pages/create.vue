<template>
  <div>

    <h1>Create Blog</h1>

    <form @submit.prevent="submitPost">

      <!-- Title -->
      <input
        v-model="title"
        placeholder="Title"
        :class="{ error: $v.title.$error }"
        @blur="$v.title.$touch()"
      />
      <FormError :message="getError($v.title)" />

      <!-- Content -->
      <textarea
        v-model="content"
        placeholder="Content"
        :class="{ error: $v.content.$error }"
        @blur="$v.content.$touch()"
      ></textarea>
      <WordCount :content="content" :max="5000" />
      <FormError :message="getError($v.content)" />

      <!-- Images -->
      <div
        class="drop-zone"
        :class="{ dragging: isDragging }"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
      >
        <p>Drag & drop images here or <label class="file-label">browse<input type="file" multiple @change="handleFile" /></label></p>
      </div>

      <div v-if="images.length" class="image-previews">
        <div v-for="(img, i) in images" :key="i" class="preview-item">
          <img :src="previewUrl(img)" class="preview-thumb" />
          <button type="button" class="remove-btn" @click="removeImage(i)">×</button>
        </div>
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Publishing...' : 'Publish' }}
      </button>

    </form>

  </div>
</template>

<script>
import FormError from '~/components/FormError.vue'
import WordCount from '~/components/WordCount.vue'

import { rules } from '~/utils/validations/rules'
import { getError } from '~/utils/validations/getError'
import { previewUrl } from '~/utils/previewUrl'

export default {

  middleware: 'auth',

  components: {
    FormError,
    WordCount
  },

  data() {
    return {
      title: '',
      content: '',
      images: [],
      loading: false,
      isDragging: false
    }
  },

  validations() {
    return {
      title: rules.title,
      content: rules.content
    }
  },

  methods: {

    getError,
    previewUrl,

    validateAndAddImages(files) {
      const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      const maxSize = 5 * 1024 * 1024
      const valid = Array.from(files).filter(f => {
        if (!allowed.includes(f.type)) {
          this.$toast.error(`${f.name} is not a supported image type`)
          return false
        }
        if (f.size > maxSize) {
          this.$toast.error(`${f.name} exceeds the 5MB limit`)
          return false
        }
        return true
      })
      this.images = [...this.images, ...valid]
    },

    handleFile(e) {
      this.validateAndAddImages(e.target.files)
    },

    handleDrop(e) {
      this.isDragging = false
      this.validateAndAddImages(e.dataTransfer.files)
    },

    removeImage(i) {
      this.images.splice(i, 1)
    },

    async submitPost() {

      this.$v.$touch()

      if (this.$v.$invalid) {
        this.$toast.error('Fix form errors')
        return
      }

      this.loading = true

      try {

        const formData = new FormData()

        formData.append('title', this.title)
        formData.append('content', this.content)

        this.images.forEach(img => formData.append('images', img))

        await this.$axios.post('/posts', formData)

        this.$toast.success('Blog created')

        this.$router.push('/dashboard')

      } catch {
        this.$toast.error('Error creating post')
      } finally {
        this.loading = false
      }

    }

  }

}
</script>

<style scoped>
.drop-zone {
  border: 2px dashed #aaa;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.drop-zone.dragging {
  border-color: #4f46e5;
  background: #eef2ff;
}
.file-label {
  color: #4f46e5;
  cursor: pointer;
  text-decoration: underline;
}
.file-label input[type='file'] {
  display: none;
}
</style>
