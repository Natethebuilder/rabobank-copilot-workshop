// ─────────────────────────────────────────────────────────────────────────────
// One content file for the home page, deck, presenter notes, participant guide
// and cheat sheet, so they never drift. Edit here; every route updates.
//
// Inline markup used in strings (see ui/Rich.jsx):
//   **bold**   `code`   [[UI chip]]   {k:shortcutId}   {link:LINKS key|label}
// ─────────────────────────────────────────────────────────────────────────────

// Optional: paste the URL of the cloud agent pull request (WGB-106) here before
// the session to show it on the "Ship" slide. Leave empty to present it live.
export const CLOUD_PR_URL = ''

export const STORAGE_PREFIX = 'rcw'

export const EVENT = {
  cobrand: 'Rabobank × GitHub Copilot',
  title: 'Zero to',
  highlight: 'pull request',
  tail: 'in 30 minutes',
  fullTitle: 'Zero to pull request in 30 minutes',
  format: 'Hands-on · VS Code',
  date: 'Wednesday 25 November 2026',
  time: '10:05–10:35 CET',
  tagline: 'A hands-on GitHub Copilot workshop in VS Code for first-time users.',
  audience: 'For Rabobank engineers using GitHub Copilot in VS Code for the first time.',
  facts: 'Product facts as of VS Code 1.147 (18 November 2026).',
}

export const LINKS = {
  site: 'https://natethebuilder.github.io/rabobank-copilot-workshop/',
  guide: 'https://natethebuilder.github.io/rabobank-copilot-workshop/#/lab',
  cheatsheet: 'https://natethebuilder.github.io/rabobank-copilot-workshop/#/cheatsheet',
  lab: 'https://github.com/Natethebuilder/woodgrove-transfers',
  labClone: 'https://github.com/Natethebuilder/woodgrove-transfers.git',
  quickstart: 'https://code.visualstudio.com/docs/agents/quickstart',
  skillsCourse: 'https://github.com/skills/getting-started-with-github-copilot',
  copilotDocs: 'https://code.visualstudio.com/docs/copilot/overview',
}

export const LINK_LABELS = {
  site: 'Workshop site',
  guide: 'Participant guide',
  cheatsheet: 'Cheat sheet',
  lab: 'Woodgrove Transfers lab',
  quickstart: 'VS Code agents quickstart',
  skillsCourse: 'GitHub Skills: Getting started with GitHub Copilot',
  copilotDocs: 'GitHub Copilot in VS Code docs',
}

// ── Shortcuts (Windows / macOS) ─────────────────────────────────────────────
export const SHORTCUTS = {
  chatView: { label: 'Open the Chat view', win: 'Ctrl+Alt+I', mac: '⌃⌘I' },
  newChat: { label: 'New chat (in the Chat view)', win: 'Ctrl+N', mac: '⌘N' },
  inlineChat: { label: 'Inline chat (editor and terminal)', win: 'Ctrl+I', mac: '⌘I' },
  quickChat: { label: 'Quick Chat', win: 'Ctrl+Shift+Alt+L', mac: '⇧⌥⌘L' },
  palette: { label: 'Command Palette', win: 'Ctrl+Shift+P', mac: '⇧⌘P' },
  accept: { label: 'Accept a suggestion', win: 'Tab', mac: 'Tab' },
  dismiss: { label: 'Dismiss a suggestion', win: 'Esc', mac: 'Esc' },
  acceptWord: { label: 'Accept the next word', win: 'Ctrl+→', mac: '⌘→' },
}

export const CHAT_CONTROLS = [
  { label: 'Session Target', value: 'Copilot', note: 'Runs on your laptop. Cloud runs the session on GitHub.' },
  { label: 'Agent', value: 'Agent', note: 'Use Ask where a mission says so.' },
  { label: 'Model', value: 'Auto', note: 'Copilot picks a suitable model.' },
  { label: 'Permissions', value: 'Manual permissions', note: 'You approve actions before they run.' },
]

// ── Run of show ─────────────────────────────────────────────────────────────
export const AGENDA = [
  { time: '10:05–10:08', title: 'Welcome', text: 'Copilot from autocomplete to agents, two loops, you stay in control, meet Woodgrove Transfers', section: 'welcome' },
  { time: '10:08–10:11', title: 'Mission 1 · Explore', text: 'Ask for a tour of a codebase you have never seen', section: 'inner', mission: 'explore' },
  { time: '10:11–10:13', title: 'Mission 2 · Write', text: 'Inline suggestions, next edit suggestions and inline chat', section: 'inner', mission: 'write' },
  { time: '10:13–10:18', title: 'Mission 3 · Fix', text: 'Fix a real precision bug test-first with the agent', section: 'inner', mission: 'fix' },
  { time: '10:18–10:21', title: 'Mission 4 · Teach', text: 'House rules in custom instructions, then a feature', section: 'inner', mission: 'teach' },
  { time: '10:21–10:27', title: 'Mission 5 · Choose your quest', text: 'Build, secure, test, translate, document or automate', section: 'quest', mission: 'quest' },
  { time: '10:27–10:32', title: 'Mission 6 · Ship', text: 'Branch, commit, push, pull request, Copilot code review, CI', section: 'outer', mission: 'ship' },
  { time: '10:32–10:35', title: 'Wrap', text: 'Five moves to keep, your first-week plan, Q&A', section: 'wrap' },
]

