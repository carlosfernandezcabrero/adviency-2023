import { Component } from '@angular/core'
import { GIFT } from '../default-values'
import type { GiftInterface } from '../types'
import { AddGiftFormComponent } from './modules/gift/add-gift-form/add-gift-form.component'
import { GiftListItemComponent } from './modules/gift/gift-list-item/gift-list-item.component'
import { GiftListSummaryComponent } from './modules/gift/gift-list-summary/gift-list-summary.component'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ApiService } from './services/api.service'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    GiftListSummaryComponent,
    AddGiftFormComponent,
    GiftListItemComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'angular17'

  gifts: GiftInterface[] = []

  showList = false
  currentGift = { ...GIFT }
  loadingData = false
  showForm = false

  constructor(private readonly apiService: ApiService) {
    this.loadingData = true

    void this.apiService.getGifts().then((gifts) => {
      this.gifts = gifts as GiftInterface[]
      this.loadingData = false
    })
  }

  handleDeleteAllGifts() {
    this.gifts = []
    localStorage.removeItem('gifts')
  }

  previewList() {
    window.scrollTo(0, 0)
    this.showList = true
  }

  printList() {
    window.print()
  }
}
