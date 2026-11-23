# Rabobank × GitHub Copilot: An introduction to GitHub Copilot in VS Code

Facilitator kit for a 30-minute, hands-on GitHub Copilot workshop in VS Code for Rabobank engineers who are new to Copilot.

- **When:** Wednesday 25 November 2026, 10:05–10:35 CET
- **Site:** https://natethebuilder.github.io/rabobank-copilot-workshop/
  - `#/` home · `#/deck` deck · `#/presenter` presenter view · `#/lab` participant guide · `#/cheatsheet` printable cheat sheet
- **Lab (public template):** https://github.com/Natethebuilder/woodgrove-transfers
- Product facts as of VS Code 1.147 (18 November 2026). Woodgrove Bank is fictional; all data in the lab is fake.

> This README is for facilitators only. Nothing in it appears on the site.

## Run of show

| Clock (CET) | Block | Slides |
|---|---|---|
| 10:05–10:08 | Welcome: autocomplete to agents, two loops, you stay in control, meet Woodgrove Transfers | 1–6 |
| 10:08–10:11 | Mission 1 · Explore (Ask) | 7 |
| 10:11–10:13 | Mission 2 · Write (inline suggestions, next edits) | 8 |
| 10:13–10:18 | Mission 3 · Fix (Agent, test-first), then "Why FR14 failed" while agents work | 9–10 |
| 10:18–10:21 | Mission 4 · Teach (custom instructions, then WGB-104) | 11 |
| 10:21–10:27 | Mission 5 · Choose your quest, prompt recipe while quests run | 12–13 |
| 10:27–10:32 | Mission 6 · Ship (branch, PR, Copilot code review, CI), cloud agent reveal | 14 |
| 10:32–10:35 | Level up, five moves, first-week plan, Q&A | 15–16 |

Each mission slide has a countdown ring (▶ start, ❚❚ pause, ↺ reset). Speaker notes with CET ranges are in the presenter view.

## Pre-flight checklist

### A week before

- [ ] Confirm with Rabobank's GitHub admins that participants have Copilot with **Agent** and **Ask**, the **integrated browser** / browser tools, and the **permission levels** (Manual, Assisted, Allow all) enabled by policy.
- [ ] Confirm that managed users can **create a private repository from a public template**. If not, pre-create one repository per participant (from the template) in a sandbox organisation and share the list.
- [ ] Confirm **Copilot code review** is enabled for those repositories.
- [ ] Check whether **GitHub Actions** (the lab's CI) is allowed. If not, show the CI step on screen.
- [ ] Confirm **GitHub Codespaces** is available as the backup (the lab has a `.devcontainer`).
- [ ] Send participants the home page link so they can do the ready check before the session.

### The day before

- [ ] Do the whole lab end to end on the presenting laptop: template → clone → Missions 1–6 → PR with Copilot review and green CI.
- [ ] Open the deck and presenter view on the presenting laptop; check fonts, the QR code and the screen share of a single window.

### On the day

- [ ] Before the session, in **your own copy** of the lab, create an issue from `docs/tickets/WGB-106.md` (Scheduled transfers).
- [ ] Around 10:06–10:07 CET, assign that issue to **Copilot** (cloud agent). Its pull request is the "While you were working…" reveal in Mission 6.
- [ ] If you pre-staged the cloud agent PR, set `CLOUD_PR_URL` in `presentation/src/content.js` and push, so slide 14 links to it. Otherwise the card says "Shown live".
- [ ] Have the integrated browser, Source Control and github.com tabs ready.

## Presenting

1. Open `#/deck` in one window and press **P** for the presenter view (same browser). Share only the deck window.
2. In the presenter view press **T** when the session starts (10:05–10:35 CET) to reset the timer; the clock turns red when you're past a slide's slot.

| Key | Action |
|---|---|
| → / Space / PageDown | Next step or slide |
| ← / PageUp | Previous |
| Home / End | First / last slide |
| P | Presenter view (notes, timer, now/next preview, synced via BroadcastChannel) |
| O | Overview of all slides |
| F | Full screen |

The **Motion** toggle pauses the animated backdrop (it also respects *prefers-reduced-motion* and pauses when the tab is hidden).

## Fallbacks

| Problem | What to do |
|---|---|
| Someone falls behind | The lab's `solutions` branch has one reference commit per ticket. They can `git cherry-pick` the commit for the mission they're stuck on. |
| Node isn't installed | Open `tests/index.html` in the VS Code integrated browser (or any browser). The page title shows "✓ 30 passed" on a clean copy. |
| Template blocked / can't create a repo | Clone `https://github.com/Natethebuilder/woodgrove-transfers` directly, do Missions 1–5, then follow Mission 6 on screen. |
| A Copilot policy blocks a feature | Demo it on screen and move on. |
| Laptop locked down completely | Codespaces on their copy (or on the public lab). |
| Running late | Cut the prompt recipe (slide 13) and Level up (slide 15); keep Ship and Wrap. |

## Editing content

Everything participants see comes from **one file**: `presentation/src/content.js`. The deck, presenter notes, guide and cheat sheet all read from it, so they never drift.

- `EVENT`, `AGENDA`, `READY`: event details, run of show, ready check
- `MISSIONS`, `QUESTS`, `PROMPTS`, `HOUSE_RULES`: mission steps and verbatim prompts
- `SLIDES`: slide order, CET slots and speaker notes
- `SHORTCUTS`: Windows/macOS shortcuts (the guide's OS toggle uses these)
- `CLOUD_PR_URL`: optional link for the cloud agent reveal

Inline markup inside strings: `**bold**`, `` `code` ``, `[[UI chip]]`, `{k:shortcutId}`, `{link:key|label}`.

Rules: show clock times as ranges with the zone (e.g. 10:08–10:11 CET); never state an AI credit amount or price; co-branding is text only (no Rabobank logo or brand colours).

## Build, test and deploy

```bash
cd presentation
npm ci
npm run dev          # http://127.0.0.1:5219/rabobank-copilot-workshop/
npm test             # builds, serves on :5220 and runs the Playwright smoke tests
```

Smoke tests (`presentation/tests/smoke.e2e.js`): every route renders without console errors; deck navigation reaches all slides; the precision explorer rejects FR14 with the buggy method and accepts it with BigInt; the OS toggle changes shortcuts and copy works; mission progress survives a reload; the guide works at 390px; the build contains no private links or backstage references.

Deploy: pushing to `main` (changes in `presentation/**` or the workflow) runs `.github/workflows/deploy.yml`: Node 24, `npm ci`, Playwright Chromium, `npm test`, then uploads only `presentation/dist` to GitHub Pages. You can also run it manually (workflow_dispatch).

Credits: GitHub Copilot mascot; [Primer Octicons](https://github.com/primer/octicons) (MIT); Mona Sans and Monaspace (OFL) via Fontsource; [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) (MIT); [@deckio/deck-engine](https://github.com/deckio-art/deck-engine).
