import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { goToDashboardPage, open } from './helpers'

const typeScale = [12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72, 96, 128]
const spacing = [0, 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96]

async function auditDesign(page: Page) {
  return page.evaluate(({ typeScale, spacing }) => {
    const problems = new Set<string>()
    const describe = (element: Element) => `${element.tagName.toLowerCase()}.${String(element.getAttribute('class') ?? '').split(' ').slice(0, 2).join('.')}`
    const isApproved = (value: string) => value === 'normal' || value === 'auto' || spacing.includes(Math.abs(Number.parseFloat(value)))

    for (const element of document.querySelectorAll('body, body *')) {
      if (element.closest('svg, canvas, script, style, [data-audit-ignore]')) continue
      const rect = element.getBoundingClientRect()
      if (rect.width <= 1 || rect.height <= 1) continue
      const style = getComputedStyle(element)
      if (style.display === 'none' || style.visibility === 'hidden') continue

      if (!style.fontFamily.includes('Geist')) problems.add(`font ${style.fontFamily} on ${describe(element)}`)
      if (style.fontStyle !== 'normal') problems.add(`italic on ${describe(element)}`)
      if (Number(style.fontWeight) > 700) problems.add(`weight ${style.fontWeight} on ${describe(element)}`)
      if (!typeScale.includes(Number.parseFloat(style.fontSize))) problems.add(`size ${style.fontSize} on ${describe(element)}`)

      for (const property of ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'marginTop', 'marginBottom', 'rowGap', 'columnGap'] as const) {
        if (!isApproved(style[property])) problems.add(`${property} ${style[property]} on ${describe(element)}`)
      }

      if (style.backgroundImage.includes('gradient') && !element.matches('[data-hero-heading]')) {
        problems.add(`gradient on ${describe(element)}`)
      }
      if (style.textTransform === 'uppercase') problems.add(`uppercase on ${describe(element)}`)
    }

    if (document.documentElement.scrollWidth > window.innerWidth) {
      problems.add(`page scrolls sideways: ${document.documentElement.scrollWidth}px`)
    }
    for (const button of document.querySelectorAll('button, a.btn')) {
      if (button.scrollWidth > button.clientWidth + 1) problems.add(`text overflows ${describe(button)}`)
    }
    return [...problems]
  }, { typeScale, spacing })
}

async function scrollThroughPage(page: Page) {
  await page.evaluate(async () => {
    for (let top = 0; top < document.documentElement.scrollHeight; top += 300) {
      window.scrollTo({ top, behavior: 'instant' })
      await new Promise(resolve => setTimeout(resolve, 60))
    }
    await new Promise(resolve => setTimeout(resolve, 1500))
    window.scrollTo({ top: 0, behavior: 'instant' })
  })
}

async function auditPage(page: Page) {
  await scrollThroughPage(page)
  expect(await auditDesign(page)).toEqual([])
  const { violations } = await new AxeBuilder({ page }).analyze()
  expect(violations.map(violation => `${violation.id}: ${violation.nodes[0]?.target}`)).toEqual([])
}

for (const theme of ['dark', 'light']) {
  test.describe(`${theme} theme`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript(mode => localStorage.setItem('nuxt-color-mode', mode), theme)
    })

    for (const path of ['/', '/login', '/register', '/privacy', '/terms', '/page-that-does-not-exist']) {
      test(`public page ${path}`, async ({ page }) => {
        await open(page, path).catch(() => page.goto(path))
        await auditPage(page)
      })
    }

    for (const name of ['Overview', 'Semesters', 'Forecaster', 'Settings']) {
      test(`dashboard page ${name}`, async ({ page }) => {
        await open(page, '/login')
        await page.getByRole('button', { name: 'Try with demo data' }).click()
        await expect(page).toHaveURL(/\/dashboard$/)
        await goToDashboardPage(page, name)
        await auditPage(page)
      })
    }
  })
}
