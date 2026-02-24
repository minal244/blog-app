<template>
  <div class="auth-layout">

    <main class="auth-container">
      <nuxt />
    </main>

  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.auth-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f5f6fa;
}

.auth-container {
  width: 400px;
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.auth-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(
    135deg,
    #4f46e5,
    #7c3aed
  );
}

.auth-container {
  width: 400px;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.15);
}
</style>
