import { Signal, useSignal } from '@preact/signals'
import { getGiftSchema } from '../schemas.ts'
import { GiftInterface } from '../types.ts'

interface PropsInterface {
  initialGift: GiftInterface
  currentGift: Signal<GiftInterface>
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
  const submitted = useSignal(false)

  function handleChange(event: Event) {
    const { name, value } = event.target as HTMLInputElement

    currentGift.value = {
      ...currentGift.value,
      [name]: value,
    }
  }

  function handleSubmit(event: Event) {
    event.preventDefault()
    submitted.value = true

    const giftToSubmit: GiftInterface = {
      ...currentGift.value,
      quantity: Number(currentGift.value.quantity),
      price: Number(currentGift.value.price),
    }

    if (giftSchema.safeParse(giftToSubmit).success) {
      if (giftToSubmit.id) {
        const giftIndex = gifts.value.findIndex(({ id: _id }) =>
          _id === giftToSubmit.id
        )

        gifts.value[giftIndex] = giftToSubmit

        localStorage.setItem('gifts', JSON.stringify(gifts.value))
        gifts.value = [...gifts.value]
      } else {
        const newGifts = [...gifts.value, {
          ...giftToSubmit,
          id: giftToSubmit.name,
        }]

        localStorage.setItem('gifts', JSON.stringify(newGifts))
        gifts.value = newGifts
      }

      currentGift.value = { ...initialGift }
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
                  value={currentGift.value.name}
                  onInput={handleChange}
                />
                <button
                  type='button'
                  onClick={() => {
                    currentGift.value = {
                      ...currentGift.value,
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
                !textFieldRule.safeParse(currentGift.value.name).success &&
                <p className='error-message'>El campo es requerido</p>}
            </div>
            <div>
              <input
                className='block w-full'
                name='imageUrl'
                placeholder='Url imagen'
                type='text'
                value={currentGift.value.imageUrl}
                onInput={handleChange}
              />
              {submitted.value &&
                !textFieldRule.safeParse(currentGift.value.imageUrl).success &&
                <p className='error-message'>El campo es requerido</p>}
            </div>
            <div>
              <input
                className='block w-full'
                name='owner'
                placeholder='Propietario'
                type='text'
                value={currentGift.value.owner}
                onInput={handleChange}
              />
              {submitted.value &&
                !textFieldRule.safeParse(currentGift.value.owner).success &&
                <p className='error-message'>El campo es requerido</p>}
            </div>
            <div>
              <input
                className='block w-full'
                name='price'
                placeholder='Precio'
                type='number'
                value={currentGift.value.price}
                onInput={handleChange}
              />
              {submitted.value &&
                !quantityFieldRule.safeParse(Number(currentGift.value.price))
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
                value={currentGift.value.quantity}
                onInput={handleChange}
              />
              {submitted.value &&
                !quantityFieldRule.safeParse(
                  Number(currentGift.value.quantity),
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
              {currentGift.value.id ? 'Editar' : 'Agregar'}
            </button>
          )}
      </footer>
    </form>
  )
}
