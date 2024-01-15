import { GiftInterface } from '../types'

export function upsertGifts(gift: GiftInterface, gifts: GiftInterface[]) {
  return gift.id
    ? gifts.map((_gift) => (_gift.id === gift.id ? { ...gift } : _gift))
    : [...gifts, { ...gift, id: gift.name }]
}
