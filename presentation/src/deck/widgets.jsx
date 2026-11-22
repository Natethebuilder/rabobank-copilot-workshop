import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { CLOUD_PR_URL, CONTROL, LOOPS, PIPELINE, QUESTS, RECIPE, SERVICE, SURFACES, TICKETS } from '../content.js'
import { Octicon, PromptCard, Rich } from '../ui/ui.jsx'
import { analyseIban, groupIban } from './precision.js'
import { MotionContext } from './motion.js'

// ── Countdown ring (mission slides) ─────────────────────────────────────────
export function Countdown({ minutes, label }) {
  const total = minutes * 60
  const [left, setLeft] = useState(total)
  const [running, setRunning] = useState(false)
  useEffect(() => {
    if (!running) return undefined
    const t = setInterval(() => setLeft((s) => { if (s <= 1) { setRunning(false); return 0 } return s - 1 }), 1000)
    return () => clearInterval(t)
  }, [running])
  const r = 44
  const c = 2 * Math.PI * r
  const frac = left / total
  const tone = left === 0 ? 'is-done' : left <= 60 ? 'is-last' : ''
  return (
    <div className={`countdown ${tone} ${running ? 'is-running' : ''}`} data-keep-focus>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <linearGradient id="cd-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#a371f7" /><stop offset=".6" stopColor="#58a6ff" /><stop offset="1" stopColor="#f778ba" /></linearGradient>
        </defs>
        <circle cx="50" cy="50" r={r} className="cd-track" />
        <circle cx="50" cy="50" r={r} className="cd-bar" strokeDasharray={c} strokeDashoffset={c * (1 - frac)} />
      </svg>
      <div className="cd-center">
        <span className="cd-time" role="timer" aria-label={`${label}: ${Math.floor(left / 60)} minutes ${left % 60} seconds left`}>{Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}</span>
        <span className="cd-label">{left === 0 ? 'Time' : label}</span>
      </div>
      <div className="cd-btns">
        <button type="button" onClick={() => { if (left === 0) setLeft(total); setRunning((v) => !v) }} aria-label={running ? 'Pause timer' : 'Start timer'}>{running ? '❚❚' : '▶'}</button>
        <button type="button" onClick={() => { setRunning(false); setLeft(total) }} aria-label="Reset timer">↺</button>
      </div>
    </div>
  )
}

// ── Surface map ─────────────────────────────────────────────────────────────
export function SurfaceMap() {
  const [sel, setSel] = useState('agent')
  const s = SURFACES.find((x) => x.id === sel)
  const lane = (where) => SURFACES.filter((x) => x.where === where).map((x) => (
    <button key={x.id} type="button" className={`surf ${sel === x.id ? 'is-sel' : ''}`} onClick={() => setSel(x.id)} aria-pressed={sel === x.id}>
      <Octicon name={x.icon} size={20} /><span>{x.name}</span>
    </button>
  ))
  return (
    <div className="surfmap">
      <div className="surf-lanes">
        <div className="surf-axis"><span>Autocomplete</span><i /><span>Agents</span></div>
        <div className="surf-lane is-vscode"><h3><Octicon name="file-code" size={18} />In VS Code</h3><div className="surf-row">{lane('vscode')}</div></div>
        <div className="surf-lane is-github"><h3><Octicon name="mark-github" size={18} />On github.com</h3><div className="surf-row">{lane('github')}</div></div>
      </div>
      <aside className={`surf-card is-${s.where}`} aria-live="polite">
        <span className="surf-card-icon"><Octicon name={s.icon} size={34} /></span>
        <span className="surf-where">{s.where === 'vscode' ? 'VS Code' : 'github.com'}</span>
        <h3>{s.name}</h3>
        <p>{s.what}</p>
        <span className="surf-mission"><Octicon name="north-star" size={16} />{s.mission}</span>
      </aside>
    </div>
  )
}

// ── Two loops ───────────────────────────────────────────────────────────────
const MARKERS = { Explore: 'M1', Write: 'M2', Fix: 'M3', Test: 'M3–5', 'Pull request': 'M6', Review: 'M6', CI: 'M6', Automate: 'Demo' }

