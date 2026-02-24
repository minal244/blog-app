<template>
  <div v-if="message" class="error">
    {{ message }}
  </div>
</template>

<script>
export default {
  props: {
    message: String
  }
}
</script>
