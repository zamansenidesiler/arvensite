import { useCallback } from 'react'

export function useTextScramble() {
  const scramble = useCallback((e, originalText) => {
    const el = e.currentTarget
    const chars = 'ABCDEFGHJKLMNOPQRSTUVWXYZ!@#$%&*_+-=<>[]{}'
    let frame = 0
    const queue = []
    
    const text = originalText || el.textContent
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

    let animationFrameId
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
        animationFrameId = requestAnimationFrame(update)
      } else {
        el.textContent = text
      }
    }

    update()

    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  return scramble
}