export function LoopMap({ step }) {
  const motion = useContext(MotionContext)
  const W = 820, H = 520, cx = W / 2, cy = H / 2
  const ell = (rx, ry) => `M ${cx - rx} ${cy} a ${rx} ${ry} 0 1 0 ${rx * 2} 0 a ${rx} ${ry} 0 1 0 ${-rx * 2} 0`
  const IN = [190, 120], OUT = [380, 230]
  const at = (r, i, n, off = 0) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2 + off
    return [cx + Math.cos(a) * r[0], cy + Math.sin(a) * r[1]]
  }
  const station = (name, [x, y], kind) => (
    <g key={name} className={`lm-st is-${kind}`} transform={`translate(${x} ${y})`}>
      <circle r="9" />
      <text y="-18">{name}</text>
      {MARKERS[name] && <g className="lm-mark" transform="translate(16 6)"><rect x="0" y="-11" width={MARKERS[name].length * 9 + 14} height="22" rx="11" /><text x="7" y="5">{MARKERS[name]}</text></g>}
    </g>
  )
  return (
    <svg className={`loopmap step-${step}`} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Inner loop in VS Code: explore, write, fix, test. Outer loop on github.com: pull request, review, CI, merge, automate.">
      <defs>
        <radialGradient id="lm-core"><stop offset="0" stopColor="#a371f7" stopOpacity=".7" /><stop offset=".5" stopColor="#58a6ff" stopOpacity=".18" /><stop offset="1" stopColor="#f778ba" stopOpacity="0" /></radialGradient>
        <path id="lm-in" d={ell(...IN)} /><path id="lm-out" d={ell(...OUT)} />
      </defs>
      <g className="lm-outer">
        <use href="#lm-out" className="lm-ring is-outer" />
        {motion && [0, 1, 2].map((i) => <circle key={i} r="5" className="lm-pk is-outer"><animateMotion dur="14s" begin={`${-i * 4.6}s`} repeatCount="indefinite"><mpath href="#lm-out" /></animateMotion></circle>)}
        {LOOPS.outer.stations.map((s, i) => station(s, at(OUT, i, LOOPS.outer.stations.length, 0.5), 'outer'))}
        <text className="lm-cap is-outer" x={cx} y={cy + OUT[1] + 34}>OUTER LOOP · GITHUB.COM</text>
      </g>
      <g className="lm-inner">
        <use href="#lm-in" className="lm-ring is-inner" />
        {motion && [0, 1].map((i) => <circle key={i} r="5" className="lm-pk is-inner"><animateMotion dur="7s" begin={`${-i * 3.5}s`} repeatCount="indefinite"><mpath href="#lm-in" /></animateMotion></circle>)}
        {LOOPS.inner.stations.map((s, i) => station(s, at(IN, i, LOOPS.inner.stations.length, 0.6), 'inner'))}
        <text className="lm-cap is-inner" x={cx} y={cy + IN[1] + 30}>INNER LOOP · VS CODE</text>
      </g>
      <g className="lm-core">
        <circle cx={cx} cy={cy} r="78" fill="url(#lm-core)" />
        <g transform={`translate(${cx - 24} ${cy - 24}) scale(2)`}><Octicon name="copilot" size={24} /></g>
      </g>
    </svg>
  )
}

// ── You stay in control ─────────────────────────────────────────────────────
function MockApprove({ level }) {
  const [choice, setChoice] = useState(null)
  const [open, setOpen] = useState(false)
  useEffect(() => { setChoice(null); setOpen(false) }, [level])
  if (level === 'all') {
    return (
      <div className="mock-body">
        <div className="mock-run"><Octicon name="check-circle" size={18} /> Ran <code>node tests/run.js</code> without asking</div>
        <p className="mock-note">Allow all skips ordinary confirmations. Your organisation’s policy still applies.</p>
      </div>
    )
  }
  return (
    <div className="mock-body">
      {level === 'assisted' && <p className="mock-note">Assisted: a model let routine reads through and flagged this command for your review.</p>}
      <div className="mock-approval">
        <div className="mock-approval-head"><Octicon name="terminal" size={16} /> Run command in terminal?</div>
        <pre>node tests/run.js</pre>
        {choice ? (
          <div className="mock-result"><Octicon name={choice === 'Skip' ? 'eye' : 'check-circle'} size={16} />{choice === 'Skip' ? 'Skipped. The agent continues without running it.' : `${choice}: the tests run.`}</div>
        ) : (
          <div className="mock-actions">
            <span className="mock-split">
              <button type="button" className="mock-primary" onClick={() => setChoice('Allowed once')}>Allow Once</button>
              <button type="button" className="mock-primary mock-caret" aria-label="More options" aria-expanded={open} onClick={() => setOpen((v) => !v)}>▾</button>
              {open && (
                <span className="mock-menu" role="menu">
                  <button type="button" role="menuitem" onClick={() => setChoice('Allowed in this Session')}>In this Session</button>
                  <button type="button" role="menuitem" onClick={() => setChoice('Always Allow')}>Always Allow</button>
                </span>
              )}
            </span>
            <button type="button" onClick={() => setChoice('Skip')}>Skip</button>
          </div>
        )}
      </div>
    </div>
  )
}

