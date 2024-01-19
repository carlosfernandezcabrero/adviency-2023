/* eslint-disable @typescript-eslint/indent */
import { CommonModule } from '@angular/common'
import {
  Component,
  EventEmitter,
  Input,
  Output,
  type OnChanges
} from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { GIFT } from '../../../../default-values'
import { getGiftSchema } from '../../../../schemas'
import type { GiftInterface } from '../../../../types'

@Component({
  selector: 'app-add-gift-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-gift-form.component.html'
})
export class AddGiftFormComponent implements OnChanges {
  @Input() currentGift!: GiftInterface
  @Input() showForm!: boolean
  @Input() gifts!: GiftInterface[]

  @Output() showFormChange = new EventEmitter<boolean>()
  @Output() giftsChange = new EventEmitter<GiftInterface[]>()

  submitted = false

  fields = new FormGroup({
    name: new FormControl(GIFT.name),
    quantity: new FormControl(GIFT.quantity),
    price: new FormControl(GIFT.price),
    imageUrl: new FormControl(GIFT.imageUrl),
    owner: new FormControl(GIFT.owner)
  })

  giftsSuggestions = ['Pantalla', 'Celular', 'Laptop', 'Audifonos']
  giftSchema = getGiftSchema()

  randomName() {
    this.fields.patchValue({
      name: this.giftsSuggestions[
        Math.floor(Math.random() * this.giftsSuggestions.length)
      ]
    })
  }

  closeForm() {
    if (!this.showForm) {
      this.fields.setValue({
        quantity: GIFT.quantity,
        name: GIFT.name,
        price: GIFT.price,
        imageUrl: GIFT.imageUrl,
        owner: GIFT.owner
      })
    }
    this.showForm = !this.showForm
  }

  handleSubmit() {
    this.submitted = true

    const giftToSubmit: GiftInterface = {
      ...(this.fields.value as GiftInterface),
      quantity: Number(this.fields.value.quantity),
      price: Number(this.fields.value.price)
    }

    if (this.giftSchema.giftSchema.safeParse(giftToSubmit).success) {
      const newGifts = this.currentGift.id
        ? this.gifts.map((_gift) =>
            _gift.id === this.currentGift.id
              ? { ...giftToSubmit, id: this.currentGift.id }
              : _gift
          )
        : [...this.gifts, { ...giftToSubmit, id: this.fields.value.name }]

      localStorage.setItem('gifts', JSON.stringify(newGifts))
      this.giftsChange.emit(newGifts as GiftInterface[])

      this.fields.setValue({
        quantity: GIFT.quantity,
        name: GIFT.name,
        price: GIFT.price,
        imageUrl: GIFT.imageUrl,
        owner: GIFT.owner
      })
      this.submitted = false
    }
  }

  ngOnChanges(): void {
    this.fields.setValue({
      quantity: this.currentGift.quantity,
      name: this.currentGift.name,
      price: this.currentGift.price,
      imageUrl: this.currentGift.imageUrl,
      owner: this.currentGift.owner
    })
  }
}
