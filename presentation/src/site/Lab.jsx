import { useEffect, useMemo, useRef, useState } from 'react'
import { EVENT, FIRST_WEEK, LINKS, MISSIONS, QUESTS, READY } from '../content.js'
import { CodeCard, Mascot, Octicon, OsToggle, PromptCard, Rich, store } from '../ui/ui.jsx'
import { SiteFooter } from './Home.jsx'
import './site.css'

const KEY = 'lab:v1'
const EMPTY = { ready: [], done: [], quests: [], name: '' }

function useProgress() {
  const [state, setState] = useState(() => ({ ...EMPTY, ...store.get(KEY, EMPTY) }))
  useEffect(() => { store.set(KEY, state) }, [state])
  const toggle = (list, id) => setState((s) => ({ ...s, [list]: s[list].includes(id) ? s[list].filter((x) => x !== id) : [...s[list], id] }))
  return { state, setState, toggle }
}

const slug = (name) => name.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

function Confetti({ fire }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!fire || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const c = ref.current
    const ctx = c.getContext('2d')
    const w = (c.width = c.offsetWidth * 2)
    const h = (c.height = c.offsetHeight * 2)
    const colors = ['#a371f7', '#58a6ff', '#f778ba', '#3fb950', '#e3b341']
    const bits = Array.from({ length: 140 }, () => ({ x: w / 2, y: h * 0.35, vx: (Math.random() - 0.5) * 26, vy: -Math.random() * 26 - 6, r: 4 + Math.random() * 6, c: colors[Math.floor(Math.random() * colors.length)], a: Math.random() * 6, va: (Math.random() - 0.5) * 0.4 }))
    let raf = 0
    let t = 0
    const step = () => {
      t++
      ctx.clearRect(0, 0, w, h)
      for (const b of bits) {
        b.vy += 0.7; b.vx *= 0.99; b.x += b.vx; b.y += b.vy; b.a += b.va
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.a); ctx.fillStyle = b.c; ctx.fillRect(-b.r, -b.r / 2, b.r * 2, b.r); ctx.restore()
      }
      if (t < 160) raf = requestAnimationFrame(step)
      else ctx.clearRect(0, 0, w, h)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [fire])
  return <canvas ref={ref} className="confetti" aria-hidden="true" />
}

function StepList({ steps, name }) {
  return (
    <ol className="lab-steps">
      {steps.map((s, i) => {
        if (s.prompt) {
          const text = s.name && slug(name || '') ? s.prompt.replace('<your-name>', slug(name)) : s.prompt
          return <li key={i} className="is-prompt"><PromptCard text={text} label={s.label || 'Prompt'} /></li>
        }
        if (s.code) return <li key={i} className="is-prompt"><CodeCard text={s.code} label={s.label} /></li>
        if (s.tip) return <li key={i} className="is-tip"><Octicon name="sparkle-fill" size={14} /><Rich text={s.tip} /></li>
        return <li key={i}><Rich text={s.text} /></li>
      })}
    </ol>
  )
}

function QuestBoard({ state, toggle }) {
  const [open, setOpen] = useState(null)
  return (
    <div className="questboard">
      {QUESTS.map((q) => {
        const done = state.quests.includes(q.id)
        const isOpen = open === q.id
        return (
          <article key={q.id} className={`qb-card ${isOpen ? 'is-open' : ''} ${done ? 'is-done' : ''}`}>
            <button type="button" className="qb-head" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : q.id)}>
              <span className="qb-emoji" aria-hidden="true">{q.emoji}</span>
              <span className="qb-title"><strong>{q.name}</strong><span>about {q.minutes} min · {q.tags.join(' · ')}</span></span>
              {done && <Octicon name="check-circle" size={18} className="qb-check" />}
              <span className="qb-caret" aria-hidden="true">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <div className="qb-body">
                <p>{q.blurb}</p>
                <StepList steps={q.steps} />
                <label className="check"><input type="checkbox" checked={done} onChange={() => toggle('quests', q.id)} /> I did this quest</label>
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}

function Mission({ m, state, setState, toggle }) {
  const done = state.done.includes(m.id)
  return (
    <section id={`mission-${m.id}`} className={`mission sec-${m.section} ${done ? 'is-done' : ''}`} aria-labelledby={`h-${m.id}`}>
      <header className="mission-head">
        <span className="mission-n"><Octicon name={done ? 'check-circle' : m.icon} size={20} /></span>
        <div>
          <span className="mission-meta">Mission {m.n} · {m.time} CET · <span className="ui-chip">{m.mode === 'Editor' ? 'Editor' : m.mode}</span></span>
          <h2 id={`h-${m.id}`}>{m.name}</h2>
        </div>
      </header>
      <p className="mission-goal"><Octicon name="north-star" size={16} />{m.goal}</p>
      {m.id === 'ship' && (
        <label className="name-field">
          <span>Your name for the branch (optional)</span>
          <input type="text" value={state.name} placeholder="e.g. sanne" onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))} />
        </label>
      )}
      <StepList steps={m.steps} name={state.name} />
      {m.id === 'quest' && <QuestBoard state={state} toggle={toggle} />}
      <div className="see">
        <h3><Octicon name="eye" size={16} />What you should see</h3>
        <ul>{m.see.map((t) => <li key={t}><Rich text={t} /></li>)}</ul>
      </div>
      <details className="stuck">
        <summary><Octicon name="tools" size={16} />Stuck?</summary>
        <ul>{m.stuck.map((t) => <li key={t}><Rich text={t} /></li>)}</ul>
      </details>
      <button type="button" className={`complete ${done ? 'is-done' : ''}`} aria-pressed={done} onClick={() => toggle('done', m.id)}>
        <Octicon name="check-circle" size={18} />{done ? `Mission ${m.n} complete` : `Mark Mission ${m.n} complete`}
      </button>
    </section>
  )
}

