<template>
  <div class="input-group">

    <input
      :type="type"
      :placeholder="placeholder"
      v-model="model"
      @blur="$v?.$touch()"
    />

    <small v-if="error" class="error">
      {{ error }}
    </small>

  </div>
</template>

<script>
import { getErrorMessage } from '~/utils/validationMessages'

export default {

  props: {
    value: String,
    type: {
      type: String,
      default: 'text'
    },
    placeholder: String,
    validation: Object
  },

  computed: {
    model: {
      get() { return this.value },
      set(v) { this.$emit('input', v) }
    },

    error() {
      if (!this.validation) return null
      return getErrorMessage(this.validation)
    }
  }

}
</script>
