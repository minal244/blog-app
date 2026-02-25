<template>
  <p v-if="message" class="error-text">
    {{ message }}
  </p>
</template>

<script>
export default {
  props: {
    message: String
  }
}
</script>
