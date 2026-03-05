<template>
  <div>

    <h1>Create Blog</h1>

    <form @submit.prevent="submitPost">

      <!-- Title -->
      <input
        v-model="title"
        placeholder="Title"
        @blur="$v.title.$touch()"
      />
      <FormError :message="getError($v.title)" />

      <!-- Content -->
      <textarea
        v-model="content"
        placeholder="Content"
        @blur="$v.content.$touch()"
      ></textarea>
      <FormError :message="getError($v.content)" />

      <!-- Images -->
      <input type="file" multiple @change="handleFile" />

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

import { rules } from '~/utils/validations/rules'
import { getError } from '~/utils/validations/getError'

export default {

  middleware: 'auth',

  components: {
    FormError
  },

  data() {
    return {
      title: '',
      content: '',
      images: [],
      loading: false
    }
  },

  validations() {
    return {
      title: rules.required,
      content: rules.required
    }
  },

  methods: {

    getError,

    handleFile(e) {
      this.images = [...this.images, ...Array.from(e.target.files)]
    },

    removeImage(i) {
      this.images.splice(i, 1)
    },

    previewUrl(file) {
      return URL.createObjectURL(file)
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
.image-previews {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.preview-item {
  position: relative;
}

.preview-thumb {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 6px;
  display: block;
}

.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 22px;
  height: 22px;
  padding: 0;
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
}

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