function MockReview() {
  const [state, setState] = useState(null)
  return (
    <div className="mock-body">
      <div className={`mock-diff ${state ? `is-${state}` : ''}`}>
        <div className="mock-file"><Octicon name="file-code" size={14} /> src/iban.js</div>
        <pre><span className="del">-  remainder = Number(String(remainder) + chunk) % 97</span>{'\n'}<span className="add">+  remainder = Number(BigInt(String(remainder) + chunk) % 97n)</span></pre>
      </div>
      {state ? (
        <div className="mock-result"><Octicon name={state === 'keep' ? 'check-circle' : 'sync'} size={16} />{state === 'keep' ? 'Kept. The change is yours now.' : 'Undone. The file is back as it was.'}<button type="button" className="mock-link" onClick={() => setState(null)}>Reset</button></div>
      ) : (
        <div className="mock-actions"><button type="button" className="mock-primary" onClick={() => setState('keep')}>Keep</button><button type="button" onClick={() => setState('undo')}>Undo</button><span className="mock-hint">per change, per file, or all</span></div>
      )}
    </div>
  )
}

function MockRestore() {
  const [done, setDone] = useState(null)
  const reqs = ['Give me a two-minute tour of this repository…', 'Customers report the bug in docs/tickets/WGB-101.md…', 'Implement docs/tickets/WGB-104.md.']
  return (
    <div className="mock-body">
      {reqs.map((r, i) => (
        <div key={r} className={`mock-req ${done != null && i > done ? 'is-gone' : ''}`}>
          <span className="mock-avatar">You</span><span className="mock-req-text">{r}</span>
          {i > 0 && <button type="button" className="mock-restore" onClick={() => setDone(i - 1)}><Octicon name="sync" size={14} />Restore Checkpoint</button>}
        </div>
      ))}
      {done != null && <div className="mock-result"><Octicon name="check-circle" size={16} />Files and chat restored. Terminal commands and external changes are not undone.<button type="button" className="mock-link" onClick={() => setDone(null)}>Reset</button></div>}
    </div>
  )
}

function MockSteer() {
  const [state, setState] = useState('running')
  return (
    <div className="mock-body">
      <div className={`mock-working is-${state}`}>
        <span className="mock-spinner" aria-hidden="true" />
        {state === 'running' && 'Working… running the tests'}
        {state === 'steer' && 'Steering: “Use a 9-digit chunk instead of BigInt.” It adjusts without starting over.'}
        {state === 'stop' && 'Stopped. Nothing else runs until you send a new message.'}
      </div>
      <div className="mock-actions">
        <button type="button" className="mock-primary" onClick={() => setState('steer')}>Steer with Message</button>
        <button type="button" onClick={() => setState('stop')}>Stop and Send</button>
        <button type="button" onClick={() => setState('stop')}>Stop</button>
        {state !== 'running' && <button type="button" className="mock-link" onClick={() => setState('running')}>Reset</button>}
      </div>
    </div>
  )
}

export function ControlExplorer() {
  const [level, setLevel] = useState('manual')
  const [tab, setTab] = useState('approve')
  const t = CONTROL.tabs.find((x) => x.id === tab)
  return (
    <div className="control">
      <div className="ctl-levels" role="radiogroup" aria-label="Permission level">
        <h3>Permission level</h3>
        {CONTROL.permissions.map((p) => (
          <button key={p.id} type="button" role="radio" aria-checked={level === p.id} className={`ctl-level ${level === p.id ? 'is-sel' : ''} is-${p.id}`} onClick={() => { setLevel(p.id); setTab('approve') }}>
            <span className="ctl-radio" /><span className="ctl-level-text"><strong>{p.name}</strong><em>{p.badge}</em><span>{p.text}</span></span>
          </button>
        ))}
        <p className="ctl-foot">Autopilot is a mode, not a permission level. <strong>Organisation policy always wins.</strong></p>
      </div>
      <div className="ctl-panel">
        <div className="ctl-tabs" role="tablist">
          {CONTROL.tabs.map((x) => (
            <button key={x.id} type="button" role="tab" aria-selected={tab === x.id} className={tab === x.id ? 'is-sel' : ''} onClick={() => setTab(x.id)}><Octicon name={x.icon} size={16} />{x.name}</button>
          ))}
        </div>
        <div className="ctl-mock" role="tabpanel">
          <div className="mock-chrome"><span /><span /><span /><b><Octicon name="copilot16" size={14} /> Chat</b><em>{CONTROL.permissions.find((p) => p.id === level).name}</em></div>
          <h4>{t.title}</h4>
          <p className="ctl-text">{t.text}</p>
          {tab === 'approve' && <MockApprove level={level} />}
          {tab === 'review' && <MockReview />}
          {tab === 'restore' && <MockRestore />}
          {tab === 'steer' && <MockSteer />}
        </div>
      </div>
    </div>
  )
}

