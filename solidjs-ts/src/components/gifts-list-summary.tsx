import type { Accessor } from 'solid-js'
import type { GiftInterface } from '../types'

export default function GiftsListSummary({
  gifts
}: {
  gifts: Accessor<GiftInterface[]>
}) {
  return (
    <footer class="border-t border-gray-500 pt-2">
      <p class="text-center font-medium">
        Total:{' '}
        {gifts()
          .reduce((acc, curr) => {
            return acc + curr.price * curr.quantity
          }, 0)
          .toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR'
          })}
      </p>
    </footer>
  )
}
