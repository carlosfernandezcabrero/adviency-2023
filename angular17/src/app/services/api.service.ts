import { Injectable } from '@angular/core'
import type { GiftInterface } from '../../types'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  getGifts() {
    return new Promise((resolve) =>
      setTimeout(() => {
        const giftsFromLocalStorage = localStorage.getItem('gifts')

        if (giftsFromLocalStorage != null) {
          resolve(JSON.parse(giftsFromLocalStorage) as GiftInterface[])
        }

        resolve([])
      }, 1_500)
    )
  }
}
