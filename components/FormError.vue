<template>
  <div v-if="validation && validation.$error" class="error">

    <div
      v-for="(rule, ruleName) in validation.$params"
      :key="ruleName"
    >
      <span v-if="!validation[ruleName]">
        {{ getMessage(ruleName) }}
      </span>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    validation: {
      type: Object,
      required: true
    }
  },

  methods: {
    getMessage(rule) {

      const messages = {
        required: 'This field is required',
        email: 'Invalid email format',
        minLength: 'Too short',
        sameAsPassword: 'Passwords do not match'
      }

      return messages[rule] || 'Invalid value'
    }
  }
}
</script>

<style scoped>
.error {
  color: #e74c3c;
  font-size: 13px;
  margin-bottom: 10px;
}
</style>
