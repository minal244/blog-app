import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'

export const rules = {

  name: {
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
  })

}