export const CONSULTATION_STATUS = Object.freeze({
  1: 'pending',
  2: 'accepted',
  3: 'rejected',
  4: 'paid',
  5: 'ongoing',
  6: 'finished',
})

export const WALLET_TRANSACTION_TYPE = Object.freeze({
  0: 'initialized',
  1: 'verified',
  2: 'declined',
  3: 'invalid',
})

export const ORDER_STATUS = Object.freeze({
  10: 'open',
  20: 'closed',
})

export const DOCTOR_PER_RATE = Object.freeze({
  0: 'hour',
  1: 'consultation',
})
