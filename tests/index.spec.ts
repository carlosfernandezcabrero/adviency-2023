import { Page, expect, test } from '@playwright/test'
import { GiftInterface } from './types'

const GIFTS: GiftInterface[] = [
  {
    id: 'Regalo 1',
    name: 'Regalo 1',
    quantity: 2,
    imageUrl:
      'https://plus.unsplash.com/premium_photo-1683140593902-5d2e4bef89c1?q=80&w=3774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    owner: 'John Doe',
    price: 100
  },
  {
    id: 'Regalo 1',
    name: 'Regalo 1',
    quantity: 4,
    imageUrl:
      'https://plus.unsplash.com/premium_photo-1683140593902-5d2e4bef89c1?q=80&w=3774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dsecodary',
    owner: 'John Doe Friend',
    price: 150
  }
]

async function fillAndSaveGift(
  { name, price, imageUrl, owner, quantity }: GiftInterface,
  page: Page,
  edit = false
): Promise<void> {
  await page.locator('input[name="name"]').fill(name)
  await page.locator('input[name="price"]').fill(price.toString())
  await page.locator('input[name="imageUrl"]').fill(imageUrl)
  await page.locator('input[name="owner"]').fill(owner)
  await page.locator('input[name="quantity"]').fill(quantity.toString())

  await page.getByText(edit ? 'Editar' : 'Agregar').click()
}

function formatCurrency(value: number): string {
  return value.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  })
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('text=No hay regalos Grinch! Agrega algo!')
})

test('Should be have title', async ({ page }) => {
  await expect(page).toHaveTitle(/Adviency 2023/)
  await expect(page.locator('h1')).toHaveText('Regalos:')
})

test('Page should be open with form closed', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Cerrar' })).not.toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Agregar', exact: true })
  ).not.toBeVisible()

  for (const input of await page.locator('input').all()) {
    await expect(input).not.toBeVisible()
  }
})

test('When not have gifts', async ({ page }) => {
  await expect(
    page.getByText('No hay regalos Grinch! Agrega algo!')
  ).toBeVisible()
  await expect(page.locator('li')).not.toBeVisible()
  await expect(page.getByText('Borrar todo')).not.toBeVisible()
  await expect(page.getByText('Previsualizar')).not.toBeVisible()
  await expect(page.getByText('Total')).not.toBeVisible()
})

test('Add gift', async ({ page }) => {
  const { name, quantity, imageUrl, owner, price } = GIFTS[0]

  await page.getByText('Agregar regalo').click()

  await fillAndSaveGift(GIFTS[0], page)

  await expect(page.locator('li')).toHaveCount(1)
  await expect(
    page.getByRole('heading', {
      name: `${name} (${quantity}) - ${formatCurrency(price * quantity)}`
    })
  ).toBeVisible()
  await expect(page.getByText(`Propietario: ${owner}`)).toBeVisible()
  await expect(page.locator(`img[src="${imageUrl}"]`)).toBeVisible()
})

test('Add multiples gifts', async ({ page }) => {
  await page.getByText('Agregar regalo').click()

  for (const gift of GIFTS) {
    await fillAndSaveGift(gift, page)
  }

  await expect(page.locator('li')).toHaveCount(2)

  for (const { name, quantity, price, owner, imageUrl } of GIFTS) {
    await expect(
      page.getByRole('heading', {
        name: `${name} (${quantity}) - ${formatCurrency(price * quantity)}`
      })
    ).toBeVisible()
    await expect(
      page.getByText(`Propietario: ${owner}`, { exact: true })
    ).toBeVisible()
    await expect(page.locator(`img[src="${imageUrl}"]`)).toBeVisible()
  }
})

test('Delete gift', async ({ page }) => {
  await page.getByText('Agregar regalo').click()

  for (const gift of GIFTS) {
    await fillAndSaveGift(gift, page)
  }

  await page.locator('ul li').first().getByLabel('borrar').click()

  await expect(page.locator('li')).toHaveCount(1)
})

