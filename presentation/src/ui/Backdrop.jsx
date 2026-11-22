import { useEffect, useRef, useState } from 'react'
import { LOOPS, STORAGE_PREFIX } from '../content.js'
import { OCTICONS } from './octicons.js'

// ─────────────────────────────────────────────────────────────────────────────
// A glowing Copilot core with two orbit rings: the inner loop (VS Code) and the
// outer loop (github.com). Packets travel along both rings; now and then one
// jumps from the inner loop to the outer loop (a push) and back to the core.
// Respects prefers-reduced-motion, has a toggle, pauses when the tab is hidden.
// With motion off it draws one still frame.
// ─────────────────────────────────────────────────────────────────────────────

const KEY = `${STORAGE_PREFIX}:motion`

export function useMotionPreference() {
  const [on, setOn] = useState(() => {
    try {
      const saved = localStorage.getItem(KEY)
      if (saved) return saved !== 'off'
      return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    } catch { return true }
  })
  useEffect(() => { try { localStorage.setItem(KEY, on ? 'on' : 'off') } catch { /* ignore */ } }, [on])
  return [on, setOn]
}

export function MotionToggle({ enabled, onToggle }) {
  return (
    <button type="button" className="motion-toggle" onClick={onToggle} aria-pressed={enabled} title={enabled ? 'Pause background animation' : 'Play background animation'}>
      <span className={`motion-dot ${enabled ? 'on' : ''}`} aria-hidden="true" />
      <span>Motion {enabled ? 'on' : 'off'}</span>
    </button>
  )
}

