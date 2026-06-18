import { useEffect, useRef, useState } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useCountUp(target, { duration = 1800, suffix = '', prefix = '', decimals = 0 } = {}) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(`${prefix}0${suffix}`)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const format = (val) => {
      const n = decimals > 0 ? val.toFixed(decimals) : Math.round(val)
      return `${prefix}${n}${suffix}`
    }

    if (prefersReducedMotion()) {
      setDisplay(format(target))
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        const start = performance.now()
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setDisplay(format(target * eased))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.35 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration, suffix, prefix, decimals])

  return { ref, display }
}
