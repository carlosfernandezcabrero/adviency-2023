import {
  Show,
  batch,
  createEffect,
  createSignal,
  type Accessor
} from 'solid-js'
import { createStore } from 'solid-js/store'
import { getGiftSchema } from '../schemas'
import { upsertGifts } from '../services/gifts.service'
import type { GiftInterface } from '../types'

interface PropsInterface {
  initialGift: GiftInterface
  currentGift: Accessor<GiftInterface>
  gifts: Accessor<GiftInterface[]>
  setGifts: (value: GiftInterface[]) => unknown
  showForm: Accessor<boolean>
  setShowForm: (value: boolean) => unknown
}

const { giftSchema, textFieldRule, quantityFieldRule } = getGiftSchema()
const giftsSuggestions = ['Pantalla', 'Celular', 'Laptop', 'Audifonos']

export default function AddGiftForm({
  initialGift,
  currentGift,
  gifts,
  setGifts,
  showForm,
  setShowForm
}: PropsInterface) {
  const [submitted, setSubmitted] = createSignal(false)
  const [fields, setFields] = createStore<GiftInterface>({
    ...initialGift
  })

  createEffect(() => {
    setFields({ ...currentGift() })
  })

  function handleChange(event: Event) {
    const { name, value } = event.target as HTMLInputElement

    setFields({
      ...fields,
      [name]: value
    })
  }

  function handleSubmit(event: Event) {
    event.preventDefault()
    setSubmitted(true)

    const giftToSubmit: GiftInterface = {
      ...fields,
      quantity: Number(fields.quantity),
      price: Number(fields.price)
    }

    if (giftSchema.safeParse(giftToSubmit).success) {
      const newGifts = upsertGifts(giftToSubmit, gifts())

      localStorage.setItem('gifts', JSON.stringify(newGifts))

      batch(() => {
        setGifts(newGifts)
        setFields({ ...initialGift })
        setSubmitted(false)
      })
    }
  }

  return (
    <form class="grid gap-4" onSubmit={handleSubmit}>
      <Show when={showForm()}>
        <div class="grid gap-2">
          <div>
            <div class="flex items-center gap-x-2">
              <input
                class="flex-1 block w-full"
                name="name"
                onChange={handleChange}
                placeholder="Agrega un regalo"
                type="text"
                value={fields.name}
              />
              <button
                onClick={() => {
                  setFields({
                    ...fields,
                    name: giftsSuggestions[
                      Math.floor(Math.random() * giftsSuggestions.length)
                    ]
                  })
                }}
                type="button"
              >
                Sorprenderme
              </button>
            </div>
            {submitted() && !textFieldRule.safeParse(fields.name).success && (
              <p class="error-message">El campo es requerido</p>
            )}
          </div>
          <div>
            <input
              class="block w-full"
              name="imageUrl"
              onChange={handleChange}
              placeholder="Url imagen"
              type="text"
              value={fields.imageUrl}
            />
            {submitted() &&
              !textFieldRule.safeParse(fields.imageUrl).success && (
                <p class="error-message">El campo es requerido</p>
                // eslint-disable-next-line @typescript-eslint/indent
              )}
          </div>
          <div>
            <input
              class="block w-full"
              name="owner"
              onChange={handleChange}
              placeholder="Propietario"
              type="text"
              value={fields.owner}
            />
            {submitted() && !textFieldRule.safeParse(fields.owner).success && (
              <p class="error-message">El campo es requerido</p>
            )}
          </div>
          <div>
            <input
              class="block w-full"
              name="price"
              onChange={handleChange}
              placeholder="Precio"
              type="number"
              value={fields.price}
            />
            {submitted() &&
              !quantityFieldRule.safeParse(Number(fields.price)).success && (
                <p class="error-message">
                  El numero debe ser un numero positivo
                </p>
                // eslint-disable-next-line @typescript-eslint/indent
              )}
          </div>
          <div>
            <input
              class="block w-full"
              name="quantity"
              onChange={handleChange}
              placeholder="Cantidad"
              type="number"
              value={fields.quantity}
            />
            {submitted() &&
              !quantityFieldRule.safeParse(Number(fields.quantity)).success && (
                <p class="error-message">
                  El numero debe ser un entero positivo
                </p>
                // eslint-disable-next-line @typescript-eslint/indent
              )}
          </div>
        </div>
      </Show>
      <footer
        class={`flex ${showForm() ? 'justify-between' : 'justify-center'}`}
      >
        <button
          class="primary"
          onClick={() => {
            setShowForm(!showForm())
          }}
          type="button"
        >
          {showForm() ? 'Cerrar' : 'Agregar regalo'}
        </button>
        {showForm() && (
          <button class="primary" type="submit">
            {fields.id ? 'Editar' : 'Agregar'}
          </button>
        )}
      </footer>
    </form>
  )
}
