<template>
  <div>

    <h1>Edit Blog</h1>

    <form @submit.prevent="updatePost">

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

      <!-- Existing Images -->
      <div v-if="existingImages.length" class="image-previews">
        <div v-for="(src, i) in existingImages" :key="'existing-' + i" class="preview-item">
          <img :src="src" class="preview-thumb" />
          <button type="button" class="remove-btn" @click="removeExisting(i)">×</button>
        </div>
      </div>

      <!-- Add New Images -->
      <input type="file" multiple @change="handleFile" />

      <div v-if="newImages.length" class="image-previews">
        <div v-for="(img, i) in newImages" :key="'new-' + i" class="preview-item">
          <img :src="previewUrl(img)" class="preview-thumb" />
          <button type="button" class="remove-btn" @click="removeNew(i)">×</button>
        </div>
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Saving...' : 'Update' }}
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
      existingImages: [],
      newImages: [],
      loading: false
    }
  },

  validations() {
    return {
      title: rules.title,
      content: rules.content
    }
  },

  async mounted() {

    try {

      const id = this.$route.params.id

      const res = await this.$axios.get(`/posts/${id}`)

      const post = res.data

      if (!post) {
        this.$router.push('/dashboard')
        return
      }

      if (post.email !== this.$store.state.user.email) {
        this.$router.push('/dashboard')
        return
      }

      this.title = post.title
      this.content = post.content

      if (post.image) {
        try {
          const parsed = JSON.parse(post.image)
          this.existingImages = Array.isArray(parsed) ? parsed : [post.image]
        } catch {
          this.existingImages = [post.image]
        }
      }

    } catch {
      this.$toast.error('Error loading post')
      this.$router.push('/dashboard')
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
      this.newImages = [...this.newImages, ...valid]
    },

    removeExisting(i) {
      this.existingImages.splice(i, 1)
    },

    removeNew(i) {
      this.newImages.splice(i, 1)
    },

    async updatePost() {

      this.$v.$touch()

      if (this.$v.$invalid) {
        this.$toast.error('Fix form errors')
        return
      }

      this.loading = true

      try {

        const id = this.$route.params.id

        const formData = new FormData()
        formData.append('title', this.title)
        formData.append('content', this.content)
        formData.append('existingImages', JSON.stringify(this.existingImages))
        this.newImages.forEach(img => formData.append('newImages', img))

        await this.$axios.put(`/posts/${id}`, formData)

        this.$toast.success('Updated')

        this.$router.push('/dashboard')

      } catch {
        this.$toast.error('Error updating post')
      } finally {
        this.loading = false
      }

    }

  }

}
</script>

