<template>
  <div class="password-input">

    <input
      :type="visible ? 'text' : 'password'"
      :placeholder="placeholder"
      :value="value"
      @input="$emit('input', $event.target.value)"
    />

  </div>
</template>

<script>
export default {

  props: {
    value: String,
    placeholder: String,
    visible: Boolean   // 🔥 controlled by parent
  }

}
</script>