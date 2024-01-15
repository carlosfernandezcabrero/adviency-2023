<script setup lang="ts">
import { onMounted, ref } from 'vue'
import api from './api'
import AddGiftForm from './components/add-gift-form.vue'
import GiftsListItem from './components/gifts-list-item.vue'
import GiftsListSummary from './components/gifts-list-summary.vue'
import { GiftInterface } from './types'

const INITIAL_GIFT: GiftInterface = {
  id: '',
  name: '',
  quantity: 1,
  imageUrl: '',
  owner: '',
  price: 0
}

const gifts = ref<GiftInterface[]>([])
const currentGift = ref<GiftInterface>({ ...INITIAL_GIFT })
const showForm = ref(false)
const loadingData = ref(true)
const showList = ref(false)

onMounted(async () => {
  loadingData.value = true
  gifts.value = await api.gifts.list()
  loadingData.value = false
})

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
</script>

<template>
  <dialog
    class="absolute top-0 grid w-full h-full bg-transparent shadow-xl text-neutral-900 place-content-center"
    v-if="showList"
  >
    <div class="flex flex-col flex-1 gap-10 p-8 bg-white rounded">
      <div class="grid gap-10 bg-white rounded" id="printable">
        <h2 class="text-5xl text-center title">Comprar:</h2>
        <ul class="grid gap-4 list-inside" id="print-list">
          <GiftsListItem
            v-for="gift in gifts"
            :key="`${gift.name}-${gift.owner}`"
            :gift="gift"
            :anonymous="true"
          />
        </ul>
      </div>
      <footer class="flex items-center justify-between">
        <button @click="showList = false">Cerrar</button>
        <button class="primary" @click="printList">Imprimir</button>
      </footer>
    </div>
  </dialog>

  <section
    class="flex flex-col flex-1 gap-16 p-8 bg-white text-neutral-900 rounded shadow-xl min-w-[500px] z-0"
    v-show="!showList"
  >
    <h1 className="text-5xl font-bold text-center title">Regalos:</h1>

    <div class="grid gap-12">
      <AddGiftForm
        :current-gift="currentGift"
        v-model:gifts="gifts"
        v-model:showForm="showForm"
        :initialGift="INITIAL_GIFT"
      />

      <div v-if="!loadingData">
        <ul class="grid gap-4 list-inside" v-if="gifts.length">
          <GiftsListItem
            v-for="gift in gifts"
            :key="`${gift.name}-${gift.owner}`"
            :gift="gift"
            v-model:gifts="gifts"
            v-model:currentGift="currentGift"
            v-model:showForm="showForm"
          />
        </ul>
        <p v-else class="font-semibold text-center text-gray-500">
          No hay regalos Grinch! Agrega algo!
        </p>
      </div>
      <div v-else class="flex flex-col items-center mx-auto gap-y-4">
        <span class="loader"></span>
        <p class="text-2xl font-bold text-pink-500 animate-pulse">
          Cargando tus regalos !!!
        </p>
      </div>

      <GiftsListSummary :gifts="gifts" />
    </div>

    <footer class="grid gap-2" v-if="gifts.length">
      <button class="w-full danger" @click="handleDeleteAllGifts">
        Borrar todo
      </button>
      <button class="w-full" @click="previewList">Previsualizar</button>
    </footer>
  </section>
</template>
