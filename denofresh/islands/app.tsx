import { useSignal } from '@preact/signals'
import { useEffect } from 'preact/hooks'
import api from '../api.ts'
import AddGiftForm from '../components/add-gift-form.tsx'
import GiftsListItem from '../components/gifts-list-item.tsx'
import GiftsListSummary from '../components/gifts-list-summary.tsx'
import Spinner from '../components/spinner.tsx'
import { GiftInterface } from '../types.ts'

const INITIAL_GIFT: GiftInterface = {
  id: '',
  name: '',
  quantity: 1,
  imageUrl: '',
  owner: '',
  price: 0,
}

export default function App() {
  const gifts = useSignal<GiftInterface[]>([])
  const currentGift = useSignal<GiftInterface>({
    ...INITIAL_GIFT,
  })
  const showForm = useSignal(false)
  const loadingData = useSignal(true)
  const showList = useSignal(false)

  useEffect(() => {
    loadingData.value = true

    api.gifts.list().then((_gifts) => {
      gifts.value = _gifts
      loadingData.value = false
    })
  }, [])

  function handleDeleteAllGifts() {
    gifts.value = []
    localStorage.removeItem('gifts')
  }

  function previewList() {
    window.scrollTo(0, 0)
    showList.value = true
  }

  function printList() {
    window.print()
  }

  return (
    <>
      {showList.value
        ? (
          <dialog className='absolute top-0 grid h-full w-full place-content-center bg-transparent text-neutral-900 shadow-xl'>
            <div className='flex flex-1 flex-col gap-10 rounded bg-white p-8'>
              <div className='grid gap-10 rounded bg-white' id='printable'>
                <h2 className='title text-center text-5xl'>Comprar:</h2>
                <ul className='grid list-inside gap-4' id='print-list'>
                  {gifts.value.map((gift: GiftInterface) => (
                    <GiftsListItem
                      key={`${gift.name}-${gift.owner}`}
                      anonymous
                      gift={gift}
                    />
                  ))}
                </ul>
              </div>
              <footer className='flex items-center justify-between'>
                <button type='button' onClick={() => showList.value = false}>
                  Cerrar
                </button>
                <button className='primary' type='button' onClick={printList}>
                  Imprimir
                </button>
              </footer>
            </div>
          </dialog>
        )
        : (
          <section className='z-0 flex min-w-[500px] flex-col gap-16 rounded bg-white p-8 text-neutral-900 shadow-xl'>
            <h1 className='title text-center text-5xl font-bold'>Regalos:</h1>

            <div className='grid gap-12'>
              <AddGiftForm
                initialGift={INITIAL_GIFT}
                currentGift={currentGift}
                gifts={gifts}
                showForm={showForm}
              />

              {loadingData.value ? <Spinner /> : (
                <div>
                  {gifts.value.length
                    ? (
                      <ul className='grid list-inside gap-4'>
                        {gifts.value.map((gift) => (
                          <GiftsListItem
                            key={`${gift.name}-${gift.owner}`}
                            gift={gift}
                            currentGift={currentGift}
                            gifts={gifts}
                            showForm={showForm}
                          />
                        ))}
                      </ul>
                    )
                    : (
                      <p className='text-center font-semibold text-gray-500'>
                        No hay regalos Grinch! Agrega algo!
                      </p>
                    )}
                </div>
              )}

              {gifts.value.length ? <GiftsListSummary gifts={gifts} /> : null}
            </div>

            {gifts.value.length
              ? (
                <footer className='grid gap-2'>
                  <button
                    className='danger w-full'
                    type='button'
                    onClick={handleDeleteAllGifts}
                  >
                    Borrar todo
                  </button>
                  <button
                    className='w-full'
                    type='button'
                    onClick={previewList}
                  >
                    Previsualizar
                  </button>
                </footer>
              )
              : null}
          </section>
        )}
    </>
  )
}
