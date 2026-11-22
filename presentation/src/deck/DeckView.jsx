import { useEffect, useRef, useState } from 'react'
import { SlideErrorBoundary, SlideProvider, useSlides } from '@deckio/deck-engine'
import { SECTIONS, SLIDES } from '../content.js'
import Backdrop, { MotionToggle, useMotionPreference } from '../ui/Backdrop.jsx'
import { Brand } from '../ui/ui.jsx'
import { isPreview, isTypingTarget, openChannel, openPresenter, pressKey } from '../sync.js'
import { DECK_SLIDES, MotionContext } from './slides.jsx'
import './deck.css'

const PROJECT = 'rabobank-copilot-workshop'

// Fit the 1600×900 stage to any screen.
function useStageFit() {
  useEffect(() => {
    const fit = () => document.documentElement.style.setProperty('--fit', String(Math.min(window.innerWidth / 1600, window.innerHeight / 900)))
    fit()
    window.addEventListener('resize', fit)
    return () => { window.removeEventListener('resize', fit); document.documentElement.style.removeProperty('--fit') }
  }, [])
}

function DeckProgress() {
  const { current, goTo } = useSlides()
  return (
    <nav className="deck-progress" aria-label="Slides">
      {SLIDES.map((m, i) => (
        <button
          key={m.id}
          type="button"
          tabIndex={-1}
          aria-label={`${i + 1}. ${m.title}`}
          title={`${i + 1}. ${m.title} · ${SECTIONS[m.section].label}`}
          className={`deck-seg ${i < current ? 'is-done' : ''} ${i === current ? 'is-now' : ''}`}
          style={{ '--c': SECTIONS[m.section].color }}
          onClick={() => goTo(i)}
        />
      ))}
    </nav>
  )
}

function Overview({ onClose }) {
  const { current, goTo } = useSlides()
  const ref = useRef(null)
  useEffect(() => { ref.current?.querySelector('.is-now')?.focus() }, [])
  return (
    <div className="deck-overview" role="dialog" aria-label="All slides" onClick={onClose}>
      <div className="deck-overview-grid" ref={ref} onClick={(e) => e.stopPropagation()}>
        {SLIDES.map((m, i) => (
          <button key={m.id} type="button" className={`deck-tile ${i === current ? 'is-now' : ''}`} style={{ '--c': SECTIONS[m.section].color }} onClick={() => { goTo(i); onClose() }}>
            <span className="deck-tile-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="deck-tile-sec">{SECTIONS[m.section].label}</span>
            <strong>{m.title}</strong>
            <span className="deck-tile-time">{m.slot} CET</span>
          </button>
        ))}
      </div>
      <p className="deck-overview-hint">Click a slide, or press O / Esc to close</p>
    </div>
  )
}

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen?.()
  else document.documentElement.requestFullscreen?.()
}

