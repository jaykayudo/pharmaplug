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
  10: 'pending payment',
  20: 'cancelled',
  30: 'paid',
  40: 'delivered'
})

export const DOCTOR_PER_RATE = Object.freeze({
  0: 'hour',
  1: 'consultation',
})

export const CONSULTATION_STATUS_ALT = Object.freeze({
  PENDING: 1,
  ACCEPTED: 2,
  REJECTED: 3,
  PAID: 4,
  ONGOING: 5,
  FINISHED: 6,
})

export const ORDER_STATUS_ALT = Object.freeze({
  NEW: 10,
  CANCELLED: 20,
  PAID: 30,
  DELIVERED: 40,
})
