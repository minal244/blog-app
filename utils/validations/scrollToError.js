export function scrollToError() {

  const el = document.querySelector('.error')

  if (el) {
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })

    el.focus?.()
  }

}