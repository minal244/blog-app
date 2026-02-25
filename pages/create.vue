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

      <!-- Image -->
      <input type="file" @change="handleFile" />

      <button type="submit">
        Publish
      </button>

    </form>

  </div>
</template>

<script>
import FormError from '~/components/FormError.vue'

import { rules } from '~/utils/validations/rules'
import { getError } from '~/utils/validations/getError'
import { getAllErrors } from '~/utils/validations/getAllErrors'

export default {

  middleware: 'auth',

  components: {
    FormError
  },

  data() {
    return {
      title: '',
      content: '',
      image: null
    }
  },

  validations() {
    return {
      title: rules.name,      // reuse simple required rule
      content: rules.name
    }
  },

  methods: {

    getError,

    handleFile(e) {
      this.image = e.target.files[0]
    },

    async submitPost() {

      this.$v.$touch()

      if (this.$v.$invalid) {
        this.$toast.error('Fix form errors')
        return
      }

      try {

        const formData = new FormData()

        formData.append('title', this.title)
        formData.append('content', this.content)

        if (this.image) {
          formData.append('image', this.image)
        }

        await this.$axios.post('/posts', formData)

        this.$toast.success('Blog created')

        this.$router.push('/dashboard')

      } catch {
        this.$toast.error('Error creating post')
      }

    }

  }

}
</script>

<style scoped>
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
