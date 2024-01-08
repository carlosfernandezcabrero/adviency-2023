<template>
  <li
    class="flex items-center p-4 border border-gray-200 rounded shadow-sm gap-x-12"
  >
    <span class="flex items-center flex-1 gap-x-4">
      <img
        :src="gift.imageUrl"
        alt="imagen regalo"
        class="p-0.5 border border-pink-300 rounded size-14 aspect-square"
      />
      <div>
        <h3 class="font-medium">
          {{ gift.name }} ({{ gift.quantity }})<span v-if="!anonymous">
            -
            {{
              (gift.price * gift.quantity).toLocaleString('es-ES', {
                style: 'currency',
                currency: 'EUR'
              })
            }}</span
          >
        </h3>
        <p class="text-lg">Propietario: {{ gift.owner || 'No definido' }}</p>
      </div>
    </span>
    <span class="flex items-center gap-x-2" v-if="!anonymous">
      <button
        class="secondary"
        @click="
          () => {
            currentGift = { ...gift }
            showForm = true
          }
        "
        aria-label="editar"
        type="button"
      >
        <PencilIcon class="stroke-[4] size-4" />
      </button>
      <button
        @click="
          () => {
            currentGift = {
              ...gift,
              id: '',
              owner: '',
              quantity: 1
            }
            showForm = true
          }
        "
        aria-label="duplicar"
        type="button"
      >
        <DocumentDuplicateIcon class="stroke-[4] size-4" />
      </button>
      <button
        class="danger"
        @click="handleDeleteGift"
        aria-label="borrar"
        type="button"
      >
        <XMarkIcon class="stroke-[4] size-4" />
      </button>
    </span>
  </li>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { DocumentDuplicateIcon, PencilIcon } from '@heroicons/vue/24/solid'
import { GiftInterface } from '../types'

const { gift } = defineProps<{
  gift: GiftInterface
  anonymous?: boolean
}>()
const gifts = defineModel<GiftInterface[]>('gifts', {
  default: () => []
})
const currentGift = defineModel<GiftInterface>('currentGift')
const showForm = defineModel<boolean>('showForm')

function handleDeleteGift() {
  const newGifts = gifts.value.filter(
    ({ id: _id, owner: _owner }) => _id !== gift.id || _owner !== gift.owner
  )

  gifts.value = newGifts
  localStorage.setItem('gifts', JSON.stringify(newGifts))
}
</script>
