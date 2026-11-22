import { useEffect } from 'react'
import { Slide, useDisclosure, useSlides } from '@deckio/deck-engine'
import { CHAT_CONTROLS, EVENT, FIRST_WEEK, FIVE_MOVES, HOUSE_RULES, LEVEL_UP, LINKS, MISSIONS, READY, SLIDES } from '../content.js'
import { BothOs, CodeCard, Mascot, Octicon, PromptCard, Qr, Rich } from '../ui/ui.jsx'
import { MotionContext } from './motion.js'
import { CloudCard, ControlExplorer, Countdown, GhostDemo, LoopMap, PrecisionExplorer, QuestPicker, RecipeBuilder, ServiceMap, ShipPipeline, SurfaceMap, TicketBoard } from './widgets.jsx'

export { MotionContext }

const GUIDE_SHORT = 'natethebuilder.github.io/rabobank-copilot-workshop/#/lab'
const mission = (id) => MISSIONS.find((m) => m.id === id)
const on = (step, i) => (step >= i ? 'is-in' : 'is-out')

function Title({ parts, as: Tag = 'h2' }) {
  if (parts.length === 2) return <Tag>{parts[0]} <em>{parts[1]}</em></Tag>
  return <Tag>{parts[0]} <em>{parts[1]}</em> {parts[2]}</Tag>
}

function Head({ kickers = [], title, sub }) {
  return (
    <header className="s-head">
      <div className="s-kick">{kickers.map((k) => <span key={typeof k === 'string' ? k : k.key} className="pill">{k}</span>)}</div>
      {title}
      {sub && <p className="s-sub">{sub}</p>}
    </header>
  )
}

function MissionKick({ m }) {
  return (
    <div className="s-kick">
      <span className={`pill pill-mission sec-${m.section}`}><Octicon name={m.icon} size={16} />Mission {m.n} · {m.shortName || m.name}</span>
      <span className="pill"><Octicon name="north-star" size={14} />{m.time} CET</span>
      <span className="pill pill-mode">{m.mode === 'Editor' ? 'Editor · Tab · inline chat' : m.mode}</span>
    </div>
  )
}

function Steps({ steps, compact }) {
  return (
    <ol className={`m-steps ${compact ? 'is-compact' : ''}`}>
      {steps.map((s, i) => {
        if (s.prompt) return <li key={i} className="is-prompt"><PromptCard text={s.prompt} label={s.label || 'Prompt'} /></li>
        if (s.code) return <li key={i} className="is-prompt"><CodeCard text={s.code} label={s.label} /></li>
        if (s.tip) return <li key={i} className="is-tip"><Octicon name="sparkle-fill" size={16} /><Rich text={s.tip} /></li>
        return <li key={i}><Rich text={s.text} /></li>
      })}
    </ol>
  )
}

function See({ items }) {
  return (
    <div className="m-see">
      <h4><Octicon name="eye" size={16} />What you should see</h4>
      <ul>{items.map((t) => <li key={t}><Rich text={t} /></li>)}</ul>
    </div>
  )
}

function MissionHeader({ m }) {
  return (
    <div className="m-header">
      <div>
        <MissionKick m={m} />
        <Title parts={m.headline} />
        <p className="m-goal">{m.goal}</p>
      </div>
      <Countdown minutes={m.minutes} label={`Mission ${m.n}`} />
    </div>
  )
}

