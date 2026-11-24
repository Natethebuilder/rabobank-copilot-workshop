import { CHAT_CONTROLS, CONTROL, CUSTOMIZATIONS, EVENT, FIRST_WEEK, FIVE_MOVES, LINK_LABELS, LINKS, MISSIONS, OUTER_LOOP, QUESTS, RECIPE, SHORTCUTS, SLASH } from '../content.js'
import { CopyButton, Keys, Octicon, Qr, Rich } from '../ui/ui.jsx'
import './site.css'

const prompts = [
  ...MISSIONS.flatMap((m) => m.steps.filter((s) => s.prompt && !s.label).map((s) => ({ where: `M${m.n} ${m.shortName || m.name}`, text: s.prompt }))),
  ...QUESTS.flatMap((q) => q.steps.filter((s) => s.prompt).map((s) => ({ where: `Quest ${q.name.split(':')[0]}`, text: s.prompt }))),
]

function Box({ title, icon, children, className = '' }) {
  return (
    <section className={`cs-box ${className}`}>
      <h2><Octicon name={icon} size={16} />{title}</h2>
      {children}
    </section>
  )
}

export default function Cheatsheet() {
  return (
    <div className="cs-wrap">
      <div className="cs-tools no-print">
        <a href="#/" className="btn btn-sm">← Home</a>
        <a href="#/lab" className="btn btn-sm">Guide</a>
        <button type="button" className="btn btn-sm btn-primary" onClick={() => window.print()}><Octicon name="file-code" size={14} />Print or save as PDF</button>
      </div>
      <article className="cs">
        <header className="cs-head">
          <div>
            <span className="cs-kicker"><Octicon name="copilot" size={16} />GitHub Copilot in VS Code · Cheat sheet</span>
            <h1>An introduction to <em>GitHub Copilot</em> <span className="nowrap">in VS Code</span></h1>
            <p>{EVENT.cobrand} · {EVENT.date} · {EVENT.time} · {EVENT.facts}</p>
          </div>
          <Qr text={LINKS.guide} className="cs-qr" label="QR code to the participant guide" />
        </header>

        <div className="cs-grid">
          <Box title="Shortcuts" icon="zap">
            <table className="cs-table">
              <thead><tr><th>Action</th><th>Windows</th><th>macOS</th></tr></thead>
              <tbody>{Object.entries(SHORTCUTS).map(([id, s]) => <tr key={id}><td>{s.label}</td><td><Keys id={id} os="win" /></td><td><Keys id={id} os="mac" /></td></tr>)}</tbody>
            </table>
          </Box>

          <Box title="Setup" icon="terminal">
            <p>Command Palette → <span className="ui-chip">Git: Clone</span> → <span className="ui-chip">Clone from GitHub</span> → open your copy · <code>npm install</code> · <code>npm test</code> (no Node: open <code>tests/index.html</code>).</p>
          </Box>

          <Box title="Chat controls" icon="copilot">
            <ul className="cs-list">{CHAT_CONTROLS.map((c) => <li key={c.label}><b>{c.label}: {c.value}.</b> {c.note}</li>)}</ul>
            <ul className="cs-list cs-slash">{SLASH.map((s) => <li key={s.cmd}><code>{s.cmd}</code> {s.text}</li>)}</ul>
          </Box>

          <Box title="The prompt recipe" icon="checklist">
            <ol className="cs-list cs-recipe">{RECIPE.map((r) => <li key={r.id}><b>{r.name}.</b> {r.hint}</li>)}</ol>
            <p className="cs-example">“Fix the bug in docs/tickets/WGB-101.md. Start from #src/iban.js. Don’t change the public API. Write a failing test first, then run node tests/run.js.”</p>
          </Box>

          <Box title="Context with #" icon="file-code">
            <p>Type <code>#</code> in chat (or select <span className="ui-chip">Add Context</span>) to attach files, symbols, errors or test output. Name the files that matter; Copilot lists what it read under the answer.</p>
          </Box>

          <Box title="Review and recover" icon="shield-check">
            <ul className="cs-list">
              {CONTROL.permissions.map((p) => <li key={p.id}><b>{p.name}.</b> {p.text}</li>)}
              <li><b>Approval prompt.</b> <span className="ui-chip">Allow Once</span> or <span className="ui-chip">Skip</span>; save it <span className="ui-chip">In this Session</span> or <span className="ui-chip">Always Allow</span>.</li>
              <li><b>Keep / Undo</b> per change, per file or all.</li>
              <li><b>Restore Checkpoint</b> on an earlier request restores files and chat (not terminal commands or external changes).</li>
              <li><b>Steer with Message</b>, <b>Stop and Send</b>, <b>Stop</b>.</li>
              <li>Organisation policy always wins.</li>
            </ul>
          </Box>

          <Box title="Customizations" icon="tools">
            <ul className="cs-list">{CUSTOMIZATIONS.map((c) => <li key={c.name}><b>{c.name}.</b> <Rich text={c.text} /></li>)}</ul>
          </Box>

          <Box title="The outer loop on github.com" icon="mark-github">
            <ul className="cs-list">
              <li><b>Ship.</b> Source Control → ✨ <span className="ui-chip">Generate commit message</span> → <span className="ui-chip">Commit</span> → <span className="ui-chip">Publish Branch</span>, or ask the agent.</li>
              {OUTER_LOOP.map((c) => <li key={c.name}><b>{c.name}.</b> <Rich text={c.text} /></li>)}
            </ul>
          </Box>

          <Box title="Five moves to keep" icon="north-star">
            <ol className="cs-list cs-moves">{FIVE_MOVES.map((m) => <li key={m.title}><b>{m.title}</b> <Rich text={m.text} /></li>)}</ol>
            <p className="cs-week"><b>First week:</b> {FIRST_WEEK.map((d) => `${d.day}: ${d.text}`).join(' · ')}</p>
          </Box>

          <Box title="Workshop prompts" icon="copilot" className="cs-prompts">
            <ol>
              {prompts.map((p) => (
                <li key={p.text}>
                  <span className="cs-where">{p.where}</span>
                  <code>{p.text}</code>
                  <CopyButton text={p.text} className="no-print" />
                </li>
              ))}
            </ol>
          </Box>

          <Box title="Links" icon="globe">
            <ul className="cs-list cs-links">
              {['guide', 'lab', 'quickstart', 'skillsCourse', 'copilotDocs'].map((k) => <li key={k}><b>{LINK_LABELS[k]}</b> <a href={LINKS[k]}>{LINKS[k].replace(/^https:\/\//, '')}</a></li>)}
            </ul>
          </Box>
        </div>
      </article>
    </div>
  )
}
