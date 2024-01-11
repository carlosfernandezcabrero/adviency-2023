import { Signal } from '@preact/signals'
import { GiftInterface } from '../types.ts'

export default function GiftsListSummary(
  { gifts }: { gifts: Signal<GiftInterface[]> },
) {
  return (
    <footer className='border-t border-gray-500 pt-2'>
      <p className='text-center font-medium'>
        Total: {gifts.value
          .reduce((acc, curr) => {
            return acc + curr.price * curr.quantity
          }, 0)
          .toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR',
          })}
      </p>
    </footer>
  )
}
