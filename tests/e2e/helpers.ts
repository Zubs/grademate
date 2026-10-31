import { expect, type Page } from '@playwright/test'

export async function open(page: Page, path: string) {
  await page.goto(path)
  await page.waitForFunction(() => {
    const nuxt = (window as unknown as { useNuxtApp?: () => { isHydrating: boolean } }).useNuxtApp
    return nuxt ? !nuxt().isHydrating : false
  })
}

export async function register(page: Page, name = 'Ada Obi', email = 'ada@uni.edu') {
  await open(page, '/register')
  await page.getByLabel('Full name').fill(name)
  await page.getByLabel('Email address').fill(email)
  await page.locator('#password').fill('Str0ng!password')
  await page.getByRole('button', { name: 'Create account' }).click()
  await expect(page).toHaveURL(/\/dashboard$/)
}

const dashboardPaths: Record<string, string> = {
  Overview: '/dashboard',
  Semesters: '/dashboard/semesters',
  Forecaster: '/dashboard/forecast',
  Settings: '/dashboard/settings',
}

export async function goToDashboardPage(page: Page, name: string) {
  const menu = page.getByRole('button', { name: 'Open menu' })
  if (await menu.isVisible()) {
    await menu.click()
  }
  await page.getByRole('navigation').getByRole('link', { name, exact: true }).click()
  await expect(page).toHaveURL(new RegExp(`${dashboardPaths[name]}$`))
}

export async function addCourse(page: Page) {
  await page.getByRole('button', { name: 'Add academic year' }).first().click()
  await page.getByLabel('Year label').fill('2024/2025')
  await page.getByRole('button', { name: 'Add year' }).click()
  await page.getByRole('button', { name: 'Add semester' }).first().click()
  await expect(page.getByRole('heading', { name: 'Add semester' })).toBeVisible()
  await page.getByRole('button', { name: 'Add semester' }).last().click()
  await page.getByRole('button', { name: 'Add course' }).click()
  await page.getByPlaceholder('e.g. Algorithms').fill('Algorithms')
  await page.getByRole('combobox').first().selectOption('A')
}