// ── Woodgrove Transfers ─────────────────────────────────────────────────────
export function ServiceMap() {
  const box = (id) => { const s = SERVICE.find((x) => x.id === id); return <div key={id} className={`svc is-${id}`}><code>{s.name}</code><span>{s.text}</span></div> }
  return (
    <div className="svcmap">
      <div className="svc-col"><h4>Entry points</h4>{box('console')}{box('server')}</div>
      <div className="svc-arrow" aria-hidden="true">→</div>
      <div className="svc-col"><h4>Rules</h4>{box('transfer')}</div>
      <div className="svc-arrow" aria-hidden="true">→</div>
      <div className="svc-col"><h4>Building blocks</h4>{box('iban')}{box('money')}{box('config')}{box('accounts')}</div>
      <div className="svc-tests">{box('tests')}<span className="svc-green"><Octicon name="check-circle" size={16} /> All green today. The bugs escaped the tests.</span></div>
    </div>
  )
}

export function TicketBoard() {
  return (
    <div className="tickets">
      {TICKETS.map((t) => (
        <article key={t.id} className={`ticket is-${t.type}`}>
          <header><code>{t.id}</code><span className="ticket-type">{t.type}</span></header>
          <h4>{t.title}</h4>
          <span className="ticket-tag">{t.tag}</span>
        </article>
      ))}
    </div>
  )
}

// ── Mission 2: ghost text ───────────────────────────────────────────────────
export function GhostDemo() {
  const [phase, setPhase] = useState(0) // 0 ghost, 1 accepted, 2 next edit offered, 3 next edit accepted
  const ref = useRef(null)
  useEffect(() => {
    if (phase !== 1) return undefined
    const t = setTimeout(() => setPhase(2), 900)
    return () => clearTimeout(t)
  }, [phase])
  const advance = () => setPhase((p) => (p === 0 ? 1 : p === 2 ? 3 : p))
  const onKey = (e) => {
    if (e.key === 'Tab' && (phase === 0 || phase === 2)) { e.preventDefault(); e.stopPropagation(); advance() }
  }
  const ghost = phase === 0
  return (
    <div className="ghost" data-keep-focus>
      <div className="ghost-bar"><span /><span /><span /><b>src/iban.js</b></div>
      <div className="ghost-code" ref={ref} tabIndex={0} role="button" aria-label="Ghost text demo. Press Tab to accept." onKeyDown={onKey} onClick={advance}>
        <pre>
          <span className="ln">41</span><span className="cm">  // Mask an IBAN for logs: keep the country code and the last four characters</span>{'\n'}
          <span className="ln">42</span>{'  function maskIban('}<span className={ghost ? 'gt' : 'acc'}>{'iban) {'}</span>{'\n'}
          <span className="ln">43</span><span className={ghost ? 'gt' : 'acc'}>{'    const clean = normalizeIban(iban)'}</span>{'\n'}
          <span className="ln">44</span><span className={ghost ? 'gt' : 'acc'}>{"    return clean.slice(0, 2) + '*'.repeat(clean.length - 6) + clean.slice(-4)"}</span>{'\n'}
          <span className="ln">45</span><span className={ghost ? 'gt' : 'acc'}>{'  }'}</span>{'\n'}
          <span className="ln">46</span>{'\n'}
          <span className="ln">47</span>{'  return {'}{'\n'}
          <span className={`ln ${phase === 2 ? 'nes-arrow' : ''}`}>48</span>{'    normalizeIban, isValidIban, formatIban, countryOf, isSepaCountry,'}{phase >= 2 && <span className={phase === 2 ? 'gt nes' : 'acc'}>{' maskIban,'}</span>}{'\n'}
          <span className="ln">49</span>{'  }'}
        </pre>
      </div>
      <div className="ghost-hint">
        {phase === 0 && <><kbd>Tab</kbd> accepts the ghost text</>}
        {phase === 1 && <>Accepted. Watch the gutter…</>}
        {phase === 2 && <>Next edit suggestion → <kbd>Tab</kbd> to jump and accept</>}
        {phase === 3 && <><Octicon name="check-circle" size={16} /> Both accepted. <button type="button" className="mock-link" onClick={() => setPhase(0)}>Replay</button></>}
      </div>
    </div>
  )
}

