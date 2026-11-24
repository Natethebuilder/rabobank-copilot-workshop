import { createContext, Fragment, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import qrcode from 'qrcode-generator'
import { OCTICONS } from './octicons.js'
import { LINK_LABELS, LINKS, SHORTCUTS, STORAGE_PREFIX, TICKETS } from '../content.js'

export const BASE = import.meta.env.BASE_URL

export const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}:${key}`)
      return raw == null ? fallback : JSON.parse(raw)
    } catch { return fallback }
  },
  set(key, value) {
    try { localStorage.setItem(`${STORAGE_PREFIX}:${key}`, JSON.stringify(value)) } catch { /* storage unavailable */ }
  },
}

export function Octicon({ name, size = 16, className = '', title }) {
  const icon = OCTICONS[name] || OCTICONS.copilot
  return (
    <svg className={`octicon ${className}`} viewBox={icon.vb} width={size} height={size} fill="currentColor" aria-hidden={title ? undefined : 'true'} role={title ? 'img' : undefined}>
      {title && <title>{title}</title>}
      {icon.d.map((d) => <path key={d.slice(0, 24)} d={d} />)}
    </svg>
  )
}

// ── Operating system (changes every shortcut) ───────────────────────────────
const OSContext = createContext({ os: 'win', setOs: () => {} })

export function detectOs() {
  const p = navigator.userAgentData?.platform || navigator.platform || navigator.userAgent || ''
  return /mac|iphone|ipad/i.test(p) ? 'mac' : 'win'
}

export function OSProvider({ children }) {
  const [os, setOsState] = useState(() => store.get('os', null) || detectOs())
  const setOs = useCallback((v) => { setOsState(v); store.set('os', v) }, [])
  const value = useMemo(() => ({ os, setOs }), [os, setOs])
  return <OSContext.Provider value={value}>{children}</OSContext.Provider>
}

export const useOs = () => useContext(OSContext)

const BOTH = { os: 'both', setOs: () => {} }
export const BothOs = ({ children }) => <OSContext.Provider value={BOTH}>{children}</OSContext.Provider>

export function OsToggle({ className = '' }) {
  const { os, setOs } = useOs()
  return (
    <div className={`seg ${className}`} role="group" aria-label="Keyboard shortcuts for">
      <button type="button" aria-pressed={os === 'win'} onClick={() => setOs('win')}>Windows</button>
      <button type="button" aria-pressed={os === 'mac'} onClick={() => setOs('mac')}>macOS</button>
    </div>
  )
}

function splitKeys(value, os) {
  if (os === 'mac') {
    const m = value.match(/^([⌃⌘⇧⌥]*)(.*)$/)
    return [...m[1], m[2]].filter(Boolean)
  }
  return value.split('+')
}

export function Keys({ id, os: forced }) {
  const { os: ctx } = useOs()
  const os = forced || ctx
  const sc = SHORTCUTS[id]
  if (!sc) return null
  if (os === 'both') {
    if (sc.win === sc.mac) return <Keys id={id} os="win" />
    return <span className="keys-both"><Keys id={id} os="win" /><span className="keys-or">/</span><Keys id={id} os="mac" /></span>
  }
  const parts = splitKeys(sc[os], os)
  return (
    <span className="keys" data-shortcut={id} title={sc.label}>
      {parts.map((p, i) => <kbd key={`${p}${i}`}>{p}</kbd>)}
    </span>
  )
}

// ── Inline markup ───────────────────────────────────────────────────────────
const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\[\[[^\]]+\]\]|\{k:[a-zA-Z]+\}|\{link:[a-zA-Z]+(?:\|[^}]+)?\})/g

export function Rich({ text }) {
  if (typeof text !== 'string') return text ?? null
  const parts = text.split(TOKEN)
  return parts.map((part, i) => {
    if (!part) return null
    if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.startsWith('`')) { const c = part.slice(1, -1); return <code key={i} className={c.length <= 24 ? 'nowrap' : undefined}>{c}</code> }
    if (part.startsWith('[[')) return <span key={i} className="ui-chip">{part.slice(2, -2)}</span>
    if (part.startsWith('{k:')) return <Keys key={i} id={part.slice(3, -1)} />
    if (part.startsWith('{link:')) {
      const [key, label] = part.slice(6, -1).split('|')
      return <a key={i} href={LINKS[key]} target="_blank" rel="noreferrer">{label || LINK_LABELS[key]}</a>
    }
    return <Fragment key={i}>{part}</Fragment>
  })
}