// ── Ready check ─────────────────────────────────────────────────────────────
export const READY = [
  {
    title: 'VS Code is up to date and Git works',
    text: 'Help → **Check for Updates** (1.147 or later). Git is installed and works in the terminal.',
  },
  {
    title: 'Signed in to GitHub Copilot',
    text: 'The Copilot icon in the Status Bar shows no warning, and the Chat view opens with {k:chatView}.',
  },
  {
    title: 'Your own copy of the lab',
    text: 'Open {link:lab|Natethebuilder/woodgrove-transfers} → [[Use this template]] → [[Create a new repository]] → owner: you (or your team’s sandbox organisation) → [[Private]] → [[Create repository]]. In VS Code: Command Palette ({k:palette}) → [[Git: Clone]] → paste your copy’s URL → open it and select [[Trust]].',
    note: 'No permission to create a repository? Clone `https://github.com/Natethebuilder/woodgrove-transfers` directly, do Missions 1–5, and follow Mission 6 on screen.',
  },
  {
    title: 'Check the chat controls',
    text: 'In the Chat view, start a new chat ({k:newChat}) and check: [[Session Target: Copilot]] [[Agent]] [[Auto]] [[Manual permissions]]. Use [[Ask]] where a mission says so.',
  },
  {
    title: 'Run the tests once',
    text: 'Run `node tests/run.js` in the terminal, or open `tests/index.html` in a browser if Node isn’t installed. Everything is green: **✓ 30 passed**.',
  },
]

// ── Missions ────────────────────────────────────────────────────────────────
// Step kinds: { text } · { prompt } · { code, lang } · { tip }
export const HOUSE_RULES = `# Woodgrove Transfers house rules

- Money is always an integer number of cents. Never use floating-point euros.
- Show amounts to customers with formatAmount from src/money.js, for example € 1.234,56.
- Never log or return full IBANs or customer names. Mask IBANs with maskIban from src/iban.js.
- Validation errors have an UPPER_SNAKE_CASE code, such as INVALID_AMOUNT, and a plain-English message.
- Every behaviour change comes with tests in tests/. Run them with node tests/run.js, or open tests/index.html if Node isn't installed.
- Keep the UMD wrapper in every file in src/, so the code runs in the browser and in Node without a build step. Add no dependencies.`

export const PROMPTS = {
  tour: 'Give me a two-minute tour of this repository: what the service does, how a transfer flows through the code, and how to run the tests.',
  explain: 'Explain how isValidIban in src/iban.js works, step by step, using NL91 ABNA 0417 1643 00 as the example.',
  maskComment: '// Mask an IBAN for logs: keep the country code and the last four characters',
  maskStart: 'function maskIban(',
  inline: 'Return an empty string for empty input and add a one-line JSDoc comment.',
  fix: 'Customers report the bug in docs/tickets/WGB-101.md. Find the root cause and write a failing regression test first. Then fix it without changing the public API, and run the tests to prove it. If Node isn\'t installed, open tests/index.html in the integrated browser to run them.',
  fixFollowUp: 'Explain the root cause as if I\'m new to JavaScript.',
  fee: 'Implement docs/tickets/WGB-104.md.',
  ship: 'Create a branch named workshop/<your-name>, commit my changes in small commits with clear messages, push the branch and open a pull request that explains what changed and how it was tested.',
}

