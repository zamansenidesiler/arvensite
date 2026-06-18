import { useEffect, useRef } from 'react'

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

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let cursorX = mouseX
    let cursorY = mouseY
    let ringX = mouseX
    let ringY = mouseY

    let dotScale = 1
    let ringScale = 1
    let ringBg = 'transparent'
    let ringBorderColor = 'rgba(245, 158, 11, 0.4)'

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const onMouseEnterInteract = () => {
      dotScale = 0.4
      ringScale = 1.8
      ringBg = 'rgba(245, 158, 11, 0.08)'
      ringBorderColor = 'var(--accent)'
      
      ring.style.backgroundColor = ringBg
      ring.style.borderColor = ringBorderColor
    }

    const onMouseLeaveInteract = () => {
      dotScale = 1
      ringScale = 1
      ringBg = 'transparent'
      ringBorderColor = 'rgba(245, 158, 11, 0.4)'
      
      ring.style.backgroundColor = ringBg
      ring.style.borderColor = ringBorderColor
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })

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

    let active = true
    const tick = () => {
      if (!active) return
      
      // Linear interpolation (lerp) for smooth lag effect
      cursorX += (mouseX - cursorX) * 0.3
      cursorY += (mouseY - cursorY) * 0.3
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15

      cursor.style.transform = `translate3d(${cursorX - 4}px, ${cursorY - 4}px, 0) scale(${dotScale})`
      ring.style.transform = `translate3d(${ringX - 20}px, ${ringY - 20}px, 0) scale(${ringScale})`

      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)

    return () => {
      active = false
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
          position: 'fixed', top: 0, left: 0, width: 8, height: 8,
          backgroundColor: 'var(--accent)', borderRadius: '50%',
          pointerEvents: 'none', zIndex: 99999, transform: 'translate3d(-100px,-100px,0)',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed', top: 0, left: 0, width: 40, height: 40,
          border: '1.5px solid rgba(245, 158, 11, 0.4)', borderRadius: '50%',
          pointerEvents: 'none', zIndex: 99998, transform: 'translate3d(-100px,-100px,0)',
          transition: 'background-color 0.25s, border-color 0.25s',
          willChange: 'transform',
        }}
      />
    </>
  )
}
