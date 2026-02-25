<template>
  <div v-if="show" class="modal" @click.self="close">

    <img :src="src" class="modal-image" />

  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    src: String
  },

  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-image {
  max-width: 90%;
  max-height: 90%;
  border-radius: 8px;
}
</style>