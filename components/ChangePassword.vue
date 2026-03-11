<template>
  <div class="profile-card">

    <h2>Change Password</h2>

    <form @submit.prevent="updatePassword">

      <!-- Current Password -->
      <PasswordInput
        v-model="currentPassword"
        placeholder="Current Password"
        :visible="showPassword"
        @blur="$v.currentPassword.$touch()"
      />
      <FormError :message="getError($v.currentPassword)" />

      <!-- New Password -->
      <PasswordInput
        v-model="newPassword"
        placeholder="New Password"
        :visible="showPassword"
        @blur="$v.newPassword.$touch()"
      />
      <FormError :message="getError($v.newPassword)" />

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
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      showPassword: false
    }
  },

  validations() {
    return {
      currentPassword: rules.password,
      newPassword: rules.password,
      confirmPassword: rules.confirmPassword(() => this.newPassword)
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
          currentPassword: this.currentPassword,
          newPassword: this.newPassword
        })

        this.$toast.success('Password updated')

        this.currentPassword = ''
        this.newPassword = ''
        this.confirmPassword = ''
        this.$v.$reset()

      } catch (err) {
        const msg = err.response?.data?.message || 'Error updating password'
        this.$toast.error(msg)
      }

    }

  }

}
</script>
