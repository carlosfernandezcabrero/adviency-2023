import { Show, type Accessor, type Setter } from 'solid-js'
import type { GiftInterface } from '../types'

interface PropsInterface {
  gift: GiftInterface
  anonymous?: boolean
  setShowForm?: Setter<boolean> | ((value: boolean) => unknown)
  setCurrentGift?: Setter<GiftInterface> | ((value: GiftInterface) => unknown)
  gifts?: Accessor<GiftInterface[]>
  setGifts?: Setter<GiftInterface[]> | ((value: GiftInterface[]) => unknown)
}

export default function GiftsListItem({
  gift,
  anonymous = false,
  setCurrentGift = (_: GiftInterface) => {},
  setShowForm = (_: boolean) => {},
  gifts = () => [],
  setGifts = (_: GiftInterface[]) => {}
}: PropsInterface) {
  function handleDeleteGift() {
    const newGifts = gifts().filter(
      ({ id: _id, owner: _owner }) => _id !== gift.id || _owner !== gift.owner
    )

    localStorage.setItem('gifts', JSON.stringify(newGifts))
    setGifts(newGifts)
  }

  return (
    <li class="flex items-center gap-x-12 rounded border border-gray-200 p-4 shadow-sm">
      <span class="flex flex-1 items-center gap-x-4">
        <img
          alt="imagen regalo"
          class="aspect-square w-14 h-14 rounded border border-pink-300 p-0.5"
          src={gift.imageUrl}
        />
        <div>
          <h3 class="font-medium">
            {gift.name} ({gift.quantity})
            <Show when={!anonymous}>
              <span>
                {' '}
                -{' '}
                {(gift.price * gift.quantity).toLocaleString('es-ES', {
                  style: 'currency',
                  currency: 'EUR'
                })}
              </span>
            </Show>
          </h3>
          <p class="text-lg">Propietario: {gift.owner || 'No definido'}</p>
        </div>
      </span>
      <Show when={!anonymous}>
        <span class="flex items-center gap-x-2">
          <button
            aria-label="editar"
            class="secondary"
            onClick={() => {
              setCurrentGift({ ...gift })
              setShowForm(true)
            }}
            type="button"
          >
            <svg
              class="stroke-[4] w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712Zm-2.218 5.93-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
            </svg>
          </button>
          <button
            aria-label="duplicar"
            onClick={() => {
              setCurrentGift({
                ...gift,
                id: '',
                owner: '',
                quantity: 1
              })
              setShowForm(true)
            }}
            type="button"
          >
            <svg
              class="stroke-[4] w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0 1 21 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 0 1 7.5 16.125V3.375Z" />
              <path d="M15 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 17.25 7.5h-1.875A.375.375 0 0 1 15 7.125V5.25ZM4.875 6H6v10.125A3.375 3.375 0 0 0 9.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V7.875C3 6.839 3.84 6 4.875 6Z" />
            </svg>
          </button>
          <button
            aria-label="borrar"
            class="danger"
            onClick={handleDeleteGift}
            type="button"
          >
            <svg
              class="stroke-[4] w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 18 18 6M6 6l12 12"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </span>
      </Show>
    </li>
  )
}