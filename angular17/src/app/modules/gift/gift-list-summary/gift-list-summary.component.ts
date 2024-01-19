import { Component, Input, type OnChanges } from '@angular/core'
import type { GiftInterface } from '../../../../types'

@Component({
  selector: 'app-gift-list-summary',
  standalone: true,
  imports: [],
  templateUrl: './gift-list-summary.component.html'
})
export class GiftListSummaryComponent implements OnChanges {
  @Input() gifts: GiftInterface[] = []

  totalPrice = ''

  ngOnChanges() {
    this.totalPrice = this.gifts
      .reduce((acc, curr) => {
        return acc + curr.price * curr.quantity
      }, 0)
      .toLocaleString('es-ES', {
        style: 'currency',
        currency: 'EUR'
      })
  }
}
