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
      loading: false
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

    handleFile(e) {
      const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      const maxSize = 5 * 1024 * 1024
      const valid = Array.from(e.target.files).filter(f => {
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

