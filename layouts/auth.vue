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
  display: flex;
  justify-content: center;
  align-items: center;

  background: linear-gradient(
    to right,
    #2c3e50,
    #4ca1af
  );
}

.auth-card {
  background: white;
  padding: 40px;
  width: 380px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}
</style>