export const MISSIONS = [
  {
    id: 'explore', n: 1, name: 'Explore', mode: 'Ask', time: '10:08–10:11', minutes: 3, section: 'inner', icon: 'eye',
    headline: ['Ask before you', 'change'],
    goal: 'Get a guided tour of a codebase you have never seen, without changing a single file.',
    steps: [
      { text: 'Switch the agent picker to [[Ask]]. It answers without editing files.' },
      { prompt: PROMPTS.tour },
      { prompt: PROMPTS.explain },
      { tip: 'Type `#` to attach a file or symbol as context.' },
    ],
    see: ['The files Copilot read are listed under the answer.', 'Ask didn’t change anything: no edits, no commands.'],
    stuck: [
      'No Chat view? Press {k:chatView}, or select the Copilot icon in the title bar.',
      'Answer feels generic? Make sure the woodgrove-transfers folder is open as your workspace.',
    ],
  },
  {
    id: 'write', n: 2, name: 'Write', mode: 'Editor', time: '10:11–10:13', minutes: 2, section: 'inner', icon: 'pencil',
    headline: ['Let', 'Tab', 'type'],
    goal: 'Feel inline suggestions, next edit suggestions and inline chat while you type.',
    steps: [
      { text: 'Open `src/iban.js`. Inside the factory function, just above the `return {` line, type this comment and press Enter:' },
      { prompt: PROMPTS.maskComment, label: 'Type this comment' },
      { text: 'Then type `function maskIban(` and wait for grey ghost text. Press {k:accept} to accept ({k:acceptWord} accepts one word at a time).' },
      { text: 'Add `maskIban` to the returned object. A next edit suggestion may offer it: look for the arrow in the gutter and press {k:accept}.' },
      { text: 'Select the new function, press {k:inlineChat} (inline chat) and enter:' },
      { prompt: PROMPTS.inline },
    ],
    see: ['Grey ghost text that {k:accept} accepts and {k:dismiss} dismisses.', 'An arrow in the gutter for the next edit.', 'An inline diff you can [[Keep]] or [[Undo]].'],
    stuck: [
      'No ghost text? Check the Copilot icon in the Status Bar: completions may be snoozed or turned off for JavaScript.',
      'Ghost text looks different from ours? That’s normal: suggestions vary. Accept what looks right and edit it.',
    ],
  },
  {
    id: 'fix', n: 3, name: 'Fix', mode: 'Agent', time: '10:13–10:18', minutes: 5, section: 'inner', icon: 'bug',
    headline: ['Fix it', 'test-first'],
    goal: 'Let the agent find a real bug, prove it with a failing test, fix it and prove the fix.',
    steps: [
      { text: 'Switch the agent picker back to [[Agent]].' },
      { prompt: PROMPTS.fix },
      { text: 'When an approval prompt appears, read it, then select [[Allow Once]].' },
      { text: 'Review the diff and select [[Keep]] (or [[Undo]]). Hover over your request to see [[Restore Checkpoint]].' },
      { text: 'Optional follow-up:' },
      { prompt: PROMPTS.fixFollowUp },
    ],
    see: ['An approval prompt before any command runs.', 'Red, then green: a new failing regression test, then every test passing again (more than the 30 you started with).', 'A small fix in `src/iban.js`; the public API is unchanged.'],
    stuck: [
      'The agent can’t run Node? Let it open `tests/index.html` in the integrated browser, or open it yourself from the Explorer.',
      'Went off track? Use [[Restore Checkpoint]] on your request and try again with more detail.',
    ],
  },
  {
    id: 'teach', n: 4, name: 'Teach', mode: 'Agent', time: '10:18–10:21', minutes: 3, section: 'inner', icon: 'mortar-board',
    headline: ['Write it down', 'once'],
    goal: 'Give Copilot your team’s house rules once, and see them shape the next feature.',
    steps: [
      { text: 'Command Palette ({k:palette}) → [[Chat: Open Customizations]] → [[Instructions]] → [[+]] next to [[Workspace]] → choose `.github/copilot-instructions.md` (or create that file directly) and paste:' },
      { code: HOUSE_RULES, lang: 'markdown', label: '.github/copilot-instructions.md' },
      { text: 'Start a **new chat** ({k:newChat}) so only the rules, not the conversation, guide it. Then enter:' },
      { prompt: PROMPTS.fee },
    ],
    see: ['Fees in integer cents, with new tests.', 'Masked IBANs in any logs.', '`copilot-instructions.md` listed under the response’s references.'],
    stuck: [
      'Rules not listed under references? Check the file is exactly `.github/copilot-instructions.md` at the root of your copy.',
      'Instructions guide the model; they don’t replace tests or review. Check the fee examples in the ticket.',
    ],
  },
  {
    id: 'quest', n: 5, name: 'Choose your quest', shortName: 'Quest', mode: 'Agent', time: '10:21–10:27', minutes: 6, section: 'quest', icon: 'north-star',
    headline: ['Choose your', 'quest'],
    goal: 'Pick one scenario (two if you’re fast) and see what Copilot can do for a real team.',
    steps: [{ text: 'Pick a quest card below. Each one has its prompts ready to copy.' }],
    see: ['A plan you can review before anything changes (Build).', 'Findings ranked by severity (Secure).', 'Your own `/sepa-review` slash command (Automate).'],
    stuck: [
      'Running out of time? Stop the session, select [[Keep]] for what you like, and move on to Mission 6.',
      'Want to change direction mid-run? Use [[Steer with Message]] instead of starting over.',
    ],
  },
  {
    id: 'ship', n: 6, name: 'Ship', mode: 'Agent', time: '10:27–10:32', minutes: 5, section: 'outer', icon: 'git-pull-request',
    headline: ['Ship it through', 'review'],
    goal: 'Take your work from your laptop to a reviewed pull request on github.com.',
    steps: [
      { prompt: PROMPTS.ship, name: true },
      { text: 'If the agent can’t open the pull request itself, open the link printed by `git push`, or select [[Compare & pull request]] on github.com.' },
      { text: 'Prefer clicks? Source Control → ✨ [[Generate commit message]] → [[Commit]] → [[Publish Branch]].' },
      { text: 'On github.com, open [[Reviewers]] and select [[Copilot]]. Read its review, reply or [[Commit suggestion]], and watch the CI check turn green.' },
    ],
    see: ['A branch `workshop/<your-name>` with small, clear commits.', 'A pull request that explains what changed and how it was tested.', 'A Copilot review and a green CI check.'],
    stuck: [
      'Push rejected? You may have cloned the public lab instead of your own copy. Follow Mission 6 on screen.',
      'Copilot not listed under Reviewers? Your organisation may not have Copilot code review enabled yet.',
    ],
  },
]

