export const host = 'http://192.168.118.208:8000/api'

export const endpoints = {
  stories: `${host}/stories/`,
  commonSicknesses: `${host}/common/sicknesses/`,
  sicknesses: `${host}/sicknesses/`,
  sicknessesDetails: (id: string) => `${host}/sicknesses/${id}/`,
  commonDoctorCategories: `${host}/common/doctor-categories/`,
  doctorCategories: `${host}/doctor-categories/`,
  doctorList: `${host}/doctors/`,
  doctorDetails: (id: string) => `${host}/doctors/${id}/`,
  doctorAvailabilityVerify: (id: string) =>
    `${host}/doctors/${id}/verify-schedule/`,
  doctorConsultFee: (id: string) => `${host}/doctors/${id}/get-consult-fee/`,
  drugs: (sickness_id: string) => `${host}/sicknesses/${sickness_id}/drugs/`,
  drugSearch: `${host}/drugs/`,
  drugDetails: (drugId: string) => `${host}/drugs/${drugId}/`,
  drugAlternatives: (drugId: string) => `${host}/drugs/${drugId}/alternatives/`,
  scheduleAppointment: `${host}/book-consult/`,
  cart: (id: string) => `${host}/cart/${id}/`,
  addToCart: `${host}/cart/add/`,
  removeFromCart: `${host}/cart/remove/`,
  cartQuantityIncrease: `${host}/cart/increase-quantity/`,
  cartQuantityDecrease: `${host}/cart/decrease-quantity/`,
  checkout: `${host}/checkout/`,
  orderVerify: `${host}/order-verify/`,
  orderPay: `${host}/orders/pay/`,
  orderPayVerify: `${host}/orders/pay_verify/`,
  consultationPay: `${host}/consultations/pay/`,
  consultationPayVerify: `${host}/consultations/pay_verify/`,
  // auth
  login: `${host}/login/`,
  googleSignIn: `${host}/login/google/`,
  register: `${host}/register/`,
  googleSignUp: `${host}/register/google/`,
  registerDoctor: `${host}/register-doctor/`,
  refreshToken: `${host}/token/refresh/`,
  changePassword: `${host}/change-password/`,
  forgotPassword: `${host}/forgot-password/`,
  verifyCode: `${host}/verify-code/`,
  resetPassword: `${host}/reset-password/`,
  //auth user
  userDashboard: `${host}/dashboard/`,
  notifications: `${host}/notifications/`,
  notificationsRead: (id: string) => `${host}/notifications/${id}/read/`,
  profile: `${host}/profile/`,
  consultationHistory: `${host}/consultations/`,
  orderHistory: `${host}/orders/`,
}

export const doctorEndpoints = {
  profile: `${host}/doctor/profile/`,
  dashboardStat: `${host}/doctor/dashboard-stats/`,
  earningStat: `${host}/doctor/earnig-stats/`,
  wallet: `${host}/doctor/wallet/`,
  walletTransactions: `${host}/doctor/wallet/transactions/`,
  walletEarnedAmounts: `${host}/doctor/wallet/earned-amount/`,
  consultations: `${host}/doctor/consults`,
  consultationDetails: (id: string) => `${host}/doctor/consults/${id}/`,
  consultationAccept: `${host}/doctor/consults/accept/`,
  consultationReschedule: `${host}/doctor/consults/reschedule/`,
  schedules: `${host}/doctor/schedules/`,
  scheduleCreate: `${host}/doctor/schedules/create/`,
}
