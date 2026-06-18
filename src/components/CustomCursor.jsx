import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const ring = ringRef.current
    if (!cursor || !ring) return

    // Check if touch device or mobile screen
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    if (isTouch || isMobile) return

    // Hide default cursor
    document.body.style.cursor = 'none'

    const onMouseMove = (e) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.05, ease: 'power2.out' })
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.22, ease: 'power2.out' })
    }

    const onMouseEnterInteract = () => {
      gsap.to(ring, { scale: 1.8, backgroundColor: 'rgba(245, 158, 11, 0.08)', borderColor: 'var(--accent)', duration: 0.3 })
      gsap.to(cursor, { scale: 0.4, duration: 0.3 })
    }

    const onMouseLeaveInteract = () => {
      gsap.to(ring, { scale: 1, backgroundColor: 'transparent', borderColor: 'rgba(245, 158, 11, 0.4)', duration: 0.3 })
      gsap.to(cursor, { scale: 1, duration: 0.3 })
    }

    window.addEventListener('mousemove', onMouseMove)

    const addListeners = () => {
      const interactive = document.querySelectorAll('a, button, .nav-link, .bento-tile, .pricing-cta, .pricing-toggle, .lightbox-close')
      interactive.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnterInteract)
        el.removeEventListener('mouseleave', onMouseLeaveInteract)
        el.addEventListener('mouseenter', onMouseEnterInteract)
        el.addEventListener('mouseleave', onMouseLeaveInteract)
      })
    }

    addListeners()

    // Re-register listener targets on body dynamic changes
    const observer = new MutationObserver(addListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.body.style.cursor = ''
      observer.disconnect()
    }
  }, [])

  const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
  if (isTouch || isMobile) return null

  return (
    <>
      <div
        ref={cursorRef}
        style={{
          position: 'fixed', top: -4, left: -4, width: 8, height: 8,
          backgroundColor: 'var(--accent)', borderRadius: '50%',
          pointerEvents: 'none', zIndex: 99999, transform: 'translate3d(0,0,0)',
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed', top: -20, left: -20, width: 40, height: 40,
          border: '1.5px solid rgba(245, 158, 11, 0.4)', borderRadius: '50%',
          pointerEvents: 'none', zIndex: 99998, transform: 'translate3d(0,0,0)',
          transition: 'background-color 0.25s, border-color 0.25s',
        }}
      />
    </>
  )
}
