import { AGENDA, EVENT, LINKS, MISSIONS, QUESTS, READY, SECTIONS } from '../content.js'
import Backdrop, { MotionToggle, useMotionPreference } from '../ui/Backdrop.jsx'
import { Brand, Mascot, Octicon, OsToggle, Rich } from '../ui/ui.jsx'
import './site.css'

export function SiteNav({ current }) {
  const links = [['#/lab', 'Guide', 'lab'], ['#/deck', 'Deck', 'deck'], ['#/cheatsheet', 'Cheat sheet', 'cheatsheet']]
  return (
    <header className="site-nav">
      <a href="#/" className="site-home" aria-label="Workshop home"><Brand compact /></a>
      <nav aria-label="Workshop">
        {links.map(([href, label, id]) => <a key={id} href={href} aria-current={current === id ? 'page' : undefined}>{label}</a>)}
      </nav>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-foot">
      <p><strong>{EVENT.cobrand}</strong> · {EVENT.fullTitle} · {EVENT.date} · {EVENT.time}</p>
      <p>Woodgrove Bank is fictional; all people, accounts and keys in the lab are fake. {EVENT.facts}</p>
      <p><a href={LINKS.lab} target="_blank" rel="noreferrer">Lab repository</a> · <a href={LINKS.quickstart} target="_blank" rel="noreferrer">VS Code agents quickstart</a> · <a href={LINKS.skillsCourse} target="_blank" rel="noreferrer">GitHub Skills course</a></p>
    </footer>
  )
}

export default function Home() {
  const [motion, setMotion] = useMotionPreference()
  return (
    <div className="site">
      <SiteNav current="home" />
      <section className="hero">
        <Backdrop enabled={motion} variant="hero" />
        <div className="hero-mascot"><Mascot className="is-hero" /></div>
        <div className="hero-text">
          <div className="pills">
            <span className="pill pill-brand"><Octicon name="copilot" size={16} />{EVENT.cobrand}</span>
            <span className="pill">{EVENT.format}</span>
          </div>
          <h1 className="display">Zero to <em>pull request</em> <span className="nowrap">in 30 minutes</span></h1>
          <p className="hero-when"><Octicon name="north-star" size={18} />{EVENT.date} · <strong>{EVENT.time}</strong></p>
          <p className="hero-lede">{EVENT.tagline} You’ll explore, write, fix, teach and ship on a fictional bank’s payment service, on your own laptop, with nothing extra to install.</p>
          <div className="hero-cta">
            <a className="btn btn-primary" href="#/lab"><Octicon name="checklist" size={18} />Open the participant guide</a>
            <a className="btn" href="#/deck"><Octicon name="graph" size={18} />Deck</a>
            <a className="btn" href="#/cheatsheet"><Octicon name="book" size={18} />Cheat sheet</a>
          </div>
          <MotionToggle enabled={motion} onToggle={() => setMotion((v) => !v)} />
        </div>
      </section>

      <main className="site-main">
        <section className="block" aria-labelledby="h-ready">
          <div className="block-head">
            <span className="kicker">Before you arrive</span>
            <h2 id="h-ready">Five minutes of <em>setup</em></h2>
            <p>Do this before the session if you can. Shortcuts follow your system: <OsToggle /></p>
          </div>
          <ol className="ready-list">
            {READY.map((r, i) => (
              <li key={r.title}>
                <span className="ready-num">{i + 1}</span>
                <div><h3>{r.title}</h3><p><Rich text={r.text} /></p>{r.note && <p className="ready-note"><Rich text={r.note} /></p>}</div>
              </li>
            ))}
          </ol>
        </section>

        <section className="block" aria-labelledby="h-agenda">
          <div className="block-head">
            <span className="kicker">Agenda</span>
            <h2 id="h-agenda">Thirty minutes, <em>six missions</em></h2>
            <p>All times are Central European Time.</p>
          </div>
          <ol className="agenda">
            {AGENDA.map((a) => (
              <li key={a.time} style={{ '--c': SECTIONS[a.section].color }}>
                <time>{a.time} CET</time>
                <div><h3>{a.title}</h3><p>{a.text}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section className="block" aria-labelledby="h-learn">
          <div className="block-head">
            <span className="kicker">What you’ll learn</span>
            <h2 id="h-learn">From your first question to a <em>reviewed pull request</em></h2>
          </div>
          <div className="learn">
            {MISSIONS.map((m) => (
              <article key={m.id} className={`learn-card sec-${m.section}`}>
                <span className="learn-icon"><Octicon name={m.icon} size={22} /></span>
                <span className="learn-n">Mission {m.n} · {m.time} CET</span>
                <h3>{m.name}</h3>
                <p>{m.goal}</p>
              </article>
            ))}
          </div>
          <p className="learn-quests">Mission 5 quests: {QUESTS.map((q) => <span key={q.id} className="tag">{q.emoji} {q.name.split(':')[0]}</span>)}</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
