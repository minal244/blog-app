<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    const user = this.$store.state.user

    if (user) {
      this.$router.replace('/dashboard')
    } else {
      this.$router.replace('/login')
    }
  }
}
</script>
