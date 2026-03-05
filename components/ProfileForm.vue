<template>
  <div class="profile-card">

    <h2>Update Profile</h2>

    <form @submit.prevent="update">

      <input
        v-model="username"
        :class="{ error: $v.username.$error }"
        @blur="$v.username.$touch()"
      />

      <FormError :message="getError($v.username)" />

      <button type="submit">
        Update Username
      </button>

    </form>

  </div>
</template>

<script>
import FormError from '~/components/FormError.vue'
import { rules } from '~/utils/validations/rules'
import { getError } from '~/utils/validations/getError'

export default {

  components: {
    FormError
  },

  data() {
    return {
      username: this.$store.state.user?.username || ''
    }
  },

  validations() {
    return {
      username: rules.required
    }
  },

  methods: {

    getError,

    async update() {

      this.$v.$touch()

      if (this.$v.$invalid) {
        this.$toast.error('Fix form errors')
        return
      }

      try {

        await this.$axios.put('/auth/update', {
          username: this.username
        })

        this.$store.commit('setAuth', {
          token: this.$store.state.token,
          user: {
            ...this.$store.state.user,
            username: this.username
          }
        })

        this.$toast.success('Profile updated')

      } catch (error) {
        this.$toast.error('Username is already taken')
      }

    }

  }

}
</script>