<template>
  <div>

    <h1>Edit Blog</h1>

    <form @submit.prevent="updatePost">

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
      existingImages: [],
      newImages: [],
      loading: false
    }
  },

  validations() {
    return {
      title: rules.required,
      content: rules.required
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

    handleFile(e) {
      this.newImages = [...this.newImages, ...Array.from(e.target.files)]
    },

    removeExisting(i) {
      this.existingImages.splice(i, 1)
    },

    removeNew(i) {
      this.newImages.splice(i, 1)
    },

    previewUrl(file) {
      return URL.createObjectURL(file)
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
</style>