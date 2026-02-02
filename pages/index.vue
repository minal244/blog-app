<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    const user = localStorage.getItem('user')

    if (user) {
      // Already logged in
      this.$router.push('/dashboard')
    } else {
      // Not logged in
      this.$router.push('/login')
    }
  }
}
</script>
