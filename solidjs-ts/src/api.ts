import type { GiftInterface } from './types'

export default {
  gifts: {
    list: async (): Promise<GiftInterface[]> => {
      return await new Promise((resolve) =>
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
}
