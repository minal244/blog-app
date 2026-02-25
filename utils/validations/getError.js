import { messages } from './messages'

export function getError(field) {

  if (!field || !field.$error) return ''

  if (!field.required) return messages.required

  if (field.email === false) return messages.email

  if (field.minLength === false) {
    return messages.minLength(field.$params.minLength.min)
  }

  if (field.sameAs === false) return messages.passwordMismatch

  return ''
}