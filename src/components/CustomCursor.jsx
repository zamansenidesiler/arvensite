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

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })

    let active = true
    const tick = () => {
      if (!active) return
      
      // Linear interpolation (lerp) for smooth lag effect
      cursorX += (mouseX - cursorX) * 0.3
      cursorY += (mouseY - cursorY) * 0.3
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15

      cursor.style.transform = `translate3d(${cursorX - 4}px, ${cursorY - 4}px, 0) scale(1)`
      ring.style.transform = `translate3d(${ringX - 20}px, ${ringY - 20}px, 0) scale(1)`

      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)

    return () => {
      active = false
      window.removeEventListener('mousemove', onMouseMove)
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
