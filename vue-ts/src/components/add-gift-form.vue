<template>
  <form class="grid gap-4" @submit.prevent="handleSubmit">
    <div class="grid gap-2" v-if="showForm">
      <div>
        <div class="flex items-center gap-x-2">
          <input
            type="text"
            placeholder="Agrega un regalo"
            v-model.trim="fields.name"
            class="flex-1 block w-full"
            name="name"
          />
          <button
            @click="
              fields.name =
                giftsSuggestions[
                  Math.floor(Math.random() * giftsSuggestions.length)
                ]
            "
            type="button"
          >
            Sorprenderme
          </button>
        </div>
        <p
          class="error-message"
          v-if="submitted && !textFieldRule.safeParse(fields.name).success"
        >
          El campo es requerido
        </p>
      </div>
      <div>
        <input
          type="text"
          placeholder="Url imagen"
          v-model.trim="fields.imageUrl"
          class="block w-full"
          name="imageUrl"
        />
        <p
          class="error-message"
          v-if="submitted && !textFieldRule.safeParse(fields.imageUrl).success"
        >
          El campo es requerido
        </p>
      </div>
      <div>
        <input
          type="text"
          placeholder="Propietario"
          v-model.trim="fields.owner"
          class="block w-full"
          name="owner"
        />
        <p
          class="error-message"
          v-if="submitted && !textFieldRule.safeParse(fields.owner).success"
        >
          El campo es requerido
        </p>
      </div>
      <div>
        <input
          type="number"
          placeholder="Precio"
          v-model.number="fields.price"
          class="block w-full"
          name="price"
        />
        <p
          class="error-message"
          v-if="submitted && !quantityFieldRule.safeParse(fields.price).success"
        >
          El numero debe ser un numero positivo
        </p>
      </div>
      <div>
        <input
          type="number"
          placeholder="Cantidad"
          v-model.number="fields.quantity"
          class="block w-full"
          name="quantity"
        />
        <p
          class="error-message"
          v-if="
            submitted && !quantityFieldRule.safeParse(fields.quantity).success
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
        {{ fields.id ? 'Editar' : 'Agregar' }}
      </button>
    </footer>
  </form>
</template>

<script setup lang="ts">
import { ref, toRef, watch } from 'vue'
import { getGiftSchema } from '../schemas'
import { upsertGifts } from '../services/gifts.service'
import { GiftInterface } from '../types'

const props = defineProps<{
  initialGift: GiftInterface
  currentGift: GiftInterface
}>()

const gifts = defineModel<GiftInterface[]>('gifts', {
  required: true
})
const showForm = defineModel<boolean>('showForm', {
  required: true
})

const submitted = ref(false)
const fields = ref({ ...props.initialGift })

const currentGiftWatcher = toRef(props, 'currentGift')

watch(currentGiftWatcher, (value) => {
  fields.value = { ...value }
})

const giftsSuggestions = ['Pantalla', 'Celular', 'Laptop', 'Audifonos']
const { giftSchema, textFieldRule, quantityFieldRule } = getGiftSchema()

function handleSubmit() {
  submitted.value = true

  if (giftSchema.safeParse(fields.value).success) {
    const newGifts = upsertGifts(fields.value, gifts.value)

    gifts.value = newGifts
    localStorage.setItem('gifts', JSON.stringify(newGifts))
    fields.value = { ...props.initialGift }

    submitted.value = false
  }
}
</script>
