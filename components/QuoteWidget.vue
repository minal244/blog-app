<template>
  <div class="quote-card">

    <h3>Quote of the Day</h3>

    <p v-if="loading">Loading quote...</p>

    <div v-else>
      <p class="quote">"{{ quote }}"</p>
      <p class="author">— {{ author }}</p>
    </div>

  </div>
</template>

<script>
export default {

  data() {
    return {
      quote: '',
      author: '',
      loading: true
    }
  },

  mounted() {
    this.fetchQuote()
  },

  methods: {
    async fetchQuote() {

    this.loading = true

    try {

        const res = await this.$axios.get('/quote')

        this.quote = res.data[0].q
        this.author = res.data[0].a

    } catch {

        this.quote = "Unable to load quote"
        this.author = ""

    }

    this.loading = false
    }

  }

}
</script>

<style scoped>
.quote-card {
  margin-top: 20px;
  padding: 20px;
  background: #f3f4f6;
  border-radius: 8px;
}

.quote {
  font-size: 16px;
  margin-bottom: 10px;
}

.author {
  font-size: 14px;
  color: #555;
}

button {
  margin-top: 10px;
}
</style>