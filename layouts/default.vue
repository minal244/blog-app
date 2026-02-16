<template>
  <div>

    <Navbar />

    <main class="container">
      <Nuxt />
    </main>

    <Footer />

  </div>
</template>

<script>
import Navbar from '~/components/Navbar.vue'
import Footer from '~/components/Footer.vue'

export default {
  components: {
    Navbar,
    Footer
  }
}
</script>

<style>
.container {
  max-width: 900px;
  margin: auto;
  padding: 30px 20px;
  min-height: 80vh;
}
</style>