// ── Why FR14 failed ─────────────────────────────────────────────────────────
const PRESETS = ['FR14 2004 1010 0505 0001 3M02 606', 'IT21 A030 6909 6061 0000 0063 789', 'FR76 3000 6000 0112 3456 7890 189', 'NL20 WGBK 0123 4567 89']

function diffDigits(actual, expected) {
  return [...actual].map((ch, i) => <span key={i} className={ch !== expected[i] ? 'is-diff' : ''}>{ch}</span>)
}

export function PrecisionExplorer() {
  const [value, setValue] = useState(PRESETS[0])
  const res = useMemo(() => analyseIban(value), [value])
  return (
    <div className="precision" data-testid="precision">
      <div className="pr-input">
        <label htmlFor="pr-iban">IBAN</label>
        <input id="pr-iban" value={value} onChange={(e) => setValue(e.target.value)} spellCheck="false" autoComplete="off" />
        <div className="pr-presets">
          {PRESETS.map((p) => <button key={p} type="button" className={value === p ? 'is-sel' : ''} onClick={() => setValue(p)}>{p.slice(0, 4)}</button>)}
        </div>
      </div>
      {res.error ? <p className="pr-error">{res.error}</p> : (
        <>
          <div className="pr-digits">
            <span className="pr-step-label">Move the first four characters to the end, letters → numbers (A = 10 … Z = 35)</span>
            <code>{res.digits.match(/.{1,15}/g).map((c, i) => <span key={i} className="pr-chunk">{c}</span>)}</code>
          </div>
          <table className="pr-table">
            <thead><tr><th>Chunk</th><th><code>String(r) + chunk</code></th><th>Digits</th><th><code>Number(…)</code> in JavaScript</th><th><code>% 97</code></th></tr></thead>
            <tbody>
              {res.rows.map((row, i) => (
                <tr key={i} className={row.unsafe ? 'is-unsafe' : ''}>
                  <td>{i + 1}</td>
                  <td><code>{row.joined}</code></td>
                  <td><span className={`pr-len ${row.unsafe ? 'is-bad' : ''}`}>{row.length}{row.unsafe ? ' · unsafe' : ''}</span></td>
                  <td><code className={row.rounded ? 'is-rounded' : ''}>{row.rounded ? diffDigits(row.number, row.exact) : row.number}</code>{row.rounded && <span className="pr-note">rounded</span>}</td>
                  <td><code>{row.next}</code>{row.next !== row.exactNext && <span className="pr-note">should be {row.exactNext}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pr-verdicts">
            <div className={`pr-verdict ${res.buggyOk ? 'is-ok' : 'is-bad'}`} data-testid="verdict-buggy">
              <span className="pr-vlabel">Buggy · 15-digit chunks with Number</span>
              <strong>remainder {res.buggy} → {res.buggyOk ? 'accepted' : 'rejected'}</strong>
            </div>
            <div className={`pr-verdict ${res.fixedOk ? 'is-ok' : 'is-bad'}`} data-testid="verdict-fixed">
              <span className="pr-vlabel">Fixed · <code>BigInt(digits) % 97n</code></span>
              <strong>remainder {res.fixed} → {res.fixedOk ? 'accepted' : 'rejected'}</strong>
            </div>
            <div className="pr-max"><span className="pr-vlabel">Number.MAX_SAFE_INTEGER</span><code>9,007,199,254,740,991</code><span>16 digits. Above it, JavaScript silently rounds.</span></div>
          </div>
          <p className="sr-only" aria-live="polite">{groupIban(res.iban)}: buggy method {res.buggyOk ? 'accepts' : 'rejects'}, BigInt {res.fixedOk ? 'accepts' : 'rejects'}.</p>
        </>
      )}
    </div>
  )
}

// ── Mission 5: quests ───────────────────────────────────────────────────────
export function QuestPicker() {
  const [sel, setSel] = useState(QUESTS[0].id)
  const q = QUESTS.find((x) => x.id === sel)
  return (
    <div className="quests">
      <div className="quest-grid">
        {QUESTS.map((x) => (
          <button key={x.id} type="button" className={`quest-card ${sel === x.id ? 'is-sel' : ''}`} onClick={() => setSel(x.id)} aria-pressed={sel === x.id}>
            <span className="quest-emoji" aria-hidden="true">{x.emoji}</span>
            <strong>{x.name}</strong>
            <span className="quest-meta">about {x.minutes} min · {x.tags.join(' · ')}</span>
          </button>
        ))}
      </div>
      <div className="quest-detail" aria-live="polite">
        <h3><span aria-hidden="true">{q.emoji}</span> {q.name}</h3>
        <p className="quest-blurb">{q.blurb}</p>
        {q.steps.map((s, i) => (s.prompt ? <PromptCard key={i} text={s.prompt} /> : <p key={i} className="quest-step"><Rich text={s.text} /></p>))}
      </div>
    </div>
  )
}

// ── Prompt recipe builder ───────────────────────────────────────────────────
export function RecipeBuilder() {
  const [parts, setParts] = useState(() => Object.fromEntries(RECIPE.map((r) => [r.id, r.options[0]])))
  const assembled = RECIPE.map((r) => parts[r.id].trim()).filter(Boolean).join(' ')
  return (
    <div className="recipe">
      <div className="recipe-rows">
        {RECIPE.map((r, i) => (
          <div key={r.id} className={`recipe-row is-${r.id}`}>
            <div className="recipe-name"><span>{i + 1}</span><strong>{r.name}</strong><em>{r.hint}</em></div>
            <div className="recipe-opts">
              {r.options.map((o) => <button key={o} type="button" className={parts[r.id] === o ? 'is-sel' : ''} onClick={() => setParts((p) => ({ ...p, [r.id]: o }))}>{o}</button>)}
            </div>
            <input aria-label={r.name} value={parts[r.id]} onChange={(e) => setParts((p) => ({ ...p, [r.id]: e.target.value }))} spellCheck="false" />
          </div>
        ))}
      </div>
      <div className="recipe-out">
        <PromptCard text={assembled} label="Your prompt" />
        <div className="recipe-legend">{RECIPE.map((r) => <span key={r.id} className={`is-${r.id}`}>{r.name}</span>)}</div>
      </div>
    </div>
  )
}

// ── Mission 6: ship pipeline ────────────────────────────────────────────────
export function ShipPipeline({ active }) {
  const motion = useContext(MotionContext)
  const [lit, setLit] = useState(PIPELINE.length)
  useEffect(() => {
    if (!active || !motion) { setLit(PIPELINE.length); return undefined }
    setLit(0)
    const t = setInterval(() => setLit((n) => (n >= PIPELINE.length + 2 ? 0 : n + 1)), 900)
    return () => clearInterval(t)
  }, [active, motion])
  return (
    <div className="pipeline">
      <div className="pl-zones"><span className="is-vscode"><Octicon name="file-code" size={14} />Your laptop · VS Code</span><span className="is-github"><Octicon name="mark-github" size={14} />github.com</span></div>
      <ol className="pl-track">
        {PIPELINE.map((p, i) => (
          <li key={p.id} className={`pl-node ${i < lit ? 'is-lit' : ''} ${i === lit - 1 ? 'is-now' : ''} is-${p.where === 'VS Code' ? 'vscode' : 'github'}`}>
            <span className="pl-dot"><Octicon name={p.icon} size={22} /></span>
            <span className="pl-name">{p.name}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export function CloudCard() {
  return (
    <div className="cloud-card">
      <span className="cloud-kicker"><Octicon name="dependabot" size={16} />While you were working…</span>
      <h4>Copilot cloud agent took <code>WGB-106</code></h4>
      <p>An issue for scheduled transfers was assigned to Copilot during the welcome. It worked in the cloud and opened a pull request. Same review, same CI.</p>
      {CLOUD_PR_URL
        ? <a className="btn btn-sm" href={CLOUD_PR_URL} target="_blank" rel="noreferrer"><Octicon name="git-pull-request" size={16} />Open the pull request</a>
        : <span className="cloud-live"><span className="live-dot" />Shown live</span>}
      <p className="cloud-foot">Recurring work? <code>/automate</code> sets up an automation.</p>
    </div>
  )
}
