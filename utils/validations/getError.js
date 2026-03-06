import { messages } from './messages'

export function getError(field) {

  if (!field || !field.$error) return ''

  for (const key in field.$params) {
    if (field[key] === false) {
      const params = field.$params[key]
      switch (key) {
        case 'required':  return messages.required
        case 'email':     return messages.email
        case 'minLength': return messages.minLength(params.min)
        case 'maxLength': return messages.maxLength(params.max)
        case 'sameAs':    return messages.passwordMismatch
        default:          return 'Invalid value'
      }
    }
  }

  return ''
}