const PURPLE = [163, 113, 247]
const BLUE = [88, 166, 255]
const PINK = [247, 120, 186]
const GREEN = [63, 185, 80]
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`
const mix = (a, b, t) => [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * t))

// variant: 'hero' (big, labelled), 'deck' (right side, labelled, softer), 'quiet' (corner, faint)
export default function Backdrop({ enabled = true, variant = 'deck' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const glyph = OCTICONS.copilot.d.map((d) => new Path2D(d))
    const labels = variant === 'hero'
    const k = variant === 'quiet' ? 0.45 : variant === 'deck' ? 0.5 : 1
    let w = 0, h = 0, cx = 0, cy = 0, R1 = 0, R2 = 0, tilt = -0.18
    let dust = [], packets = [], jumps = [], raf = 0, last = performance.now(), t = 0, nextJump = 2

    const inner = LOOPS.inner.stations
    const outer = LOOPS.outer.stations

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const narrow = w < 800
      if (variant === 'hero') { cx = narrow ? w * 0.5 : w * 0.75; cy = narrow ? h * 0.3 : h * 0.48; R2 = Math.min(w * (narrow ? 0.46 : 0.26), h * 0.4) }
      else if (variant === 'deck') { cx = w * 0.9; cy = h * 0.9; R2 = Math.min(w, h) * 0.46 }
      else { cx = w * 0.92; cy = h * 0.9; R2 = Math.min(w, h) * 0.32 }
      R1 = R2 * 0.56
      const n = Math.round(Math.min(90, (w * h) / 22000) * (variant === 'quiet' ? 0.4 : 1))
      dust = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, v: 3 + Math.random() * 8, r: 0.5 + Math.random() * 1.1, a: 0.08 + Math.random() * 0.22, c: [PURPLE, BLUE, PINK][Math.floor(Math.random() * 3)] }))
      packets = [
        ...Array.from({ length: 5 }, (_, i) => ({ ring: 1, a: (i / 5) * Math.PI * 2, v: 0.32 + Math.random() * 0.12, c: i % 2 ? PURPLE : BLUE })),
        ...Array.from({ length: 6 }, (_, i) => ({ ring: 2, a: (i / 6) * Math.PI * 2, v: 0.16 + Math.random() * 0.08, c: i % 2 ? GREEN : BLUE })),
      ]
      jumps = []
    }

    const pt = (R, a) => {
      const x = Math.cos(a) * R
      const y = Math.sin(a) * R * 0.42
      return [cx + x * Math.cos(tilt) - y * Math.sin(tilt), cy + x * Math.sin(tilt) + y * Math.cos(tilt)]
    }
    const station = (list, R, i) => pt(R, (i / list.length) * Math.PI * 2 - Math.PI / 2 + 0.35)

    const ring = (R, c, a) => {
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(tilt)
      const g = ctx.createLinearGradient(-R, 0, R, 0)
      g.addColorStop(0, rgba(c, a * 0.4)); g.addColorStop(0.5, rgba(c, a)); g.addColorStop(1, rgba(c, a * 0.4))
      ctx.strokeStyle = g
      ctx.lineWidth = 1.2
      ctx.beginPath(); ctx.ellipse(0, 0, R, R * 0.42, 0, 0, Math.PI * 2); ctx.stroke()
      ctx.restore()
    }

    const dot = (x, y, c, r, glow) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, glow)
      g.addColorStop(0, rgba(c, 0.55 * k)); g.addColorStop(1, rgba(c, 0))
      ctx.fillStyle = g
      ctx.beginPath(); ctx.arc(x, y, glow, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = rgba(mix(c, [255, 255, 255], 0.35), 0.95 * k)
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
    }

    const draw = (dt) => {
      t += dt
      ctx.clearRect(0, 0, w, h)

      for (const d of dust) {
        d.y -= d.v * dt
        if (d.y < -4) { d.y = h + 4; d.x = Math.random() * w }
        ctx.fillStyle = rgba(d.c, d.a * k)
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill()
      }

      // halo
      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, R2 * 1.15)
      halo.addColorStop(0, rgba(PURPLE, 0.12 * k)); halo.addColorStop(0.5, rgba(BLUE, 0.05 * k)); halo.addColorStop(1, rgba(BLUE, 0))
      ctx.fillStyle = halo
      ctx.beginPath(); ctx.arc(cx, cy, R2 * 1.15, 0, Math.PI * 2); ctx.fill()

      ring(R2, GREEN, 0.28 * k)
      ring(R1, PURPLE, 0.36 * k)

      // stations + labels
      ctx.font = `600 ${Math.max(10, Math.round(R2 * 0.045))}px "Mona Sans Variable", system-ui, sans-serif`
      ctx.textAlign = 'center'
      inner.forEach((s, i) => {
        const [x, y] = station(inner, R1, i)
        dot(x, y, PURPLE, 2.6, 12)
        if (labels) { ctx.fillStyle = rgba([210, 190, 255], 0.55 * k); ctx.fillText(s, x, y - 10) }
      })
      outer.forEach((s, i) => {
        const [x, y] = station(outer, R2, i)
        dot(x, y, GREEN, 2.8, 14)
        if (labels) { ctx.fillStyle = rgba([170, 230, 180], 0.5 * k); ctx.fillText(s, x, y - 11) }
      })
      if (labels) {
        ctx.font = `700 ${Math.max(9, Math.round(R2 * 0.036))}px "Mona Sans Variable", system-ui, sans-serif`
        ctx.fillStyle = rgba(PURPLE, 0.6 * k)
        const [ix, iy] = pt(R1, Math.PI / 2)
        ctx.fillText('INNER LOOP · VS CODE', ix, iy + 30)
        ctx.fillStyle = rgba(GREEN, 0.55 * k)
        const [ox, oy] = pt(R2, Math.PI / 2)
        ctx.fillText('OUTER LOOP · GITHUB.COM', ox, oy + 30)
      }

      // packets on rings
      for (const p of packets) {
        p.a += p.v * dt
        const [x, y] = pt(p.ring === 1 ? R1 : R2, p.a)
        const [tx, ty] = pt(p.ring === 1 ? R1 : R2, p.a - 0.18)
        const g = ctx.createLinearGradient(tx, ty, x, y)
        g.addColorStop(0, rgba(p.c, 0)); g.addColorStop(1, rgba(p.c, 0.8 * k))
        ctx.strokeStyle = g
        ctx.lineWidth = 2
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(x, y); ctx.stroke()
        dot(x, y, p.c, 1.8, 7)
      }

      // jumps: inner Test → outer Pull request (push), outer Automate → core
      nextJump -= dt
      if (nextJump <= 0) {
        nextJump = 3 + Math.random() * 2.5
        const push = Math.random() < 0.6
        const from = push ? station(inner, R1, 3) : station(outer, R2, 4)
        const to = push ? station(outer, R2, 0) : [cx, cy]
        jumps.push({ from, to, p: 0, c: push ? GREEN : PINK })
      }
      for (let i = jumps.length - 1; i >= 0; i--) {
        const j = jumps[i]
        j.p += dt * 0.55
        const e = j.p < 0.5 ? 2 * j.p * j.p : 1 - (-2 * j.p + 2) ** 2 / 2
        const mx = (j.from[0] + j.to[0]) / 2, my = Math.min(j.from[1], j.to[1]) - R2 * 0.25
        const x = (1 - e) ** 2 * j.from[0] + 2 * (1 - e) * e * mx + e ** 2 * j.to[0]
        const y = (1 - e) ** 2 * j.from[1] + 2 * (1 - e) * e * my + e ** 2 * j.to[1]
        dot(x, y, j.c, 2, 10)
        if (j.p >= 1) jumps.splice(i, 1)
      }

      // core
      const pulse = 0.8 + Math.sin(t * 1.5) * 0.2
      const cr = R2 * 0.2
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr * 1.8)
      cg.addColorStop(0, rgba(PURPLE, 0.55 * k * pulse)); cg.addColorStop(0.45, rgba(BLUE, 0.18 * k * pulse)); cg.addColorStop(1, rgba(PINK, 0))
      ctx.fillStyle = cg
      ctx.beginPath(); ctx.arc(cx, cy, cr * 1.8, 0, Math.PI * 2); ctx.fill()
      if (variant !== 'quiet') return
      const s = (cr * 0.9) / 24
      ctx.save()
      ctx.translate(cx - 12 * s, cy - 12 * s)
      ctx.scale(s, s)
      ctx.shadowColor = rgba(PURPLE, 0.9)
      ctx.shadowBlur = 24
      ctx.fillStyle = rgba([240, 235, 255], 0.92 * k)
      glyph.forEach((p) => ctx.fill(p))
      ctx.restore()
    }

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      draw(dt)
      raf = requestAnimationFrame(frame)
    }
    const start = () => { cancelAnimationFrame(raf); if (enabled && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame) } }
    const onResize = () => { resize(); if (!enabled) draw(0) }

    resize()
    if (enabled) start()
    else { t = 1.2; draw(0) }
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', start)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', start)
    }
  }, [enabled, variant])

  return <canvas ref={ref} className={`backdrop backdrop-${variant}`} aria-hidden="true" />
}
