import { useEffect, useMemo, useRef, useState } from 'react'
import { SECTIONS, SLIDES, START_CLOCK } from '../content.js'
import { isTypingTarget, openChannel } from '../sync.js'
import { BothOs, Rich } from '../ui/ui.jsx'
import './deck.css'

const toMin = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m }
const T0 = toMin(START_CLOCK)
const slotEnd = (slot) => toMin(slot.split('–')[1]) - T0
const slotStart = (slot) => toMin(slot.split('–')[0]) - T0
const fmt = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}
const clockAt = (mins) => { const t = T0 + mins; return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(Math.floor(t % 60)).padStart(2, '0')}` }

function Preview({ offset, label }) {
  const src = useMemo(() => `${window.location.pathname}?preview&offset=${offset}#/deck`, [offset])
  const wrap = useRef(null)
  const [scale, setScale] = useState(0.3)
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / 1600))
    if (wrap.current) ro.observe(wrap.current)
    return () => ro.disconnect()
  }, [])
  return (
    <figure className="pv">
      <figcaption>{label}</figcaption>
      <div className="pv-frame" ref={wrap}>
        <iframe title={label} src={src} tabIndex={-1} style={{ transform: `scale(${scale})` }} />
      </div>
    </figure>
  )
}

export default function Presenter() {
  const [at, setAt] = useState({ i: 0, step: 0, total: 0 })
  const [linked, setLinked] = useState(false)
  const [t0, setT0] = useState(() => Date.now())
  const [now, setNow] = useState(() => Date.now())
  const chan = useRef(null)

  useEffect(() => {
    document.documentElement.classList.add('is-presenter')
    chan.current = openChannel((m) => { if (m.type === 'at') { setAt(m); setLinked(true) } })
    chan.current.post({ type: 'cmd', cmd: 'sync' })
    const tick = setInterval(() => setNow(Date.now()), 500)
    return () => { clearInterval(tick); chan.current?.close(); document.documentElement.classList.remove('is-presenter') }
  }, [])

  const cmd = (c) => chan.current?.post({ type: 'cmd', cmd: c })
  const goto = (i) => chan.current?.post({ type: 'goto', i })

  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || isTypingTarget(e.target)) return
      if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); cmd('next') }
      else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); cmd('prev') }
      else if (e.key === 'Home') goto(0)
      else if (e.key === 'End') goto(SLIDES.length - 1)
      else if (e.key === 't' || e.key === 'T') setT0(Date.now())
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const meta = SLIDES[at.i] || SLIDES[0]
  const next = SLIDES[at.i + 1]
  const elapsed = now - t0
  const mins = elapsed / 60000
  const end = slotEnd(meta.slot)
  const start = slotStart(meta.slot)
  const tone = mins > end + 0.5 ? 'behind' : mins < start - 1 ? 'ahead' : 'ontrack'

  return (
    <BothOs>
      <div className="presenter">
        <header className="pr-head">
          <div className="pr-where">
            <span className="pr-num">{at.i + 1}<small>/{SLIDES.length}</small></span>
            <span className="pr-sec" style={{ '--c': SECTIONS[meta.section].color }}>{SECTIONS[meta.section].label}</span>
            <h1>{meta.title}</h1>
            {at.total > 0 && <span className="pr-step">reveal {at.step}/{at.total}</span>}
          </div>
          <div className="pr-time">
            <span className={`pr-clock ${tone}`} title="Elapsed since 10:05 CET (T resets)">{fmt(elapsed)}</span>
            <small>
              <b>{meta.slot} CET</b> · {tone === 'behind' ? 'behind' : tone === 'ahead' ? 'ahead' : 'on track'} · timer clock {clockAt(mins)} CET · local {new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </small>
          </div>
        </header>

        {!linked && <p className="pr-warn">Waiting for the deck. Open <a href="#/deck" target="_blank" rel="noreferrer">#/deck</a> in another window of this browser and share only that window. Press T to reset the timer when the session starts.</p>}

        <main className="pr-main">
          <section className="pr-notes" aria-label="Speaker notes">
            <p className="pr-slot">This slide: <b>{meta.slot} CET</b></p>
            <ul>{meta.notes.map((n) => <li key={n}><Rich text={n} /></li>)}</ul>
          </section>
          <aside className="pr-side">
            <Preview offset={0} label="Now" />
            <Preview offset={1} label={next ? `Next · ${next.title}` : 'End'} />
          </aside>
        </main>

        <footer className="pr-foot">
          <button type="button" onClick={() => cmd('prev')}>← Prev</button>
          <button type="button" className="pr-primary" onClick={() => cmd('next')}>Next →</button>
          <button type="button" onClick={() => setT0(Date.now())}>Reset timer (T)</button>
          <div className="pr-strip" role="list">
            {SLIDES.map((m, i) => (
              <button key={m.id} type="button" role="listitem" title={`${i + 1}. ${m.title} · ${m.slot} CET`} aria-label={`Go to slide ${i + 1}`} className={i === at.i ? 'is-now' : i < at.i ? 'is-done' : ''} style={{ '--c': SECTIONS[m.section].color }} onClick={() => goto(i)} />
            ))}
          </div>
        </footer>
      </div>
    </BothOs>
  )
}
