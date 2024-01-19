import {
  Component,
  EventEmitter,
  Input,
  Output,
  type OnChanges
} from '@angular/core'
import type { GiftInterface } from '../../../../types'

@Component({
  selector: 'app-gift-list-item',
  standalone: true,
  imports: [],
  templateUrl: './gift-list-item.component.html'
})
export class GiftListItemComponent implements OnChanges {
  @Input() gift!: GiftInterface
  @Input() anonymous!: boolean
  @Input() gifts!: GiftInterface[]
  @Input() showForm!: boolean
  @Input() currentGift!: GiftInterface

  @Output() giftsChange = new EventEmitter<GiftInterface[]>()
  @Output() showFormChange = new EventEmitter<boolean>()
  @Output() currentGiftChange = new EventEmitter<GiftInterface>()

  totalPrice = ''

  handleDeleteGift() {
    const newGifts = this.gifts.filter(
      ({ id: _id, owner: _owner }) =>
        _id !== this.gift?.id || _owner !== this.gift?.owner
    )

    localStorage.setItem('gifts', JSON.stringify(newGifts))
    this.giftsChange.emit(newGifts)
  }

  cloneGift() {
    this.currentGiftChange.emit({
      ...this.gift,
      id: '',
      owner: '',
      quantity: 1
    })
    this.showFormChange.emit(true)
  }

  editGift() {
    this.currentGiftChange.emit({ ...this.gift })
    this.showFormChange.emit(true)
  }

  ngOnChanges() {
    this.totalPrice = (this.gift.price * this.gift.quantity).toLocaleString(
      'es-ES',
      {
        style: 'currency',
        currency: 'EUR'
      }
    )
  }
}
