<template>
  <div class="error-page">

    <h1 v-if="error.statusCode === 404">
      404 - Page Not Found
    </h1>

    <h1 v-else>
      {{ error.statusCode }} - Something went wrong
    </h1>

    <p>{{ error.message }}</p>

    <nuxt-link to="/">
      Go back to Home
    </nuxt-link>

  </div>
</template>

<script>
export default {
  props: ['error']
}
</script>

<style scoped>
.error-page {
  text-align: center;
  padding: 100px;
}

h1 {
  font-size: 40px;
  margin-bottom: 20px;
}
</style>