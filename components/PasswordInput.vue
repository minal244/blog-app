<template>
  <div class="password-input">

    <input
      :type="show ? 'text' : 'password'"
      :placeholder="placeholder"
      :value="value"
      @input="$emit('input', $event.target.value)"
    />

    <button type="button" @click="toggle">
      {{ show ? 'Hide' : 'Show' }}
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
      show: false
    }
  },

  methods: {
    toggle() {
      this.show = !this.show
    }
  }

}
</script>