export const QUESTS = [
  {
    id: 'build', emoji: '🧩', name: 'Build: Verification of Payee', minutes: 7, tags: ['/plan', 'Agent', 'integrated browser'],
    blurb: 'Plan, then build a feature that EU banks must offer for euro transfers since 9 October 2025.',
    steps: [
      { prompt: '/plan Implement Verification of Payee as described in docs/tickets/WGB-102.md, including the transfer console.' },
      { text: 'Review the plan, then tell it to start implementing. Then:' },
      { prompt: 'Open console/index.html in the integrated browser and check the examples from the ticket.' },
    ],
  },
  {
    id: 'secure', emoji: '🔒', name: 'Secure: bank-grade review', minutes: 6, tags: ['Agent as reviewer'],
    blurb: 'Find what an auditor would find, before the audit.',
    steps: [{ prompt: 'Act as a bank security reviewer and work through docs/tickets/WGB-103.md. First list every finding with its severity and file, then fix the high-severity ones and run the tests.' }],
  },
  {
    id: 'test', emoji: '🧪', name: 'Test: hunt for untested behaviour', minutes: 5, tags: ['test generation'],
    blurb: 'Green tests don’t mean no bugs. Find what nobody tested.',
    steps: [{ prompt: 'Find the behaviour in src/transfer.js that no test covers. Write tests for those edge cases and run them. If a test exposes a real bug, explain it before you fix it.' }],
  },
  {
    id: 'translate', emoji: '☕', name: 'Translate: Java version', minutes: 4, tags: ['polyglot'],
    blurb: 'Same behaviour, another language, with tests.',
    steps: [{ prompt: 'Port src/iban.js to a Java 21 class named IbanValidator with JUnit 5 tests, in a new java/ folder. Keep the behaviour identical, then explain the main differences between the two versions.' }],
  },
  {
    id: 'document', emoji: '📄', name: 'Document: API docs and a diagram', minutes: 4, tags: ['docs', 'Mermaid'],
    blurb: 'Endpoint reference, examples, error codes and a sequence diagram.',
    steps: [{ prompt: 'Implement docs/tickets/WGB-105.md.' }],
  },
  {
    id: 'automate', emoji: '🤖', name: 'Automate: your own skill, tested with an eval', minutes: 7, tags: ['Agent Skills', 'Copilot Evals preview'],
    blurb: 'Turn a review you repeat into a reusable slash command.',
    steps: [
      { prompt: 'Create an agent skill named sepa-review in .github/skills/sepa-review. It reviews the current changes against our house rules and returns a pass/fail checklist with file and line references.' },
      { text: 'Then start a new chat and type `/sepa-review`. Optional, preview: install the **GitHub Copilot Evals** extension, then:' },
      { prompt: '/eval help me create an eval for my sepa-review skill' },
    ],
  },
]

