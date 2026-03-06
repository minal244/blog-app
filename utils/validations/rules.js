import { required, email, minLength, maxLength, sameAs } from 'vuelidate/lib/validators'

export const rules = {

  required: {
    required
  },

  email: {
    required,
    email
  },

  password: {
    required,
    minLength: minLength(6)
  },

  confirmPassword: (passwordRef) => ({
    required,
    sameAs: sameAs(passwordRef)
  }),

  title: {
    required,
    maxLength: maxLength(100)
  },

  content: {
    required,
    maxLength: maxLength(5000)
  }

}