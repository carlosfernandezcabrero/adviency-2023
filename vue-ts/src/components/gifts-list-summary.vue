<template>
  <footer class="pt-2 border-t border-gray-500" v-if="gifts.length">
    <p class="font-medium text-center">
      Total:
      {{
        gifts
          .reduce((acc, curr) => {
            return acc + curr.price * curr.quantity
          }, 0)
          .toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR'
          })
      }}
    </p>
  </footer>
</template>

<script setup lang="ts">
import { GiftInterface } from '../types'

defineProps<{
  gifts: GiftInterface[]
}>()
</script>
