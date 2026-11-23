import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from '@playwright/test'
import { MISSIONS, PROMPTS, SLIDES } from '../src/content.js'

const active = (page) => page.locator('.slide.active')

const trackErrors = (page) => {
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  return errors
}

test('every route renders without console errors', async ({ page }) => {
  const errors = trackErrors(page)
  const routes = [
    ['#/', /An introduction to GitHub Copilot/],
    ['#/deck', /An introduction to GitHub Copilot/],
    ['#/presenter', /An introduction to GitHub Copilot in VS Code/],
    ['#/lab', /An introduction to GitHub Copilot/],
    ['#/cheatsheet', /An introduction to GitHub Copilot/],
  ]
  for (const [hash, heading] of routes) {
    await page.goto(`./${hash}`)
    await expect(page.getByRole('heading', { level: 1 }).first()).toHaveText(heading)
  }
  expect(errors).toEqual([])
})

test('deck navigation reaches every slide', async ({ page }) => {
  await page.goto('./#/deck')
  await expect(active(page)).toHaveAttribute('data-slide', '0')
  const seen = new Set(['0'])
  for (let i = 0; i < 40 && seen.size < SLIDES.length; i++) {
    await page.keyboard.press('ArrowRight')
    seen.add(await active(page).getAttribute('data-slide'))
  }
  expect(seen.size).toBe(SLIDES.length)
  await expect(page.locator('.deck-count')).toContainText(`${SLIDES.length}`)
})

test('precision explorer: FR14 rejected by the buggy method, accepted by BigInt', async ({ page }) => {
  const index = SLIDES.findIndex((s) => s.id === 'precision')
  await page.goto(`./?slide=${index}#/deck`)
  const slide = active(page)
  await expect(slide.locator('#pr-iban')).toHaveValue('FR14 2004 1010 0505 0001 3M02 606')
  await expect(slide.getByTestId('verdict-buggy')).toContainText('rejected')
  await expect(slide.getByTestId('verdict-fixed')).toContainText('accepted')
  await slide.getByRole('button', { name: 'FR76' }).click()
  await expect(slide.getByTestId('verdict-buggy')).toContainText('accepted')
})

test('the OS toggle changes shortcuts and prompts copy to the clipboard', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('./#/lab')
  const shortcut = page.locator('#ready [data-shortcut="chatView"]').first()
  await page.getByRole('button', { name: 'Windows' }).click()
  await expect(shortcut).toContainText('Ctrl')
  await page.getByRole('button', { name: 'macOS' }).click()
  await expect(shortcut).toContainText('⌘')
  await expect(shortcut).not.toContainText('Ctrl')
  const card = page.locator('#mission-explore .prompt').first()
  await card.getByRole('button', { name: /Copy/ }).click()
  await expect(card.getByRole('button', { name: 'Copied' })).toBeVisible()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(PROMPTS.tour)
})

test('marking a mission complete survives a reload', async ({ page }) => {
  await page.goto('./#/lab')
  const button = page.getByRole('button', { name: `Mark Mission 1 complete` })
  await button.click()
  await page.reload()
  await expect(page.getByRole('button', { name: `Mission 1 complete` })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.lab-progress-n')).toHaveText(`1/${MISSIONS.length + 1}`)
})

test('the guide is usable at 390px wide', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('./#/lab')
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1)
  await expect(page.getByRole('button', { name: 'macOS' })).toBeVisible()
  const copy = page.locator('#mission-fix .copy-btn').first()
  await copy.scrollIntoViewIfNeeded()
  await expect(copy).toBeInViewport()
})

test('the production build has no private links or backstage references', () => {
  const files = []
  const walk = (dir) => readdirSync(dir).forEach((f) => { const p = join(dir, f); if (statSync(p).isDirectory()) walk(p); else if (/\.(html|js|css|svg|json|txt)$/.test(p)) files.push(p) })
  walk(new URL('../dist', import.meta.url).pathname)
  expect(files.length).toBeGreaterThan(0)
  for (const f of files) {
    const text = readFileSync(f, 'utf8')
    expect(text, f).not.toMatch(/mas-paper-briefing/i)
    expect(text, f).not.toMatch(/\bsolutions\b/i)
  }
})