test('Can close form', async ({ page }) => {
  await page.getByText('Agregar regalo').click()
  await page.getByRole('button', { name: 'Cerrar' }).click()

  await expect(page.getByText('Agregar regalo')).toBeVisible()
  await expect(page.locator('input')).not.toBeVisible()
})

test('Can edit gift', async ({ page }) => {
  const firstGift = GIFTS[0]
  const secondGift = GIFTS[1]

  await page.getByText('Agregar regalo').click()
  await fillAndSaveGift(firstGift, page)

  await page.getByRole('button', { name: 'editar' }).click()
  await fillAndSaveGift(secondGift, page, true)

  await expect(page.locator('li')).toHaveCount(1)
  await expect(
    page.getByRole('heading', {
      name: `${secondGift.name} (${secondGift.quantity}) - ${formatCurrency(
        secondGift.quantity * secondGift.price
      )}`
    })
  ).toBeVisible()
  await expect(page.getByText(`Propietario: ${secondGift.owner}`)).toBeVisible()
  await expect(page.locator(`img[src="${secondGift.imageUrl}"]`)).toBeVisible()
})

test('Can clone gift', async ({ page }) => {
  const firstGift = GIFTS[0]
  const secondGift = GIFTS[1]

  await page.getByText('Agregar regalo').click()
  for (const gift of GIFTS) {
    await fillAndSaveGift(gift, page)
  }
  await page.getByRole('button', { name: 'Cerrar' }).click()

  await page.getByLabel('duplicar').first().click()

  const thirdGift = { ...firstGift, quantity: 1, owner: 'Foo' }

  await page.locator('input[name="owner"]').fill(thirdGift.owner)
  await page
    .locator('input[name="quantity"]')
    .fill(thirdGift.quantity.toString())
  await page.getByText('Agregar').click()

  await expect(page.locator('li')).toHaveCount(3)

  for (const { quantity, price, name, owner } of [
    firstGift,
    secondGift,
    thirdGift
  ]) {
    await expect(
      page.getByRole('heading', {
        name: `${name} (${quantity}) - ${formatCurrency(quantity * price)}`
      })
    ).toBeVisible()
    await expect(
      page.getByText(`Propietario: ${owner}`, { exact: true })
    ).toBeVisible()
  }
})

test('Can delete all gifts', async ({ page }) => {
  await page.getByText('Agregar regalo').click()

  for (const gift of GIFTS) {
    await fillAndSaveGift(gift, page)
  }

  await page.getByText('Borrar todo').click()

  await expect(page.locator('li')).not.toBeVisible()
})

test('Check total', async ({ page }) => {
  await page.getByText('Agregar regalo').click()

  for (const gift of GIFTS) {
    await fillAndSaveGift(gift, page)
  }

  const expectedTotal = GIFTS.reduce(
    (acc, gift) => acc + gift.quantity * gift.price,
    0
  )

  await expect(
    page.getByText(`Total: ${formatCurrency(expectedTotal)}`)
  ).toBeVisible()
})

test('Can preview', async ({ page }) => {
  await page.getByText('Agregar regalo').click()

  for (const gift of GIFTS) {
    await fillAndSaveGift(gift, page)
  }

  await page.getByRole('button', { name: 'Previsualizar' }).click()

  await expect(page.getByText('Comprar:')).toBeVisible()

  const printListLocator = page.locator('#print-list')

  await expect(printListLocator.locator('li')).toHaveCount(2)
  await expect(printListLocator.getByLabel('editar')).not.toBeVisible()
  await expect(printListLocator.getByLabel('duplicar')).not.toBeVisible()
  await expect(printListLocator.getByLabel('borrar')).not.toBeVisible()

  for (const { name, quantity, price, owner, imageUrl } of GIFTS) {
    await expect(
      printListLocator.getByRole('heading', {
        name: `${name} (${quantity})`
      })
    ).toBeVisible()
    await expect(
      printListLocator.getByText(` - ${formatCurrency(quantity * price)}`)
    ).not.toBeVisible()
    await expect(
      printListLocator.getByText(`Propietario: ${owner}`, { exact: true })
    ).toBeVisible()
    await expect(
      printListLocator.locator(`img[src="${imageUrl}"]`)
    ).toBeVisible()
  }
})

