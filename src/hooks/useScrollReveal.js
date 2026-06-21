import { useEffect, useLayoutEffect, useRef } from 'react'

const reduceMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useScrollReveal(options = {}) {
  const ref = useRef(null)
  const hasRevealed = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const targets = () => el.querySelectorAll('.sr,.sr-up,.sr-left,.sr-right,.sr-scale')

    if (reduceMotion()) {
      el.classList.add('revealed-section')
      targets().forEach(t => t.classList.add('in'))
      hasRevealed.current = true
      return
    }

    if (hasRevealed.current) {
      el.classList.add('revealed-section')
      targets().forEach(t => t.classList.add('in'))
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed-section')
          targets().forEach(t => t.classList.add('in'))
          hasRevealed.current = true
          observer.disconnect()
        }
      },
      {
        threshold: options.threshold ?? 0.07,
        rootMargin: options.rootMargin ?? '0px 0px -60px 0px',
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Keep the classes applied when React re-renders the DOM
  useLayoutEffect(() => {
    if (hasRevealed.current) {
      const el = ref.current
      if (el) {
        el.classList.add('revealed-section')
        const targets = el.querySelectorAll('.sr,.sr-up,.sr-left,.sr-right,.sr-scale')
        targets.forEach(t => t.classList.add('in'))
      }
    }
  })

  return ref
}

