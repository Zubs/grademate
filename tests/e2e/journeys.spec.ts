import { expect, test } from '@playwright/test'
import { addCourse, goToDashboardPage, open, register } from './helpers'

test('registers and reaches the dashboard', async ({ page }) => {
  await register(page)
  await expect(page.getByText("Let's set up your academic record")).toBeVisible()
})

test('signs out and back in', async ({ page }) => {
  await register(page)
  await goToDashboardPage(page, 'Settings')
  await page.getByRole('main').getByRole('button', { name: 'Sign out' }).click()
  await expect(page).toHaveURL(/\/$/)
  await open(page, '/login')
  await page.getByLabel('Email address').fill('ada@uni.edu')
  await page.locator('#password').fill('secret')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page).toHaveURL(/\/dashboard$/)
})

test('sign in page demo opens demo data', async ({ page }) => {
  await open(page, '/login')
  await page.getByRole('button', { name: 'Try with demo data' }).click()
  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page.getByText('3.65').first()).toBeVisible()
})

test('adds a year, semester, and course, and shows the result on the dashboard', async ({ page }) => {
  await register(page)
  await goToDashboardPage(page, 'Semesters')
  await addCourse(page)
  await expect(page.getByText('4.00 GPA')).toBeVisible()
  await goToDashboardPage(page, 'Overview')
  await expect(page.getByText('4.00').first()).toBeVisible()
  await expect(page.getByText('Total credits')).toBeVisible()
})

test('forecasts the GPA needed for a target', async ({ page }) => {
  await open(page, '/login')
  await page.getByRole('button', { name: 'Try with demo data' }).click()
  await expect(page).toHaveURL(/\/dashboard$/)
  await goToDashboardPage(page, 'Forecaster')
  await page.getByLabel('Target CGPA').fill('3.70')
  await page.getByLabel('Upcoming credits').fill('30')
  await expect(page.getByText('You need an average GPA of')).toBeVisible()
  await expect(page.getByText('Scenarios')).toBeVisible()
})

test('changes settings and exports data', async ({ page }) => {
  await open(page, '/login')
  await page.getByRole('button', { name: 'Try with demo data' }).click()
  await expect(page).toHaveURL(/\/dashboard$/)
  await goToDashboardPage(page, 'Settings')
  await page.getByLabel('Full name').fill('Tola Ade')
  await page.getByRole('button', { name: 'Save profile' }).click()
  await expect(page.getByText('Profile updated')).toBeVisible()
  await page.getByRole('button', { name: 'Light', exact: true }).click()
  await expect(page.locator('html')).toHaveClass(/light/)
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export', exact: true }).click()
  expect((await download).suggestedFilename()).toBe('grademate-export.json')
})
