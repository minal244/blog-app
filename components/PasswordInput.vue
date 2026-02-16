<template>
  <div class="password-wrapper">

    <input
      :type="visible ? 'text' : 'password'"
      :value="value"
      @input="$emit('input', $event.target.value)"
      :placeholder="placeholder"
    />

    <button
      type="button"
      class="toggle"
      @click="visible = !visible"
    >
      {{ visible ? 'Hide' : 'Show' }}
    </button>

  </div>
</template>

<script>
export default {
  props: {
    value: String,
    placeholder: String
  },

  data() {
    return {
      visible: false
    }
  }
}
</script>

<style scoped>
.password-wrapper {
  position: relative;
}

input {
  width: 100%;
  padding-right: 60px;
}

.toggle {
  position: absolute;
  right: 10px;
  top: 7px;
  border: none;
  background: none;
  font-size: 12px;
  cursor: pointer;
  color: #4ca1af;
}
</style>
