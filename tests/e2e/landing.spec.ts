import { expect, test } from '@playwright/test'
import { open } from './helpers'

test('main banner has one primary action on the first screen', async ({ page }) => {
  await open(page, '/')
  const hero = page.locator('section').first()
  const action = hero.getByRole('link', { name: 'Create your free account' })
  await expect(action).toBeInViewport()
  await expect(hero.getByRole('button')).toHaveCount(0)
  await expect(hero.getByRole('link')).toHaveCount(1)
})

test('primary action opens the sign up form', async ({ page }) => {
  await open(page, '/')
  await page.getByRole('link', { name: 'Create your free account' }).first().click()
  await expect(page).toHaveURL(/\/register$/)
})

test('product preview is flat, visible, and consistent', async ({ page }) => {
  await open(page, '/')
  const preview = page.getByRole('figure', { name: 'Interactive GradeMate preview' })
  await preview.scrollIntoViewIfNeeded()
  await expect(preview).toBeVisible()
  const count = await page.locator('[data-preview="semester-count"]').innerText()
  await expect(page.locator('[data-preview="bar"]')).toHaveCount(Number(count))
  expect(await preview.evaluate(element => getComputedStyle(element).transform)).toBe('none')
})

test('dragging the preview target updates the needed average', async ({ page }) => {
  await open(page, '/')
  const needed = page.locator('[data-preview="needed"]')
  const slider = page.getByLabel('Move your target star')
  await expect(needed).toHaveText('3.80')
  const star = page.locator('.target-star')
  const before = await star.getAttribute('style')
  await slider.fill('3.5')
  await expect(star).not.toHaveAttribute('style', before!)
  await expect(needed).toHaveText('3.46')
  await expect(page.getByText('Within reach')).toBeVisible()
  await slider.fill('4')
  await expect(page.getByText('Out of reach in 30 credits')).toBeVisible()
})

test('main banner fills the screen without sideways scrolling', async ({ page }) => {
  await open(page, '/')
  const box = await page.locator('section').first().boundingBox()
  const viewport = page.viewportSize()!
  expect(box!.height).toBeGreaterThanOrEqual(viewport.height)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width)
})

const features = [
  /GPA and CGPA tracking/, /Records by year and semester/, /GPA progress chart/, /4\.0, 5\.0, or UK scale/, /CGPA classification/,
  /Target forecaster/, /scenarios/, /JSON data export/, /Dark and light modes/, /Demo data/,
  /Real accounts with password reset/, /synced across your devices/, /import from a backup/, /custom grading scale/,
  /Retakes and school rules/, /Type a score and get the grade/, /Keyboard entry/, /Saved degree goal/, /What if grades/,
  /Assessment tracker/, /Scholarship and honors tracker/, /PDF semester reports/, /progress share link/, /Course templates/, /free calculator page/,
]

test('lists every present and proposed feature with no unavailable labels', async ({ page }) => {
  await open(page, '/')
  const text = await page.locator('main').innerText()
  for (const feature of features) {
    expect(text).toMatch(feature)
  }
  expect(text).not.toMatch(/coming soon|not yet available/i)
})

test('copy follows the rules and contains no unproven claims', async ({ page }) => {
  await open(page, '/')
  const text = await page.locator('main').innerText()
  expect(text).not.toMatch(/[-\u2013\u2014]/)
  expect(text).not.toMatch(/revolutionize|supercharge|cutting edge|effortless|transform your workflow|next level|harness the power|world class/i)
  const site = await page.locator('body').innerText()
  expect(site).not.toMatch(/Join students who track|Built for students/)
})

test('proof section shows marked placeholders', async ({ page }) => {
  await open(page, '/')
  await expect(page.locator('[data-placeholder]').first()).toContainText('{{testimonial}}')
})

test('tagline words reveal one at a time in reading order and do not replay', async ({ page }) => {
  await open(page, '/')
  const words = page.locator('.tagline-word')
  await expect(words.first()).toHaveClass(/tagline-muted/)
  await page.locator('[data-tagline]').evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }))
  await expect(page.locator('.tagline-muted')).toHaveCount(0, { timeout: 5000 })
  const times = await words.evaluateAll(elements => elements.map(element => Number(element.getAttribute('data-revealed'))))
  expect(times).toEqual([...times].sort((a, b) => a - b))
  expect(new Set(times).size).toBeGreaterThan(times.length / 2)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.locator('[data-tagline]').evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }))
  await expect(page.locator('.tagline-muted')).toHaveCount(0)
})

test('tagline is at full color under reduced motion', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await context.newPage()
  await open(page, 'http://localhost:3459/')
  await expect(page.locator('.tagline-word').first()).toBeAttached()
  await expect(page.locator('.tagline-muted')).toHaveCount(0)
  await context.close()
})

test('See a demo opens the dashboard with demo data for signed out visitors', async ({ page }) => {
  await open(page, '/')
  await page.getByRole('button', { name: 'See a demo' }).click()
  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page.getByText('3.65').first()).toBeVisible()
})

test('FAQ answers can be read with the keyboard', async ({ page }) => {
  await open(page, '/')
  const count = await page.locator('details').count()
  expect(count).toBeGreaterThanOrEqual(6)
  expect(count).toBeLessThanOrEqual(12)
  const first = page.locator('details summary').first()
  await first.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByText('Every feature is free for every student')).toBeVisible()
})

test('final call to action matches the hero with one action', async ({ page }) => {
  await open(page, '/')
  const final = page.locator('[data-final-action]')
  await expect(final.getByRole('link')).toHaveCount(1)
  await expect(final.getByRole('link', { name: 'Create your free account' })).toBeVisible()
  await expect(final.getByRole('button')).toHaveCount(0)
})