function DeckControls() {
  const { current, goTo } = useSlides()
  const [overview, setOverview] = useState(false)
  const [step, setStep] = useState({ index: -1, step: 0, total: 0 })
  const chan = useRef(null)
  const state = useRef({ current, step })
  state.current = { current, step }
  const preview = isPreview()

  useEffect(() => {
    const onStep = (e) => setStep(e.detail)
    window.addEventListener('deck-step', onStep)
    return () => window.removeEventListener('deck-step', onStep)
  }, [])

  useEffect(() => {
    const send = () => {
      const { current: i, step: s } = state.current
      chan.current?.post({ type: 'at', i, step: s.index === i ? s.step : 0, total: s.index === i ? s.total : 0 })
    }
    chan.current = openChannel((m) => {
      if (preview) {
        if (m.type === 'at') {
          const off = Number(new URLSearchParams(window.location.search).get('offset') || 0)
          goTo(Math.min(SLIDES.length - 1, m.i + off))
        }
        return
      }
      if (m.type === 'cmd' && m.cmd === 'next') pressKey('ArrowRight')
      else if (m.type === 'cmd' && m.cmd === 'prev') pressKey('ArrowLeft')
      else if (m.type === 'goto') goTo(m.i)
      else if (m.type === 'cmd' && m.cmd === 'sync') send()
    })
    if (preview) {
      goTo(Math.min(SLIDES.length - 1, Number(new URLSearchParams(window.location.search).get('offset') || 0)))
      chan.current.post({ type: 'cmd', cmd: 'sync' })
    }
    return () => chan.current?.close()
  }, [goTo, preview])

  useEffect(() => {
    if (preview) return
    chan.current?.post({ type: 'at', i: current, step: step.index === current ? step.step : 0, total: step.index === current ? step.total : 0 })
  }, [current, step, preview])

  useEffect(() => {
    if (preview) return undefined
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || isTypingTarget(e.target)) return
      const k = e.key.toLowerCase()
      if (k === 'p') { e.preventDefault(); openPresenter() }
      else if (k === 'o') { e.preventDefault(); setOverview((v) => !v) }
      else if (k === 'f') { e.preventDefault(); toggleFullscreen() }
      else if (k === 'escape') setOverview(false)
      else if (k === 'home') { e.preventDefault(); goTo(0) }
      else if (k === 'end') { e.preventDefault(); goTo(SLIDES.length - 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goTo, preview])

  if (preview) return null
  return (
    <>
      <DeckProgress />
      {overview && <Overview onClose={() => setOverview(false)} />}
    </>
  )
}

function Chrome({ motion, onToggleMotion }) {
  const { current, goTo } = useSlides()
  const [idle, setIdle] = useState(false)
  useEffect(() => {
    let t = 0
    const wake = () => { setIdle(false); clearTimeout(t); t = setTimeout(() => setIdle(true), 2400) }
    wake()
    window.addEventListener('mousemove', wake)
    window.addEventListener('keydown', wake)
    return () => { clearTimeout(t); window.removeEventListener('mousemove', wake); window.removeEventListener('keydown', wake) }
  }, [])
  const meta = SLIDES[current]
  return (
    <>
      <div className={`deck-chrome ${idle ? 'is-idle' : ''}`}>
        <a className="deck-home" href="#/" aria-label="Workshop home"><Brand compact /></a>
        <div className="deck-chrome-right">
          <button type="button" className="chrome-btn" onClick={openPresenter} title="Presenter view (P)">Presenter <kbd>P</kbd></button>
          <MotionToggle enabled={motion} onToggle={onToggleMotion} />
        </div>
      </div>
      <nav className={`deck-nav ${idle ? 'is-idle' : ''}`} aria-label="Slide navigation">
        <span className="deck-nav-sec" style={{ '--c': SECTIONS[meta.section].color }}>{SECTIONS[meta.section].label}</span>
        <button type="button" aria-label="Previous slide" disabled={current === 0} onClick={() => goTo(current - 1)}>←</button>
        <span className="deck-count" aria-live="polite">{String(current + 1).padStart(2, '0')}<small> / {SLIDES.length}</small></span>
        <button type="button" aria-label="Next slide" disabled={current === SLIDES.length - 1} onClick={() => goTo(current + 1)}>→</button>
      </nav>
    </>
  )
}

export default function DeckView() {
  const [motion, setMotion] = useMotionPreference()
  const preview = isPreview()
  useStageFit()

  useEffect(() => {
    document.documentElement.classList.add('is-deck')
    document.documentElement.classList.toggle('is-preview', preview)
    return () => document.documentElement.classList.remove('is-deck', 'is-preview')
  }, [preview])

  // The engine ignores arrow keys while a button has focus; drop focus after mouse clicks so the clicker keeps working.
  useEffect(() => {
    const onClick = (e) => {
      if (e.detail === 0) return
      const b = e.target instanceof Element && e.target.closest('button, a, [role="button"]')
      if (b && !b.closest('[data-keep-focus]')) setTimeout(() => b.blur(), 0)
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])

  return (
    <MotionContext.Provider value={motion && !preview}>
      {!preview && <Backdrop enabled={motion} variant="deck" />}
      <SlideProvider totalSlides={DECK_SLIDES.length} project={PROJECT} slides={DECK_SLIDES} theme="dark" mode="present">
        {!preview && <Chrome motion={motion} onToggleMotion={() => setMotion((v) => !v)} />}
        <DeckControls />
        <main className="deck" data-project-id={PROJECT} aria-label="Workshop deck">
          {DECK_SLIDES.map((SlideComponent, index) => (
            <SlideErrorBoundary key={SLIDES[index].id} index={index}>
              <SlideComponent index={index} />
            </SlideErrorBoundary>
          ))}
        </main>
      </SlideProvider>
    </MotionContext.Provider>
  )
}
