export function getErrorMessage(field) {

  if (!field.$dirty) return null

  if (!field.required) return 'This field is required'

  if (field.email === false) return 'Invalid email format'

  if (field.minLength === false)
    return `Minimum ${field.$params.minLength.min} characters`

  if (field.sameAsPassword === false)
    return 'Passwords do not match'

  return null
}
