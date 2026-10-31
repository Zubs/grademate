import { expect, test, type Page } from '@playwright/test'
import { goToDashboardPage, open } from './helpers'

async function startDemo(page: Page) {
  await open(page, '/login')
  await page.getByRole('button', { name: 'Try with demo data' }).click()
  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page.getByText('First Class').first()).toBeVisible()
}

const savedYears = (page: Page) => page.evaluate(() => {
  const years = JSON.parse(localStorage.getItem('grademate_years') ?? '[]') as { label: string }[]
  return years.map(year => year.label)
})

async function addYear(page: Page, label: string) {
  await goToDashboardPage(page, 'Semesters')
  await page.getByRole('button', { name: 'Add academic year' }).first().click()
  await page.getByLabel('Year label').fill(label)
  await page.getByRole('button', { name: 'Add year' }).click()
  await expect(page.getByRole('heading', { name: label })).toBeVisible()
}

const cgpa = (page: Page) => page.locator('main').getByText('CGPA', { exact: true }).first().locator('..').innerText()

test('reloading each dashboard page stays signed in on that page', async ({ page }) => {
  await startDemo(page)
  for (const name of ['Semesters', 'Forecaster', 'Settings', 'Overview']) {
    await goToDashboardPage(page, name)
    const url = page.url()
    await page.reload()
    await expect(page).toHaveURL(url)
    await expect(page.getByText('demo@student.edu').first()).toBeAttached()
  }
})

test('opening the forecaster directly while signed in opens it', async ({ page }) => {
  await startDemo(page)
  await page.goto('/dashboard/forecast')
  await expect(page).toHaveURL(/\/dashboard\/forecast$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Target forecaster' })).toBeVisible()
})

test('reloading the landing page keeps the student signed in', async ({ page }) => {
  await startDemo(page)
  await open(page, '/')
  const dashboardLink = page.locator('a[href="/dashboard"]').first()
  await expect(dashboardLink).toBeAttached()
  await dashboardLink.evaluate((link: HTMLElement) => link.click())
  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page.getByText('3.65').first()).toBeVisible()
})

test('CGPA is the same after a reload', async ({ page }) => {
  await startDemo(page)
  const before = await cgpa(page)
  expect(before).toContain('3.65')
  await page.reload()
  await expect(page.getByText('First Class').first()).toBeVisible()
  expect(await cgpa(page)).toBe(before)
})

test('adding a year after a reload keeps existing years', async ({ page }) => {
  await startDemo(page)
  const before = await savedYears(page)
  await page.reload()
  await expect(page.getByText('First Class').first()).toBeVisible()
  await addYear(page, '2030/2031')
  expect(await savedYears(page)).toEqual([...before, '2030/2031'])
})

test('signing in after the landing page keeps existing years', async ({ page }) => {
  await startDemo(page)
  const before = await savedYears(page)
  await page.evaluate(() => localStorage.removeItem('grademate_user'))
  await open(page, '/')
  await page.goto('/login')
  await page.getByLabel('Email address').fill('ada@uni.edu')
  await page.locator('#password').fill('secret')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page).toHaveURL(/\/dashboard$/)
  await addYear(page, '2030/2031')
  expect(await savedYears(page)).toEqual([...before, '2030/2031'])
})

test('a new course survives a reload and reopening the browser', async ({ page, browser }, testInfo) => {
  await startDemo(page)
  await addYear(page, '2030/2031')
  await page.reload()
  await expect(page.getByRole('heading', { name: '2030/2031' })).toBeVisible()
  const state = await page.context().storageState()
  await page.context().close()
  const reopened = await browser.newContext({ storageState: state, baseURL: testInfo.project.use.baseURL, viewport: testInfo.project.use.viewport })
  const nextPage = await reopened.newPage()
  await nextPage.goto('/dashboard/semesters')
  await expect(nextPage.getByRole('heading', { name: '2030/2031' })).toBeVisible()
  await reopened.close()
})

test('signed out visitors go to sign in and return to the page they wanted', async ({ page }) => {
  await page.goto('/dashboard/forecast')
  await expect(page).toHaveURL(/\/login\?redirect=/)
  await page.getByLabel('Email address').fill('ada@uni.edu')
  await page.locator('#password').fill('secret')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page).toHaveURL(/\/dashboard\/forecast$/)
})

for (const path of ['/login', '/register']) {
  test(`signed in students opening ${path} go to the dashboard`, async ({ page }) => {
    await startDemo(page)
    await page.goto(path)
    await expect(page).toHaveURL(/\/dashboard$/)
  })
}

test('the sign in screen never appears during a dashboard reload', async ({ page }) => {
  await startDemo(page)
  await page.addInitScript(() => {
    const seen = () => {
      if (location.pathname === '/login' || document.body?.innerText.includes('Welcome back')) {
        sessionStorage.setItem('saw-sign-in', 'yes')
      }
    }
    new MutationObserver(seen).observe(document, { childList: true, subtree: true })
  })
  await page.reload()
  await expect(page.getByText('First Class').first()).toBeVisible()
  expect(await page.evaluate(() => sessionStorage.getItem('saw-sign-in'))).toBeNull()
})

test('unreadable records show getting started and stay until a change', async ({ page }) => {
  await startDemo(page)
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.evaluate(() => localStorage.setItem('grademate_years', '{broken'))
  await page.reload()
  await expect(page.getByText("Let's set up your academic record")).toBeVisible()
  expect(await page.evaluate(() => localStorage.getItem('grademate_years'))).toBe('{broken')
  expect(errors).toEqual([])
})

test('unreadable sign in details go to the sign in page without an error', async ({ page }) => {
  await startDemo(page)
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.evaluate(() => localStorage.setItem('grademate_user', '{broken'))
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/login/)
  expect(errors).toEqual([])
})

test('an unknown saved scale falls back to the default', async ({ page }) => {
  await startDemo(page)
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.evaluate(() => localStorage.setItem('grademate_scale', 'nonsense'))
  await page.reload()
  await expect(page.getByText('First Class').first()).toBeVisible()
  await expect(page.getByText('4.0 Scale')).toBeVisible()
  expect(errors).toEqual([])
})

test('the landing page loads with no hydration warnings', async ({ page }) => {
  await startDemo(page)
  const warnings: string[] = []
  page.on('console', (message) => {
    if (/hydrat/i.test(message.text())) {
      warnings.push(message.text())
    }
  })
  await open(page, '/')
  await page.waitForTimeout(500)
  expect(warnings).toEqual([])
})

for (const [theme, color] of [['dark', 'rgb(19, 18, 9)'], ['light', 'rgb(250, 250, 250)']] as const) {
  test(`app pages paint the ${theme} theme background before scripts run`, async ({ page }) => {
    await page.addInitScript(mode => localStorage.setItem('nuxt-color-mode', mode), theme)
    await page.route('**/_nuxt/*.js', route => route.abort())
    await page.goto('/dashboard')
    await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(color)
  })
}
