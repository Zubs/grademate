import { expect, test } from '@playwright/test'
import { addCourse, goToDashboardPage, open, register } from './helpers'

test('main navigation works', async ({ page }, testInfo) => {
  await open(page, '/')
  const phone = testInfo.project.name === 'phone'
  if (phone) {
    const toggle = page.getByRole('button', { name: 'Open menu' })
    await toggle.click()
    await expect(page.getByRole('button', { name: 'Close menu' })).toBeVisible()
    await page.getByRole('button', { name: 'Close menu' }).click()
    await expect(toggle).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Menu' })).toBeHidden()
    await toggle.click()
    await page.getByRole('navigation', { name: 'Menu' }).getByRole('link', { name: 'FAQ' }).click()
  }
  else {
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'FAQ' }).click()
  }
  await expect(page).toHaveURL(/#faq$/)
})

for (const path of ['/', '/login', '/privacy']) {
  test(`first Tab press on ${path} reaches the skip link`, async ({ page }) => {
    await open(page, path)
    await page.keyboard.press('Tab')
    const skip = page.getByRole('link', { name: 'Skip to content' })
    await expect(skip).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.locator('#main-content')).toBeFocused()
  })
}

test('title, favicon, and sharing tags are correct', async ({ page, request }) => {
  await open(page, '/')
  const title = await page.title()
  expect(title).toContain('GradeMate')
  expect(title).toMatch(/^[\x20-\x7E]+$/)
  expect((await request.get('/favicon.svg')).ok()).toBe(true)
  const image = await page.locator('meta[property="og:image"]').getAttribute('content')
  expect(image).toBe('https://grademate.xyz/og-image.png')
  await expect(page.locator('meta[property="og:title"]')).toHaveCount(1)
  await expect(page.locator('meta[property="og:description"]')).toHaveCount(1)
})

for (const [label, path, heading] of [['Privacy', '/privacy', 'Privacy policy'], ['Terms', '/terms', 'Terms of use']] as const) {
  test(`${label} page opens from the footer and links home`, async ({ page }) => {
    await open(page, '/')
    await page.getByRole('contentinfo').getByRole('link', { name: label }).click()
    await expect(page).toHaveURL(new RegExp(`${path}$`))
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible()
    await page.getByRole('link', { name: 'Back to home' }).click()
    await expect(page).toHaveURL(/\/$/)
  })
}

test('clear data dialog cancels, closes on Escape, and confirms', async ({ page }) => {
  await open(page, '/login')
  await page.getByRole('button', { name: 'Try with demo data' }).click()
  await expect(page).toHaveURL(/\/dashboard$/)
  await goToDashboardPage(page, 'Settings')
  const trigger = page.getByRole('button', { name: 'Clear', exact: true })
  const dialog = page.getByRole('dialog', { name: 'Clear all your data?' })

  await trigger.click()
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: 'Cancel' }).click()
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()

  await trigger.click()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  const kept = await page.evaluate(() => JSON.parse(localStorage.getItem('grademate_years') ?? '[]').length)
  expect(kept).toBe(2)

  await trigger.click()
  await dialog.getByRole('button', { name: 'Clear data' }).click()
  await expect(dialog).toBeHidden()
  const left = await page.evaluate(() => localStorage.getItem('grademate_years'))
  expect(left).toBeNull()
})

test('remove year dialog removes only on confirmation', async ({ page }) => {
  await register(page)
  await goToDashboardPage(page, 'Semesters')
  await addCourse(page)
  const year = page.getByRole('heading', { name: '2024/2025' })
  await page.getByTitle('Remove year').click()
  const dialog = page.getByRole('dialog', { name: 'Remove this academic year?' })
  await dialog.getByRole('button', { name: 'Cancel' }).click()
  await expect(year).toBeVisible()
  await page.getByTitle('Remove year').click()
  await dialog.getByRole('button', { name: 'Remove year' }).click()
  await expect(year).toBeHidden()
})

test('unknown address shows the branded error page', async ({ page }) => {
  const response = await page.goto('/page-that-does-not-exist')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1, name: "This star isn't on your chart" })).toBeVisible()
})

test('every public link leads to a real page, apart from calculator pages', async ({ page, request }) => {
  const checked = new Set<string>()
  for (const path of ['/', '/login', '/register', '/privacy', '/terms']) {
    await open(page, path)
    const hrefs = await page.locator('a[href^="/"]').evaluateAll(links => links.map(link => link.getAttribute('href') ?? ''))
    for (const href of hrefs) {
      const target = href.split('#')[0] || '/'
      if (checked.has(target) || target.startsWith('/calculator/')) {
        continue
      }
      checked.add(target)
      expect((await request.get(target)).ok(), target).toBe(true)
    }
    const dead = await page.locator('a[href="#"]').count()
    expect(dead).toBe(0)
  }
  expect(checked.has('/privacy')).toBe(true)
})

test('sharing image loads', async ({ request }) => {
  expect((await request.get('/og-image.png')).ok()).toBe(true)
})

test('chart follows a theme change and the CGPA stays the same', async ({ page }) => {
  await open(page, '/login')
  await page.getByRole('button', { name: 'Try with demo data' }).click()
  await expect(page).toHaveURL(/\/dashboard$/)
  const canvas = page.locator('canvas')
  await expect(canvas).toBeVisible()
  await page.waitForTimeout(1500)
  const before = await canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL())
  const menu = page.getByRole('button', { name: 'Open menu' })
  if (await menu.isVisible()) {
    await menu.click()
  }
  await page.getByRole('button', { name: 'Switch to light mode' }).click()
  await expect(page.locator('html')).toHaveClass(/light/)
  await page.waitForTimeout(1500)
  const after = await canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL())
  expect(after).not.toBe(before)
  await expect(page.getByText('3.65').first()).toBeAttached()
})

test('course table scrolls inside its own container on any width', async ({ page }) => {
  await register(page)
  await goToDashboardPage(page, 'Semesters')
  await addCourse(page)
  const viewport = page.viewportSize()!
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width)
})