// ── Woodgrove Transfers ─────────────────────────────────────────────────────
export const TICKETS = [
  { id: 'WGB-101', type: 'bug', title: 'Some valid French and Italian IBANs are rejected as invalid', tag: 'Mission 3 · Fix', example: 'FR14 2004 1010 0505 0001 3M02 606 · IT21 A030 6909 6061 0000 0063 789' },
  { id: 'WGB-102', type: 'feature', title: 'Verification of Payee', tag: 'Quest · Build' },
  { id: 'WGB-103', type: 'task', title: 'Security and privacy review before the audit', tag: 'Quest · Secure' },
  { id: 'WGB-104', type: 'feature', title: 'Instant transfer fee', tag: 'Mission 4 · Teach' },
  { id: 'WGB-105', type: 'docs', title: 'API documentation', tag: 'Quest · Document' },
  { id: 'WGB-106', type: 'feature', title: 'Scheduled transfers', tag: 'Cloud agent · live demo' },
]

export const SERVICE = [
  { id: 'console', name: 'console/', text: 'Transfer console UI' },
  { id: 'server', name: 'server.js', text: 'Optional Node HTTP API' },
  { id: 'transfer', name: 'src/transfer.js', text: 'validateTransfer · createTransfer' },
  { id: 'iban', name: 'src/iban.js', text: 'isValidIban · formatIban' },
  { id: 'money', name: 'src/money.js', text: 'parseAmount · formatAmount' },
  { id: 'config', name: 'src/config.js', text: 'Limits · screening config' },
  { id: 'accounts', name: 'data/accounts.js', text: 'Account directory' },
  { id: 'tests', name: 'tests/', text: 'node tests/run.js · tests/index.html' },
]

// ── Deck widgets ────────────────────────────────────────────────────────────
export const SURFACES = [
  { id: 'inline', name: 'Inline suggestions', where: 'vscode', icon: 'sparkle-fill', what: 'Grey ghost text as you type. Tab accepts, Esc dismisses.', mission: 'Mission 2 · Write' },
  { id: 'nes', name: 'Next edit suggestions', where: 'vscode', icon: 'zap', what: 'Predicts the next edit that follows from your last one, even elsewhere in the file. Look for the arrow in the gutter.', mission: 'Mission 2 · Write' },
  { id: 'inlinechat', name: 'Inline chat', where: 'vscode', icon: 'pencil', what: 'Ask for a change right where you are, in the editor or terminal. You get an inline diff to keep or undo.', mission: 'Mission 2 · Write' },
  { id: 'ask', name: 'Chat · Ask', where: 'vscode', icon: 'eye', what: 'Questions about your code. Ask answers without editing files.', mission: 'Mission 1 · Explore' },
  { id: 'agent', name: 'Chat · Agent', where: 'vscode', icon: 'agent', what: 'Plans, edits files, runs commands and tests, and iterates until the task is done, with your approval.', mission: 'Missions 3, 4 and 6' },
  { id: 'plan', name: '/plan', where: 'vscode', icon: 'checklist', what: 'Plan before building: review the steps first, then tell it to start implementing.', mission: 'Quest · Build' },
  { id: 'agents', name: 'Agents window', where: 'vscode', icon: 'workflow', what: 'Run sessions in parallel in their own worktrees, compare models and pick up drafts.', mission: 'Level up' },
  { id: 'cloud', name: 'Cloud sessions', where: 'vscode', icon: 'upload', what: 'Set Session Target to Cloud: the session runs on GitHub and keeps going when your laptop closes.', mission: 'Live demo' },
  { id: 'review', name: 'Copilot code review', where: 'github', icon: 'code-review', what: 'Request Copilot under Reviewers on a pull request. Effort Lite, Balanced (default) or Max.', mission: 'Mission 6 · Ship' },
  { id: 'cloudagent', name: 'Copilot cloud agent', where: 'github', icon: 'dependabot', what: 'Assign an issue to Copilot. It works in the cloud and opens a pull request for you to review.', mission: 'Live demo · WGB-106' },
  { id: 'automations', name: 'Automations', where: 'github', icon: 'sync', what: 'Cloud agent runs triggered manually, by events or on a schedule. Start one with /automate.', mission: 'Live demo' },
  { id: 'evals', name: 'Copilot Evals', where: 'github', icon: 'beaker', what: 'Repeatable tests for skills, agents and MCP tools. Public preview; /eval in VS Code.', mission: 'Quest · Automate' },
]

export const LOOPS = {
  inner: { name: 'Inner loop', where: 'VS Code', stations: ['Explore', 'Write', 'Fix', 'Test'] },
  outer: { name: 'Outer loop', where: 'github.com', stations: ['Pull request', 'Review', 'CI', 'Merge', 'Automate'] },
}

