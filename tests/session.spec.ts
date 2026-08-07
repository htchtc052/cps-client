import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

const account = {
  email: 'owner@curatedphotospace.test',
  password: 'password',
  name: 'Curated Owner',
}

/** The submit button stays disabled until the page hydrates and owns the form. */
async function signIn(page: Page, password: string) {
  await page.goto('/login')
  await expect(page.getByTestId('submit')).toBeEnabled()

  await page.getByTestId('email').fill(account.email)
  await page.getByTestId('password').fill(password)
  await page.getByTestId('submit').click()
}

test('an owner signs in, survives a reload, and signs out', async ({ page }) => {
  await signIn(page, account.password)

  await expect(page).toHaveURL('/owner')
  await expect(page.getByTestId('account-name')).toHaveText(account.name)

  await page.reload()
  await expect(page).toHaveURL('/owner')
  await expect(page.getByTestId('account-email')).toHaveText(account.email)

  // The reloaded page is server-rendered, so sign-out only works once it hydrates.
  await expect(page.getByTestId('logout')).toBeEnabled()
  await page.getByTestId('logout').click()
  await expect(page).toHaveURL('/login')

  await page.goto('/owner')
  await expect(page).toHaveURL('/login')
})

test('a wrong password keeps the visitor on the login page', async ({ page }) => {
  await signIn(page, 'not-the-password')

  await expect(page.getByText('These credentials do not match our records.')).toBeVisible()
  await expect(page).toHaveURL('/login')
})

test('an authenticated owner is redirected away from the login page', async ({ page }) => {
  await signIn(page, account.password)
  await expect(page).toHaveURL('/owner')

  await page.goto('/login')
  await expect(page).toHaveURL('/owner')
})
