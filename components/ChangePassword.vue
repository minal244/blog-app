<template>
  <div class="profile-card">

    <h2>Change Password</h2>

    <form @submit.prevent="updatePassword">

      <!-- New Password -->
      <PasswordInput
        v-model="password"
        placeholder="New Password"
        :visible="showPassword"
        @blur="$v.password.$touch()"
      />
      <FormError :message="getError($v.password)" />

      <!-- Confirm Password -->
      <PasswordInput
        v-model="confirmPassword"
        placeholder="Confirm Password"
        :visible="showPassword"
        @blur="$v.confirmPassword.$touch()"
      />
      <FormError :message="getError($v.confirmPassword)" />

      <!-- Single Toggle -->
      <button type="button" @click="showPassword = !showPassword">
        {{ showPassword ? 'Hide Password' : 'Show Password' }}
      </button>

      <button type="submit">
        Update Password
      </button>

    </form>

  </div>
</template>

<script>
import PasswordInput from '~/components/PasswordInput.vue'
import FormError from '~/components/FormError.vue'

import { rules } from '~/utils/validations/rules'
import { getError } from '~/utils/validations/getError'

export default {

  components: {
    PasswordInput,
    FormError
  },

  data() {
    return {
      password: '',
      confirmPassword: '',
      showPassword: false
    }
  },

  validations() {
    return {
      password: rules.password,
      confirmPassword: rules.confirmPassword(() => this.password)
    }
  },

  methods: {

    getError,

    async updatePassword() {

      this.$v.$touch()

      if (this.$v.$invalid) {
        this.$toast.error('Fix form errors')
        return
      }

      try {

        await this.$axios.put('/auth/change-password', {
          password: this.password
        })

        this.$toast.success('Password updated')

        this.password = ''
        this.confirmPassword = ''

      } catch {
        this.$toast.error('Error updating password')
      }

    }

  }

}
</script>