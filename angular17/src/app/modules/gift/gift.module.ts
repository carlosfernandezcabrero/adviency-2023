import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { AddGiftFormComponent } from './add-gift-form/add-gift-form.component'
import { GiftListItemComponent } from './gift-list-item/gift-list-item.component'
import { GiftListSummaryComponent } from './gift-list-summary/gift-list-summary.component'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AddGiftFormComponent,
    GiftListItemComponent,
    GiftListSummaryComponent
  ],
  exports: [
    AddGiftFormComponent,
    GiftListItemComponent,
    GiftListSummaryComponent
  ]
})
export class GiftModule {}
