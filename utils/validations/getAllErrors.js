import { getError } from './getError'

export function getAllErrors(v) {

  const errors = []

  Object.keys(v).forEach(key => {

    if (key.startsWith('$')) return

    const field = v[key]

    const error = getError(field)

    if (error) {
      errors.push(error)
    }

  })

  return errors
}