export const CONTROL = {
  permissions: [
    { id: 'manual', name: 'Manual permissions', badge: 'Default · today', text: 'You review every action that no rule or saved approval covers. Best while you learn.' },
    { id: 'assisted', name: 'Assisted permissions', badge: 'Model decides', text: 'A model decides which actions need your review and lets routine ones through.' },
    { id: 'all', name: 'Allow all', badge: 'Use with care', text: 'Skips ordinary confirmations. Organisation policy still applies.' },
  ],
  tabs: [
    { id: 'approve', name: 'Approve', icon: 'shield-check', title: 'Read, then approve', text: 'Before the agent runs a command it asks. Allow Once or Skip; save the approval In this Session or Always Allow.' },
    { id: 'review', name: 'Keep / Undo', icon: 'code-review', title: 'Every edit is a proposal', text: 'Review each change in the diff. Keep or Undo per change, per file or all at once.' },
    { id: 'restore', name: 'Restore', icon: 'sync', title: 'Go back in time', text: 'Restore Checkpoint on an earlier request restores files and chat. It doesn’t undo terminal commands or external changes.' },
    { id: 'steer', name: 'Stop / Steer', icon: 'north-star', title: 'Change course mid-run', text: 'Steer with Message adds guidance while it works. Stop and Send, or Stop.' },
  ],
}

export const PIPELINE = [
  { id: 'branch', name: 'Branch', icon: 'git-branch', where: 'VS Code' },
  { id: 'commit', name: 'Commit', icon: 'git-commit', where: 'VS Code' },
  { id: 'push', name: 'Push', icon: 'upload', where: 'VS Code' },
  { id: 'pr', name: 'Pull request', icon: 'git-pull-request', where: 'github.com' },
  { id: 'review', name: 'Copilot review', icon: 'copilot', where: 'github.com' },
  { id: 'ci', name: 'CI', icon: 'check-circle', where: 'github.com' },
  { id: 'merge', name: 'Merge', icon: 'git-merge', where: 'github.com' },
]

export const RECIPE = [
  { id: 'goal', name: 'Goal', hint: 'What should be true when it’s done?', options: ['Fix the bug in docs/tickets/WGB-101.md.', 'Add a feeCents field for instant transfers.', 'Explain how a transfer is validated.'] },
  { id: 'context', name: 'Context', hint: 'Which files, symbols or errors matter? Type # in chat.', options: ['Start from #src/iban.js and its tests.', 'The rules are in docs/tickets/WGB-104.md.', 'Here is the failing test output: #terminalLastCommand'] },
  { id: 'constraints', name: 'Constraints', hint: 'What must not change?', options: ['Don’t change the public API.', 'Money stays in integer cents.', 'Add no dependencies.'] },
  { id: 'check', name: 'Check', hint: 'How will it prove it worked?', options: ['Write a failing test first, then run node tests/run.js.', 'Run the tests and show me the summary.', 'Open console/index.html in the integrated browser and try the ticket’s examples.'] },
]

export const LEVEL_UP = [
  { name: 'Agent Skills', icon: 'tools', text: 'A `SKILL.md` per skill in `.github/skills/`, an open standard. Run as `/<name>`.' },
  { name: 'Custom agents', icon: 'agent', text: 'Your own personas with their own tools and instructions.' },
  { name: 'Connectors and MCP', icon: 'plug', text: 'Copilot connectors (preview, e.g. Microsoft Learn) and MCP servers bring in tools and data.' },
  { name: 'Hooks', icon: 'zap', text: 'Run your own checks around agent events.' },
  { name: 'Plugins and team defaults', icon: 'cpu', text: 'Agent plugins and marketplaces (preview). Team plugin defaults on github.com.' },
  { name: 'Copilot Evals', icon: 'beaker', text: 'Repeatable tests for skills, agents and MCP tools. Public preview; `/eval`.' },
  { name: 'Automations', icon: 'sync', text: 'Cloud agent runs on a trigger or a schedule. Start one with `/automate`.' },
  { name: 'Compare Models', icon: 'graph', text: 'Run one task on several models side by side in the Agents window (preview).' },
  { name: 'Copilot CLI', icon: 'terminal', text: 'Type `copilot` in any terminal for an agent in your shell.' },
  { name: 'Copilot Memory', icon: 'book', text: 'Remembers durable conventions across sessions.' },
]

export const FIVE_MOVES = [
  { title: 'Ask first.', text: 'Explore before you change.' },
  { title: 'Let Tab type.', text: 'Inline suggestions and next edits.' },
  { title: 'Give a goal and a check.', text: 'The agent proves its work with tests.' },
  { title: 'Write it down once.', text: 'House rules in `.github/copilot-instructions.md`.' },
  { title: 'Ship through review.', text: 'Pull request, Copilot code review, CI.' },
]

export const FIRST_WEEK = [
  { day: 'Mon', text: 'Ask for a tour of your team’s repo' },
  { day: 'Tue', text: 'Add five house rules' },
  { day: 'Wed', text: 'Fix one real bug test-first' },
  { day: 'Thu', text: 'Request Copilot code review on your next PR' },
  { day: 'Fri', text: 'Turn a task you repeat into a skill' },
]

