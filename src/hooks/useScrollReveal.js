import { useEffect, useRef } from 'react'

const reduceMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useScrollReveal(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const targets = () => el.querySelectorAll('.sr,.sr-up,.sr-left,.sr-right,.sr-scale')

    if (reduceMotion()) {
      targets().forEach(t => t.classList.add('in'))
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          targets().forEach(t => t.classList.add('in'))
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

  return ref
}
