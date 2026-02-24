<template>
  <div>

    <Navbar />

    <main class="container">
      <nuxt />
    </main>

    <Footer />

  </div>
</template>

<script>
import Navbar from '~/components/Navbar.vue'
import Footer from '~/components/Footer.vue'

export default {

  components: { Navbar, Footer },

  mounted() {
    // Restore auth state on refresh
    this.$store.dispatch('initAuth')
  }

}
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: auto;
  padding: 30px 20px;
}
</style>