// ── Slide specs ─────────────────────────────────────────────────────────────
const SPECS = {
  title: {
    render: () => (
      <div className="title-grid">
        <div className="title-main">
          <div className="s-kick">
            <span className="pill pill-brand"><Octicon name="copilot" size={16} />{EVENT.cobrand}</span>
            <span className="pill">{EVENT.format}</span>
          </div>
          <h1 className="display">Zero to <em>pull request</em><br />in 30 minutes</h1>
          <p className="title-when">{EVENT.date} · {EVENT.time}</p>
          <ol className="title-missions">
            {MISSIONS.map((m) => <li key={m.id} className={`sec-${m.section}`}><Octicon name={m.icon} size={18} /><span>{m.n}</span>{m.shortName || m.name}</li>)}
          </ol>
        </div>
        <div className="title-side">
          <Mascot className="is-hero" />
          <div className="qr-card">
            <Qr text={LINKS.guide} label="QR code to the participant guide" />
            <div><strong>Open the guide</strong><span>{GUIDE_SHORT}</span></div>
          </div>
        </div>
      </div>
    ),
  },
  surfaces: {
    render: () => (
      <>
        <Head kickers={['Copilot in 2026']} title={<h2>From autocomplete to <em>agents</em></h2>} sub="Click a surface to see what it does and where you’ll use it today." />
        <SurfaceMap />
      </>
    ),
  },
  loops: {
    frags: 2,
    render: ({ step }) => (
      <div className="loops-grid">
        <div>
          <Head kickers={['How the work flows']} title={<h2>Two loops, <em>one Copilot</em></h2>} />
          <div className={`loop-card is-inner ${on(step, 0)}`}><h3><Octicon name="file-code" size={20} />Inner loop · VS Code</h3><p>What you do alone: explore, write, fix, test.</p><span>Missions 1–5</span></div>
          <div className={`loop-card is-outer ${on(step, 1)}`}><h3><Octicon name="mark-github" size={20} />Outer loop · github.com</h3><p>What your team does together: pull request, review, CI, merge, automate.</p><span>Mission 6 · live demo</span></div>
          <p className={`loop-punch ${on(step, 2)}`}>Same Copilot, same house rules, same skills in both loops.</p>
        </div>
        <LoopMap step={step} />
      </div>
    ),
  },
  control: {
    render: () => (
      <>
        <Head kickers={['You stay in control']} title={<h2>Copilot proposes, <em>you decide</em></h2>} />
        <ControlExplorer />
      </>
    ),
  },
  woodgrove: {
    render: () => (
      <>
        <Head
          kickers={['Today’s playground', <span key="f" className="pill-inline"><Octicon name="shield-check" size={14} />fictional bank · fake data · nothing to install</span>]}
          title={<h2>Meet <em>Woodgrove Transfers</em></h2>}
          sub="A small SEPA transfer service: IBAN validation, amounts in cents, a transfer console and an optional API. Zero dependencies, no build step."
        />
        <div className="wg-grid"><ServiceMap /><TicketBoard /></div>
      </>
    ),
  },
  ready: {
    render: () => (
      <>
        <Head kickers={['Before Mission 1']} title={<h2>Ready <em>check</em></h2>} sub="Ideally done before we start. Not there yet? Keep going in the guide while we explore." />
        <ol className="ready-grid">
          {READY.map((r, i) => (
            <li key={r.title}><span className="ready-num">{i + 1}</span><h3>{r.title}</h3><p><Rich text={r.text} /></p></li>
          ))}
        </ol>
        <div className="chat-controls" aria-label="Chat controls to check">
          <span className="cc-label"><Octicon name="copilot16" size={16} />Chat view</span>
          {CHAT_CONTROLS.map((c) => <span key={c.label} className="cc-chip"><em>{c.label}</em>{c.value}</span>)}
        </div>
      </>
    ),
  },
  explore: {
    render: () => {
      const m = mission('explore')
      return (
        <>
          <MissionHeader m={m} />
          <div className="m-body">
            <Steps steps={m.steps} />
            <aside className="m-side"><See items={m.see} /><div className="ask-card"><span className="ui-chip">Ask</span> answers questions. <span className="ui-chip">Agent</span> changes things. Start with Ask on any repo you don’t know.</div></aside>
          </div>
        </>
      )
    },
  },
  write: {
    render: () => {
      const m = mission('write')
      return (
        <>
          <MissionHeader m={m} />
          <div className="m-body is-write">
            <Steps steps={m.steps} compact />
            <aside className="m-side"><GhostDemo /><See items={m.see} /></aside>
          </div>
        </>
      )
    },
  },
  fix: {
    render: () => {
      const m = mission('fix')
      return (
        <>
          <MissionHeader m={m} />
          <div className="m-body">
            <Steps steps={m.steps} compact />
            <aside className="m-side">
              <See items={m.see} />
              <div className="redgreen"><span className="rg-red">✗ 1 failed</span><span className="rg-arrow">→</span><span className="rg-green">✓ all passed</span></div>
            </aside>
          </div>
        </>
      )
    },
  },
  precision: {
    render: () => (
      <>
        <Head kickers={['WGB-101 · root cause']} title={<h2>Why <em>FR14</em> failed</h2>} sub="isValidIban reads 15 digits at a time. A two-digit remainder plus 15 digits is 17 digits: too big for a JavaScript Number." />
        <PrecisionExplorer />
      </>
    ),
  },
  teach: {
    render: () => {
      const m = mission('teach')
      return (
        <>
          <MissionHeader m={m} />
          <div className="m-body is-teach">
            <div>
              <Steps steps={[m.steps[0], m.steps[2], m.steps[3]]} compact />
              <div className="changes">
                <h4><Octicon name="sync" size={16} />What changes</h4>
                <ul>
                  <li><span>Before</span>Every chat starts from zero.</li>
                  <li><span>After</span>Every chat in this repo starts with your rules.</li>
                  <li><span>Check</span>Look for <code>copilot-instructions.md</code> under the response’s references.</li>
                </ul>
              </div>
            </div>
            <CodeCard text={HOUSE_RULES} label=".github/copilot-instructions.md" />
          </div>
        </>
      )
    },
  },
  quest: {
    render: () => {
      const m = mission('quest')
      return (
        <>
          <MissionHeader m={m} />
          <QuestPicker />
        </>
      )
    },
  },
  recipe: {
    render: () => (
      <>
        <Head kickers={['Prompt recipe']} title={<h2>Goal, context, constraints, <em>check</em></h2>} sub="Pick or edit each ingredient. The check is the part people forget: it’s how the agent proves its work." />
        <RecipeBuilder />
      </>
    ),
  },
  ship: {
    render: ({ active }) => {
      const m = mission('ship')
      return (
        <>
          <MissionHeader m={m} />
          <div className="m-body is-ship">
            <Steps steps={m.steps} compact />
            <aside className="m-side"><CloudCard /></aside>
          </div>
          <ShipPipeline active={active} />
        </>
      )
    },
  },
  levelup: {
    render: () => (
      <>
        <Head kickers={['After today']} title={<h2>Level <em>up</em></h2>} sub="All in Chat: Open Customizations, the Agents window or github.com. Pick one a week." />
        <div className="levelup">
          {LEVEL_UP.map((x) => <article key={x.name}><Octicon name={x.icon} size={24} /><h3>{x.name}</h3><p><Rich text={x.text} /></p></article>)}
        </div>
      </>
    ),
  },
  wrap: {
    render: () => (
      <div className="wrap-grid">
        <div>
          <Head kickers={['Wrap']} title={<h2>Five moves to <em>keep</em></h2>} />
          <ol className="moves">
            {FIVE_MOVES.map((x, i) => <li key={x.title}><span>{i + 1}</span><p><strong>{x.title}</strong> <Rich text={x.text} /></p></li>)}
          </ol>
        </div>
        <div className="wrap-side">
          <div className="week">
            <h3>Your first week</h3>
            <ol>{FIRST_WEEK.map((d) => <li key={d.day}><span>{d.day}</span>{d.text}</li>)}</ol>
          </div>
          <div className="thanks">
            <Mascot />
            <div><strong>Thank you!</strong><span>Guide and cheat sheet stay online.</span><span className="thanks-url">{GUIDE_SHORT}</span></div>
            <Qr text={LINKS.guide} label="QR code to the participant guide" />
          </div>
        </div>
      </div>
    ),
  },
}

function makeSlide(meta) {
  const spec = SPECS[meta.id]
  function DeckSlide({ index }) {
    const { current } = useSlides()
    const active = current === index
    const { step } = useDisclosure(spec.frags || 0, { index })
    useEffect(() => {
      if (active) window.dispatchEvent(new CustomEvent('deck-step', { detail: { index, step, total: spec.frags || 0 } }))
    }, [active, step, index])
    return (
      <Slide index={index} className={`v-slide sec-${meta.section} is-${meta.id}`}>
        <div className="stage">
          <div className="stage-inner">{spec.render({ step, active, index })}</div>
        </div>
      </Slide>
    )
  }
  DeckSlide.displayName = `Slide_${meta.id}`
  return function Wrapped(props) { return <BothOs><DeckSlide {...props} /></BothOs> }
}

export const DECK_SLIDES = SLIDES.map(makeSlide)