export const CUSTOMIZATIONS = [
  { name: 'Instructions', text: '`.github/copilot-instructions.md` or `AGENTS.md`; `.github/instructions/*.instructions.md` with `applyTo`.' },
  { name: 'Agent Skills', text: '`.github/skills/<name>/SKILL.md`, run as `/<name>`.' },
  { name: 'Custom agents, hooks, MCP servers, connectors, plugins', text: 'All in [[Chat: Open Customizations]].' },
  { name: 'Remember', text: 'Instructions guide the model. They don’t apply to inline suggestions and don’t replace tests or review.' },
]

export const OUTER_LOOP = [
  { name: 'Copilot code review', text: 'Pull request → [[Reviewers]] → [[Copilot]]. Effort Lite, Balanced (default) or Max.' },
  { name: 'Copilot cloud agent', text: 'Assign an issue to Copilot; it opens a pull request for you to review.' },
  { name: 'Automations', text: 'Cloud runs triggered manually, by events or on a schedule. `/automate` in the Agents window.' },
  { name: 'Copilot Evals (preview)', text: 'VS Code extension “GitHub Copilot Evals”, then `/eval`.' },
]

export const SLASH = [
  { cmd: '/plan', text: 'Plan before you build' },
  { cmd: '/compact', text: 'Summarise a long conversation' },
  { cmd: '/fork', text: 'Branch the conversation' },
  { cmd: '/automate', text: 'Recurring work (Agents window)' },
  { cmd: '/<skill-name>', text: 'Run one of your skills' },
]

// ── Deck: slide metadata and speaker notes ──────────────────────────────────
// `slot` is the CET range for the slide; the presenter view compares the
// elapsed time with the end of the slot (10:05 CET = 0:00).
export const SECTIONS = {
  welcome: { label: 'Welcome', color: '#58a6ff' },
  inner: { label: 'Inner loop · VS Code', color: '#a371f7' },
  quest: { label: 'Quest', color: '#f778ba' },
  outer: { label: 'Outer loop · github.com', color: '#3fb950' },
  wrap: { label: 'Wrap', color: '#e3b341' },
}

