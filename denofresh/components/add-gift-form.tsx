import { Signal, useSignal } from '@preact/signals'
import { useEffect } from 'preact/hooks'
import { getGiftSchema } from '../schemas.ts'
import { upsertGifts } from '../services/gifts.service.ts'
import { GiftInterface } from '../types.ts'

interface PropsInterface {
  initialGift: GiftInterface
  currentGift: GiftInterface
  gifts: Signal<GiftInterface[]>
  showForm: Signal<boolean>
}

const { giftSchema, textFieldRule, quantityFieldRule } = getGiftSchema()
const giftsSuggestions = ['Pantalla', 'Celular', 'Laptop', 'Audifonos']

export default function AddGiftForm({
  initialGift,
  currentGift,
  gifts,
  showForm,
}: PropsInterface) {
  const fields = useSignal({ ...initialGift })
  const submitted = useSignal(false)

  useEffect(() => {
    fields.value = { ...currentGift }
  }, [currentGift])

  function handleChange(event: Event) {
    const { name, value } = event.target as HTMLInputElement

    fields.value = {
      ...fields.value,
      [name]: value,
    }
  }

  function handleSubmit(event: Event) {
    event.preventDefault()
    submitted.value = true

    const giftToSubmit: GiftInterface = {
      ...fields.value,
      quantity: Number(fields.value.quantity),
      price: Number(fields.value.price),
    }

    if (giftSchema.safeParse(giftToSubmit).success) {
      const newGifts = upsertGifts(giftToSubmit, gifts.value)

      localStorage.setItem('gifts', JSON.stringify(newGifts))
      gifts.value = newGifts
      fields.value = { ...initialGift }
      submitted.value = false
    }
  }

  return (
    <form className='grid gap-4' onSubmit={(event) => handleSubmit(event)}>
      {showForm.value &&
        (
          <div className='grid gap-2'>
            <div>
              <div className='flex items-center gap-x-2'>
                <input
                  className='block w-full flex-1'
                  name='name'
                  placeholder='Agrega un regalo'
                  type='text'
                  value={fields.value.name}
                  onInput={handleChange}
                />
                <button
                  type='button'
                  onClick={() => {
                    fields.value = {
                      ...fields.value,
                      name: giftsSuggestions[
                        Math.floor(Math.random() * giftsSuggestions.length)
                      ],
                    }
                  }}
                >
                  Sorprenderme
                </button>
              </div>
              {submitted.value &&
                !textFieldRule.safeParse(fields.value.name).success &&
                <p className='error-message'>El campo es requerido</p>}
            </div>
            <div>
              <input
                className='block w-full'
                name='imageUrl'
                placeholder='Url imagen'
                type='text'
                value={fields.value.imageUrl}
                onInput={handleChange}
              />
              {submitted.value &&
                !textFieldRule.safeParse(fields.value.imageUrl).success &&
                <p className='error-message'>El campo es requerido</p>}
            </div>
            <div>
              <input
                className='block w-full'
                name='owner'
                placeholder='Propietario'
                type='text'
                value={fields.value.owner}
                onInput={handleChange}
              />
              {submitted.value &&
                !textFieldRule.safeParse(fields.value.owner).success &&
                <p className='error-message'>El campo es requerido</p>}
            </div>
            <div>
              <input
                className='block w-full'
                name='price'
                placeholder='Precio'
                type='number'
                value={fields.value.price}
                onInput={handleChange}
              />
              {submitted.value &&
                !quantityFieldRule.safeParse(Number(fields.value.price))
                  .success &&
                (
                  <p className='error-message'>
                    El numero debe ser un numero positivo
                  </p>
                )}
            </div>
            <div>
              <input
                className='block w-full'
                name='quantity'
                placeholder='Cantidad'
                type='number'
                value={fields.value.quantity}
                onInput={handleChange}
              />
              {submitted.value &&
                !quantityFieldRule.safeParse(
                  Number(fields.value.quantity),
                )
                  .success &&
                (
                  <p className='error-message'>
                    El numero debe ser un entero positivo
                  </p>
                )}
            </div>
          </div>
        )}
      <footer
        className={`flex ${
          showForm.value ? 'justify-between' : 'justify-center'
        }`}
      >
        <button
          className='primary'
          type='button'
          onClick={() => {
            showForm.value = !showForm.value
          }}
        >
          {showForm.value ? 'Cerrar' : 'Agregar regalo'}
        </button>
        {showForm.value &&
          (
            <button className='primary' type='submit'>
              {fields.value.id ? 'Editar' : 'Agregar'}
            </button>
          )}
      </footer>
    </form>
  )
}