test('Can close preview', async ({ page }) => {
  await page.getByText('Agregar regalo').click()

  await fillAndSaveGift(GIFTS[0], page)

  await page.getByRole('button', { name: 'Previsualizar' }).click()
  await page.getByRole('button', { name: 'Cerrar' }).click()

  await expect(page.locator('#print-list')).not.toBeVisible()
})

test('Can print', async ({ page }) => {
  await page.getByText('Agregar regalo').click()

  await fillAndSaveGift(GIFTS[0], page)

  await page.getByRole('button', { name: 'Previsualizar' }).click()
  await page.getByRole('button', { name: 'Imprimir' }).click()
})

test('Validation message of form', async ({ page }) => {
  await page.getByText('Agregar regalo').click()
  await page.locator('input[name="quantity"]').fill('0')
  await page.getByText('Agregar').click()

  await expect(page.getByText('El campo es requerido')).toHaveCount(3)
  await expect(
    page.getByText('El numero debe ser un entero positivo')
  ).toHaveCount(1)
  await expect(
    page.getByText('El numero debe ser un numero positivo')
  ).toHaveCount(1)
})

test("The 'Sorprenderme' button works", async ({ page }) => {
  await page.getByText('Agregar regalo').click()
  await page.getByText('Sorprenderme').click()

  await expect(page.locator('input[name="name"]')).not.toHaveValue('')
})

test('Should be clean form after submit', async ({ page }) => {
  await page.getByText('Agregar regalo').click()
  await fillAndSaveGift(GIFTS[0], page)

  await expect(page.locator('input[name="name"]')).toHaveValue('')
  await expect(page.locator('input[name="price"]')).toHaveValue('0')
  await expect(page.locator('input[name="imageUrl"]')).toHaveValue('')
  await expect(page.locator('input[name="owner"]')).toHaveValue('')
  await expect(page.locator('input[name="quantity"]')).toHaveValue('1')
})

test('Should be clean form after close', async ({ page }) => {
  const { name, quantity, imageUrl, owner, price } = GIFTS[0]

  await page.getByText('Agregar regalo').click()

  await page.locator('input[name="name"]').fill(name)
  await page.locator('input[name="price"]').fill(price.toString())
  await page.locator('input[name="imageUrl"]').fill(imageUrl)
  await page.locator('input[name="owner"]').fill(owner)

  await page.locator('input[name="quantity"]').fill(quantity.toString())
  await page.getByRole('button', { name: 'Cerrar' }).click()
  await page.getByText('Agregar regalo').click()

  await expect(page.locator('input[name="name"]')).toHaveValue('')
  await expect(page.locator('input[name="price"]')).toHaveValue('0')
  await expect(page.locator('input[name="imageUrl"]')).toHaveValue('')
  await expect(page.locator('input[name="owner"]')).toHaveValue('')
  await expect(page.locator('input[name="quantity"]')).toHaveValue('1')
})

test('Should be retrieve data from localstorage', async ({ page }) => {
  await page.getByText('Agregar regalo').click()
  await fillAndSaveGift(GIFTS[0], page)

  await page.reload()

  const { name, quantity, price, owner, imageUrl } = GIFTS[0]

  await expect(page.locator('li')).toHaveCount(1)
  await expect(
    page.getByRole('heading', {
      name: `${name} (${quantity}) - ${formatCurrency(quantity * price)}`
    })
  ).toBeVisible()
  await expect(
    page.getByText(`Propietario: ${owner}`, { exact: true })
  ).toBeVisible()
  await expect(page.locator(`img[src="${imageUrl}"]`)).toBeVisible()
})
