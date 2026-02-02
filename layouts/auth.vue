<template>
  <div class="auth-bg">
    <div class="auth-card">
      <Nuxt />
    </div>
  </div>
</template>

<style>
.auth-bg {
  min-height: 100vh;
  background: linear-gradient(to right, #2c3e50, #4ca1af);

  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-card {
  background: white;
  padding: 30px;
  width: 350px;

  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0,0,0,0.2);

  text-align: center;
}
</style>