export const SLIDES = [
  {
    id: 'title', title: 'Zero to pull request in 30 minutes', section: 'welcome', slot: '10:05–10:06',
    notes: [
      'Welcome. In 30 minutes you go from opening Copilot to a reviewed pull request on github.com.',
      'Scan the QR code or open the guide: it sits next to VS Code and has every prompt with a copy button.',
      'Everything runs on your own laptop. Nothing extra to install. The bank in the lab is fictional, the data is fake.',
    ],
  },
  {
    id: 'surfaces', title: 'Copilot in 2026: from autocomplete to agents', section: 'welcome', slot: '10:06–10:07',
    notes: [
      'Copilot started as autocomplete. Today it is a set of surfaces, from ghost text to agents that work in the cloud.',
      'Click two or three surfaces: inline suggestions, Agent, Copilot code review. Each one shows which mission uses it.',
      'You won’t need all of them today. You will touch most of them.',
    ],
  },
  {
    id: 'loops', title: 'Two loops, one Copilot', section: 'welcome', slot: '10:06–10:07',
    notes: [
      'Inner loop: what you do alone in VS Code. Explore, write, fix, test.',
      'Outer loop: what your team does on github.com. Pull request, review, CI, merge, automate.',
      'Missions 1–4 live in the inner loop; Mission 6 crosses into the outer loop.',
    ],
  },
  {
    id: 'control', title: 'You stay in control', section: 'welcome', slot: '10:07–10:08',
    notes: [
      'Copilot proposes, you decide. Today you use Manual permissions, the default.',
      'Show the approval prompt: Allow Once or Skip. Saved approvals: In this Session or Always Allow.',
      'Every edit can be kept or undone, and Restore Checkpoint takes you back. Your organisation’s policy always wins.',
    ],
  },
  {
    id: 'woodgrove', title: 'Meet Woodgrove Transfers', section: 'welcome', slot: '10:07–10:08',
    notes: [
      'Woodgrove Bank is fictional. Woodgrove Transfers validates IBANs and creates SEPA transfers.',
      'No dependencies, no build step. Tests run with node, or in a browser if Node isn’t installed.',
      'Six tickets; each mission or quest picks one up. All tests are green today, yet there are bugs. That’s the point.',
    ],
  },
  {
    id: 'ready', title: 'Ready check', section: 'welcome', slot: '10:07–10:08',
    notes: [
      'Hands up if you see ✓ 30 passed. If not, keep going with the guide’s ready check while I start Mission 1.',
      'Check the chat controls: Session Target Copilot, Agent, Auto, Manual permissions.',
    ],
  },
  {
    id: 'explore', title: 'Mission 1 · Explore', section: 'inner', slot: '10:08–10:11', mission: 'explore',
    notes: [
      'Switch to Ask. Ask doesn’t edit files, so it’s the safest way to learn a codebase.',
      'Paste the tour prompt. While it answers, point at the list of files it read.',
      'Second prompt: the step-by-step explanation of isValidIban. Remember it; it matters in Mission 3.',
      'Tip: type # to attach a file or symbol.',
    ],
  },
  {
    id: 'write', title: 'Mission 2 · Write', section: 'inner', slot: '10:11–10:13', mission: 'write',
    notes: [
      'Now the editor. Type the comment, then function maskIban( and wait for ghost text. Tab accepts.',
      'Ctrl+→ or ⌘→ accepts one word at a time.',
      'Next edit suggestion: the arrow in the gutter suggests adding maskIban to the returned object.',
      'Inline chat on the selection: empty input and a one-line JSDoc.',
    ],
  },
  {
    id: 'fix', title: 'Mission 3 · Fix', section: 'inner', slot: '10:13–10:18', mission: 'fix',
    notes: [
      'Back to Agent. One prompt: find the root cause, failing test first, fix, prove.',
      'Read the approval prompt before you select Allow Once. That is you staying in control.',
      'Look for red, then green. Then review the diff and Keep.',
      'While agents work, switch to the next slide to show why FR14 fails.',
    ],
  },
  {
    id: 'precision', title: 'Why FR14 failed', section: 'inner', slot: '10:16–10:18',
    notes: [
      'The checksum reads 15 digits at a time. A two-digit remainder plus 15 digits is 17 digits.',
      'Above Number.MAX_SAFE_INTEGER, JavaScript silently rounds. Show the rounded value.',
      'FR76 stays under the limit and passes; FR14 crosses it and fails. Try the Italian preset from the ticket too. BigInt or a 9-digit chunk fixes it.',
      'Every existing test was green. That’s why the test comes first.',
    ],
  },
  {
    id: 'teach', title: 'Mission 4 · Teach', section: 'inner', slot: '10:18–10:21', mission: 'teach',
    notes: [
      'House rules: write them once and every chat in this repo follows them.',
      'Open Customizations, create .github/copilot-instructions.md, paste the rules.',
      'New chat, then implement WGB-104. Look for integer cents, new tests and the instructions file under references.',
      'Instructions guide the model. They don’t replace tests or review.',
    ],
  },
  {
    id: 'quest', title: 'Mission 5 · Choose your quest', section: 'quest', slot: '10:21–10:27', mission: 'quest',
    notes: [
      'Six quests, one each, two if you’re fast. All prompts are in the guide.',
      'Build uses /plan and the integrated browser. Secure finds what an auditor would find.',
      'Test hunts for untested behaviour; there is a real bug to find. Automate turns a review into a skill.',
      'Walk the room. Ask who found the same-account bug.',
    ],
  },
  {
    id: 'recipe', title: 'Prompt recipe', section: 'quest', slot: '10:21–10:27',
    notes: [
      'While quests run: a good prompt has a goal, context, constraints and a check.',
      'Build one live: pick an option in each row, copy the result.',
      'The check is the part people forget. It’s how the agent proves its work.',
    ],
  },
  {
    id: 'ship', title: 'Mission 6 · Ship', section: 'outer', slot: '10:27–10:32', mission: 'ship',
    notes: [
      'Into the outer loop. One prompt: branch, small commits, push, pull request.',
      'Prefer clicks? Source Control, the sparkle button, Commit, Publish Branch.',
      'On github.com: Reviewers → Copilot. Read the review, commit a suggestion, watch CI turn green.',
      'While you were working: show the cloud agent’s pull request for WGB-106, and /automate for recurring work.',
    ],
  },
  {
    id: 'levelup', title: 'Level up', section: 'wrap', slot: '10:32–10:33',
    notes: [
      'Where to go next: skills, custom agents, connectors and MCP, hooks, plugins, evals, automations.',
      'Compare Models, the Copilot CLI and Copilot Memory. Pick one per week; don’t try all at once.',
    ],
  },
  {
    id: 'wrap', title: 'Five moves to keep', section: 'wrap', slot: '10:33–10:35',
    notes: [
      'Five moves: ask first, let Tab type, give a goal and a check, write it down once, ship through review.',
      'First-week plan: one small step per day.',
      'The guide and cheat sheet stay online. Thank you. Questions?',
    ],
  },
]

export const START_CLOCK = '10:05'
