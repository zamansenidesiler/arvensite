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
    let ringScale = 1
    let cursorScale = 1

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const onMouseOver = (e) => {
      const target = e.target
      if (!target) return
      const interactive = target.closest('a, button, [role="button"], input, select, textarea, .bento-tile, .pricing-toggle')
      if (interactive) {
        ringScale = 1.4
        cursorScale = 0.4
        ring.classList.add('cursor-hover')
      } else {
        ringScale = 1
        cursorScale = 1
        ring.classList.remove('cursor-hover')
      }
    }

    const onMouseLeave = () => {
      cursor.style.opacity = '0'
      ring.style.opacity = '0'
    }

    const onMouseEnter = () => {
      cursor.style.opacity = '1'
      ring.style.opacity = '1'
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseover', onMouseOver, { passive: true })
    window.addEventListener('mouseleave', onMouseLeave, { passive: true })
    window.addEventListener('mouseenter', onMouseEnter, { passive: true })

    let active = true
    const tick = () => {
      if (!active) return
      
      // Linear interpolation (lerp) for smooth lag effect
      cursorX += (mouseX - cursorX) * 0.3
      cursorY += (mouseY - cursorY) * 0.3
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15

      cursor.style.transform = `translate3d(${cursorX - 4}px, ${cursorY - 4}px, 0) scale(${cursorScale})`
      ring.style.transform = `translate3d(${ringX - 20}px, ${ringY - 20}px, 0) scale(${ringScale})`

      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)

    return () => {
      active = false
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseover', onMouseOver)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('mouseenter', onMouseEnter)
      document.body.style.cursor = ''
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
          willChange: 'transform', transition: 'opacity 0.25s ease',
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed', top: 0, left: 0, width: 40, height: 40,
          border: '1.5px solid rgba(245, 158, 11, 0.4)', borderRadius: '50%',
          pointerEvents: 'none', zIndex: 99998, transform: 'translate3d(-100px,-100px,0)',
          transition: 'background-color 0.25s, border-color 0.25s, opacity 0.25s ease',
          willChange: 'transform',
        }}
      />
    </>
  )
}
