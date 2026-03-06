<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    const token = localStorage.getItem('token')

    if (token) {
      this.$router.replace('/dashboard')
    } else {
      this.$router.replace('/view')
    }
  }
}
</script>
