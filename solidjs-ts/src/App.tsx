import { For, Show, batch, createSignal } from 'solid-js'
import api from './api'
import AddGiftForm from './components/add-gift-form'
import GiftsListItem from './components/gifts-list-item'
import GiftsListSummary from './components/gifts-list-summary'
import Spinner from './components/spinner'
import type { GiftInterface } from './types'

const INITIAL_GIFT: GiftInterface = {
  id: '',
  name: '',
  quantity: 1,
  imageUrl: '',
  owner: '',
  price: 0
}

export default function App() {
  const [gifts, setGifts] = createSignal<GiftInterface[]>([])
  const [currentGift, setCurrentGift] = createSignal<GiftInterface>({
    ...INITIAL_GIFT
  })
  const [loading, setLoading] = createSignal(true)
  const [showForm, setShowForm] = createSignal(false)
  const [showList, setShowList] = createSignal(false)

  api.gifts.list().then((data) => {
    batch(() => {
      setGifts(data)
      setLoading(false)
    })
  })

  function handleDeleteAllGifts() {
    setGifts([])
    localStorage.removeItem('gifts')
  }

  function previewList() {
    window.scrollTo(0, 0)
    setShowList(true)
  }

  function printList() {
    window.print()
  }

  return (
    <Show
      fallback={
        <section class="z-0 flex min-w-[500px] flex-col gap-16 rounded bg-white p-8 text-neutral-900 shadow-xl">
          <h1 class="title text-center text-5xl font-bold">Regalos:</h1>

          <div class="grid gap-12">
            <AddGiftForm
              currentGift={currentGift}
              gifts={gifts}
              initialGift={INITIAL_GIFT}
              setGifts={setGifts}
              setShowForm={setShowForm}
              showForm={showForm}
            />

            <Show
              fallback={
                <div>
                  <Show
                    fallback={
                      <p class="text-center font-semibold text-gray-500">
                        No hay regalos Grinch! Agrega algo!
                      </p>
                    }
                    when={gifts().length}
                  >
                    <ul class="grid list-inside gap-4">
                      <For each={gifts()}>
                        {(gift) => (
                          <GiftsListItem
                            gift={gift}
                            gifts={gifts}
                            setCurrentGift={setCurrentGift}
                            setGifts={setGifts}
                            setShowForm={setShowForm}
                          />
                        )}
                      </For>
                    </ul>
                  </Show>
                </div>
              }
              when={loading()}
            >
              <Spinner />
            </Show>

            <Show when={gifts().length}>
              <GiftsListSummary gifts={gifts} />
            </Show>
          </div>

          <Show when={gifts().length}>
            <footer class="grid gap-2">
              <button
                class="danger w-full"
                onClick={handleDeleteAllGifts}
                type="button"
              >
                Borrar todo
              </button>
              <button class="w-full" onClick={previewList} type="button">
                Previsualizar
              </button>
            </footer>
          </Show>
        </section>
      }
      when={showList()}
    >
      <dialog class="absolute top-0 grid h-full w-full place-content-center bg-transparent text-neutral-900 shadow-xl">
        <div class="flex flex-1 flex-col gap-10 rounded bg-white p-8">
          <div class="grid gap-10 rounded bg-white" id="printable">
            <h2 class="title text-center text-5xl">Comprar:</h2>
            <ul class="grid list-inside gap-4" id="print-list">
              <For each={gifts()}>
                {(gift) => <GiftsListItem anonymous gift={gift} />}
              </For>
            </ul>
          </div>
          <footer class="flex items-center justify-between">
            <button onClick={() => setShowList(false)} type="button">
              Cerrar
            </button>
            <button class="primary" onClick={printList} type="button">
              Imprimir
            </button>
          </footer>
        </div>
      </dialog>
    </Show>
  )
}
