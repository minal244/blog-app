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

      <button type="submit">
        Update
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
      content: ''
    }
  },

  validations() {
    return {
      title: rules.name,
      content: rules.name
    }
  },

  async mounted() {

    try {

      const id = this.$route.params.id

      const res = await this.$axios.get('/posts')

      const post = res.data.find(p => p.id == id)

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

    } catch {
      this.$toast.error('Error loading post')
      this.$router.push('/dashboard')
    }

  },

  methods: {

    getError,

    async updatePost() {

      this.$v.$touch()

      if (this.$v.$invalid) {
        this.$toast.error('Fix form errors')
        return
      }

      try {

        const id = this.$route.params.id

        await this.$axios.put(`/posts/${id}`, {
          title: this.title,
          content: this.content
        })

        this.$toast.success('Updated')

        this.$router.push('/dashboard')

      } catch {
        this.$toast.error('Error updating post')
      }

    }

  }

}
</script>