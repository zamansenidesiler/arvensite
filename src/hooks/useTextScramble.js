import { useCallback, useRef, useEffect } from 'react'

export function useTextScramble() {
  const activeAnimations = useRef(new Map())

  const cancel = useCallback((el) => {
    if (activeAnimations.current.has(el)) {
      cancelAnimationFrame(activeAnimations.current.get(el))
      activeAnimations.current.delete(el)
    }
  }, [])

  const scramble = useCallback((e, targetText) => {
    const el = e.currentTarget
    cancel(el)

    const chars = 'ABCDEFGHJKLMNOPQRSTUVWXYZ!@#$%&*_+-=<>[]{}'
    let frame = 0
    const queue = []
    
    const text = targetText || el.textContent
    for (let i = 0; i < text.length; i++) {
      const from = text[i]
      if (from === ' ') {
        queue.push({ from, to: ' ', start: 0, end: 0 })
        continue
      }
      const start = Math.floor(Math.random() * 8)
      const end = start + Math.floor(Math.random() * 12)
      queue.push({ from, to: '', start, end })
    }

    const update = () => {
      let output = ''
      let complete = 0
      for (let i = 0; i < queue.length; i++) {
        let { from, to, start, end } = queue[i]
        if (frame >= end) {
          complete++
          output += from
        } else if (frame >= start) {
          if (!to || Math.random() < 0.28) {
            to = chars[Math.floor(Math.random() * chars.length)]
            queue[i].to = to
          }
          output += to
        } else {
          output += ' '
        }
      }

      el.textContent = output

      if (complete < queue.length) {
        frame++
        const animId = requestAnimationFrame(update)
        activeAnimations.current.set(el, animId)
      } else {
        el.textContent = text
        activeAnimations.current.delete(el)
      }
    }

    update()
  }, [cancel])

  useEffect(() => {
    return () => {
      activeAnimations.current.forEach((id) => cancelAnimationFrame(id))
    }
  }, [])

  return { scramble, cancel }
}
