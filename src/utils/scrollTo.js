export function scrollToSection(id, offset = -80) {
  const el = document.getElementById(id)
  if (!el) return
  if (window.lenis) window.lenis.scrollTo(el, { offset })
  else el.scrollIntoView({ behavior: 'smooth' })
}

export function scrollToTop() {
  if (window.lenis) window.lenis.scrollTo(0)
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}
