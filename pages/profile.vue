<template>
  <div>

    <h1>Profile</h1>

    <ProfileForm />
    <ChangePassword />

  </div>
</template>

<script>
import ProfileForm from '~/components/ProfileForm.vue'
import ChangePassword from '~/components/ChangePassword.vue'

export default {
  middleware: 'auth',
  components: { ProfileForm, ChangePassword }
}
</script>