// ── Clipboard ───────────────────────────────────────────────────────────────
export async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch { /* fall through to the legacy path */ }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    ta.remove()
    return ok
  } catch { return false }
}

function selectContents(el) {
  if (!el) return
  const range = document.createRange()
  range.selectNodeContents(el)
  const sel = window.getSelection()
  sel.removeAllRanges()
  sel.addRange(range)
}

export function CopyButton({ text, target, label = 'Copy', className = '' }) {
  const [state, setState] = useState('idle')
  const { os } = useOs()
  const timer = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])
  const onClick = async () => {
    const ok = await copyText(text)
    if (!ok) selectContents(target?.current)
    setState(ok ? 'done' : 'manual')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setState('idle'), ok ? 1600 : 4000)
  }
  const shown = state === 'done' ? 'Copied' : state === 'manual' ? `Press ${os === 'mac' ? '⌘C' : 'Ctrl+C'}` : label
  return (
    <button type="button" className={`copy-btn is-${state} ${className}`} onClick={onClick} aria-label={state === 'idle' ? `${label}: ${text.slice(0, 60)}` : shown}>
      <Octicon name={state === 'done' ? 'check16' : 'copy16'} size={14} />
      <span aria-live="polite">{shown}</span>
    </button>
  )
}

export function PromptCard({ text, label = 'Prompt', mode, className = '' }) {
  const ref = useRef(null)
  return (
    <figure className={`prompt ${className}`}>
      <figcaption>
        <span className="prompt-label"><Octicon name="copilot16" size={14} />{label}</span>
        {mode && <span className="prompt-mode">{mode}</span>}
        <CopyButton text={text} target={ref} />
      </figcaption>
      <pre ref={ref}>{text}</pre>
    </figure>
  )
}

export function CodeCard({ text, label }) {
  const ref = useRef(null)
  return (
    <figure className="prompt is-code">
      <figcaption>
        <span className="prompt-label"><Octicon name="file-code" size={14} />{label}</span>
        <CopyButton text={text} target={ref} />
      </figcaption>
      <pre ref={ref}>{text}</pre>
    </figure>
  )
}

// ── QR code (qrcode-generator, MIT) ─────────────────────────────────────────
export function Qr({ text, className = '', label }) {
  const { n, d } = useMemo(() => {
    const q = qrcode(0, 'M')
    q.addData(text)
    q.make()
    const count = q.getModuleCount()
    let path = ''
    for (let r = 0; r < count; r++) for (let c = 0; c < count; c++) if (q.isDark(r, c)) path += `M${c} ${r}h1v1h-1z`
    return { n: count, d: path }
  }, [text])
  return (
    <svg className={`qr ${className}`} viewBox={`-2 -2 ${n + 4} ${n + 4}`} role="img" aria-label={label || `QR code: ${text}`} shapeRendering="crispEdges">
      <rect x="-2" y="-2" width={n + 4} height={n + 4} rx="1.5" fill="#fff" />
      <path d={d} fill="#0d1117" />
    </svg>
  )
}

export function Mascot({ className = '' }) {
  return (
    <span className={`mascot ${className}`}>
      <img src={`${BASE}copilot-mascot.png`} alt="GitHub Copilot mascot" draggable="false" />
    </span>
  )
}

export function Brand({ compact = false }) {
  return (
    <span className={`brand ${compact ? 'is-compact' : ''}`}>
      <span className="brand-mark"><Octicon name="copilot" size={18} /></span>
      <span>Rabobank <span className="brand-x">×</span> GitHub Copilot</span>
    </span>
  )
}

export function useHash() {
  const [hash, setHash] = useState(() => window.location.hash || '#/')
  useEffect(() => {
    const on = () => setHash(window.location.hash || '#/')
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return hash
}

export function TicketBox({ id, className = '' }) {
  const t = TICKETS.find((x) => x.id === id)
  if (!t) return null
  return (
    <aside className={`ticket-box is-${t.type} ${className}`} aria-label={`Ticket ${t.id}`}>
      <p className="tb-head"><code>{t.id}</code><span className="tb-type">{t.type}</span><strong>{t.title}</strong></p>
      <p className="tb-about">{t.about}</p>
      <p className="tb-done"><b>Done when:</b> {t.done}</p>
      <p className="tb-file">Full ticket: <code>docs/tickets/{t.id}.md</code></p>
    </aside>
  )
}
