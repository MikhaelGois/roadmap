import { test, expect } from '@playwright/test'

test('create driver inline and save delivery', async ({ page }) => {
  const newDriver = { id: 'd-new', name: 'Novo Motorista', phone: '123' }

  // Use real backend (no request interception) — ensure backend is seeded and running
  let putRequestBody: any = null
  // we can still capture network traffic if needed
  await page.on('request', (request: any) => {
    if(request.method() === 'PUT' && /\/api\/deliveries\//.test(request.url())){
      putRequestBody = request.postDataJSON()
    }
  })

  // go to deliveries page (panel should be running locally at :3000)
  await page.goto('/')
  await page.click('text=Ver todas as entregas')
  await expect(page).toHaveURL(/\/entregas/)

  // open first delivery details
  await page.locator('button', { hasText: 'Ver detalhes' }).first().click()
  await expect(page.locator('#modal-title')).toBeVisible()

  // open quick create
  await page.click('button:has-text("Criar motorista")')
  await expect(page.locator('input[aria-label="Nome do motorista"]')).toBeVisible()

  // fill and create
  await page.fill('input[aria-label="Nome do motorista"]', 'Novo Motorista')
  await page.fill('input[aria-label="Telefone do motorista"]', '123')
  await page.click('button:has-text("Criar")')

  // confirm toast
  await expect(page.locator('text=Motorista criado')).toBeVisible()

  // new driver should be selected in the select
  const selectedValue = await page.$eval('select[aria-label="Atribuir motorista"]', (el: any) => el.value)
  expect(selectedValue).toBe('d-new')

  // change status and save
  await page.selectOption('select[aria-label="Status"]', 'DELIVERED')
  await page.click('button:has-text("Salvar")')

  // confirm success toast
  await expect(page.locator('text=Alterações salvas')).toBeVisible()

  // reload and check the delivery list shows the updated status
  await page.reload()
  await expect(page.locator('text=DELIVERED').first()).toBeVisible()
})