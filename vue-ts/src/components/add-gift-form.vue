<template>
  <form class="grid gap-4" @submit.prevent="handleSubmit">
    <div class="grid gap-2" v-if="showForm">
      <div class="flex items-center gap-x-2">
        <div class="flex-1">
          <input
            type="text"
            placeholder="Agrega un regalo"
            v-model.trim="currentGift.name"
            class="block w-full"
            name="name"
          />
          <p
            class="error-message"
            v-if="
              submitted && !textFieldRule.safeParse(currentGift.name).success
            "
          >
            El campo es requerido
          </p>
        </div>
        <button
          @click="
            currentGift.name =
              giftsSuggestions[
                Math.floor(Math.random() * giftsSuggestions.length)
              ]
          "
          type="button"
        >
          Sorprenderme
        </button>
      </div>
      <div>
        <input
          type="text"
          placeholder="Url imagen"
          v-model.trim="currentGift.imageUrl"
          class="block w-full"
          name="imageUrl"
        />
        <p
          class="error-message"
          v-if="
            submitted && !textFieldRule.safeParse(currentGift.imageUrl).success
          "
        >
          El campo es requerido
        </p>
      </div>
      <div>
        <input
          type="text"
          placeholder="Propietario"
          v-model.trim="currentGift.owner"
          class="block w-full"
          name="owner"
        />
        <p
          class="error-message"
          v-if="
            submitted && !textFieldRule.safeParse(currentGift.owner).success
          "
        >
          El campo es requerido
        </p>
      </div>
      <div>
        <input
          type="number"
          placeholder="Precio"
          v-model.number="currentGift.price"
          class="block w-full"
          name="price"
        />
        <p
          class="error-message"
          v-if="
            submitted && !quantityFieldRule.safeParse(currentGift.price).success
          "
        >
          El numero debe ser un numero positivo
        </p>
      </div>
      <div>
        <input
          type="number"
          placeholder="Cantidad"
          v-model.number="currentGift.quantity"
          class="block w-full"
          name="quantity"
        />
        <p
          class="error-message"
          v-if="
            submitted &&
            !quantityFieldRule.safeParse(currentGift.quantity).success
          "
        >
          El numero debe ser un entero positivo
        </p>
      </div>
    </div>
    <footer
      class="flex"
      :class="[showForm ? 'justify-between' : 'justify-center']"
    >
      <button type="button" class="primary" @click="showForm = !showForm">
        {{ showForm ? 'Cerrar' : 'Agregar regalo' }}
      </button>
      <button type="submit" class="primary" v-if="showForm">
        {{ currentGift.id ? 'Editar' : 'Agregar' }}
      </button>
    </footer>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getGiftSchema } from '../schemas'
import { GiftInterface } from '../types'

const { initialGift } = defineProps<{
  initialGift: GiftInterface
}>()

const gifts = defineModel<GiftInterface[]>('gifts', {
  required: true
})
const currentGift = defineModel<GiftInterface>('currentGift', {
  required: true
})
const showForm = defineModel<boolean>('showForm', {
  required: true
})

const submitted = ref(false)

const giftsSuggestions = ['Pantalla', 'Celular', 'Laptop', 'Audifonos']
const { giftSchema, textFieldRule, quantityFieldRule } = getGiftSchema()

function handleSubmit() {
  submitted.value = true

  if (giftSchema.safeParse(currentGift.value).success) {
    if (currentGift.value.id) {
      const giftIndex = gifts.value.findIndex(
        ({ id: _id }) => _id === currentGift.value.id
      )
      gifts.value[giftIndex] = { ...currentGift.value }
    } else {
      gifts.value.push({ ...currentGift.value, id: currentGift.value.name })
    }

    localStorage.setItem('gifts', JSON.stringify(gifts.value))

    currentGift.value = { ...initialGift }
    submitted.value = false
  }
}
</script>
