<template>
  <p v-if="content.length > 0" class="word-count">{{ wordCount }} words • {{ content.length }} / {{ max }} characters</p>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      required: true
    },
    max: {
      type: Number,
      default: 5000
    }
  },

  computed: {
    wordCount() {
      return this.content.trim() ? this.content.trim().split(/\s+/).length : 0
    }
  }
}
</script>

<style scoped>
.word-count {
  font-size: 12px;
  color: #9ca3af;
  margin-top: -8px;
  margin-bottom: 4px;
  text-align: right;
}
</style>