export default function Lab() {
  const { state, setState, toggle } = useProgress()
  const readyDone = state.ready.length === READY.length
  const count = state.done.length + (readyDone ? 1 : 0)
  const total = MISSIONS.length + 1
  const finished = state.done.length === MISSIONS.length
  const [celebrate, setCelebrate] = useState(0)
  const wasFinished = useRef(finished)
  useEffect(() => {
    if (finished && !wasFinished.current) {
      setCelebrate((n) => n + 1)
      document.getElementById('finish')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    wasFinished.current = finished
  }, [finished])

  const jump = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const nav = useMemo(() => [{ id: 'ready', label: 'Ready', done: readyDone }, ...MISSIONS.map((m) => ({ id: `mission-${m.id}`, label: String(m.n), title: m.name, done: state.done.includes(m.id) }))], [readyDone, state.done])

  return (
    <div className="site lab">
      <header className="lab-bar">
        <div className="lab-bar-top">
          <a href="#/" className="lab-home" aria-label="Workshop home"><Octicon name="copilot" size={20} /><span>Participant guide</span></a>
          <OsToggle />
        </div>
        <div className="lab-progress" aria-label={`Progress: ${count} of ${total} done`}>
          <div className="lab-progress-bar"><i style={{ width: `${(count / total) * 100}%` }} /></div>
          <span className="lab-progress-n">{count}/{total}</span>
        </div>
        <nav className="lab-jump" aria-label="Jump to">
          {nav.map((n) => <button key={n.id} type="button" className={n.done ? 'is-done' : ''} title={n.title || n.label} onClick={() => jump(n.id)}>{n.done ? '✓' : n.label}</button>)}
          <button type="button" title="Finish" onClick={() => jump('finish')}>🏁</button>
        </nav>
      </header>

      <main className="lab-main">
        <section className="lab-intro">
          <span className="kicker">{EVENT.cobrand} · <span className="nowrap">{EVENT.time}</span></span>
          <h1>Zero to <em>pull request</em></h1>
          <p>Keep this guide next to VS Code. Every prompt has a copy button. Shortcuts follow the system you pick above.</p>
          <p className="privacy"><Octicon name="lock" size={14} />Your progress is saved only in this browser (localStorage). Nothing is sent anywhere.
            <button type="button" className="linkish" onClick={() => { if (window.confirm('Reset your progress in this browser?')) setState({ ...EMPTY }) }}>Reset progress</button>
          </p>
        </section>

        <section id="ready" className={`mission is-ready ${readyDone ? 'is-done' : ''}`} aria-labelledby="h-ready">
          <header className="mission-head">
            <span className="mission-n"><Octicon name={readyDone ? 'check-circle' : 'checklist'} size={20} /></span>
            <div><span className="mission-meta">Before you start · ideally before the session</span><h2 id="h-ready">Ready check</h2></div>
          </header>
          <ol className="ready-checks">
            {READY.map((r, i) => (
              <li key={r.title}>
                <label className="check">
                  <input type="checkbox" checked={state.ready.includes(i)} onChange={() => toggle('ready', i)} />
                  <span><strong>{r.title}</strong></span>
                </label>
                <p><Rich text={r.text} /></p>
                {r.note && <p className="ready-note"><Rich text={r.note} /></p>}
              </li>
            ))}
          </ol>
        </section>

        {MISSIONS.map((m) => <Mission key={m.id} m={m} state={state} setState={setState} toggle={toggle} />)}

        <section id="finish" className={`finish ${finished ? 'is-finished' : ''}`} aria-labelledby="h-finish">
          <Confetti fire={celebrate} />
          <div className="badge">
            <Mascot />
            <span className="badge-ring" aria-hidden="true" />
          </div>
          <h2 id="h-finish">{finished ? <>Zero to <em>pull request</em>: done!</> : 'Finish line'}</h2>
          <p>{finished ? 'You explored, wrote, fixed, taught, chose a quest and shipped through review. That’s the whole loop.' : `Mark all six missions complete to collect your badge (${state.done.length}/6 so far).`}</p>
          <div className="week">
            <h3>Your first week</h3>
            <ol>{FIRST_WEEK.map((d) => <li key={d.day}><span>{d.day}</span>{d.text}</li>)}</ol>
          </div>
          <div className="finish-links">
            <a className="btn btn-primary" href="#/cheatsheet"><Octicon name="book" size={16} />Cheat sheet</a>
            <a className="btn" href={LINKS.quickstart} target="_blank" rel="noreferrer"><Octicon name="agent" size={16} />VS Code agents quickstart</a>
            <a className="btn" href={LINKS.skillsCourse} target="_blank" rel="noreferrer"><Octicon name="mortar-board" size={16} />GitHub Skills: Getting started with GitHub Copilot</a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
