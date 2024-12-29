export const host = 'http://127.0.0.1:8000/api'

export const endpoints = {
  stories: `${host}/stories/`,
  commonSicknesses: `${host}/common/sicknesses/`,
  sicknesses: `${host}/sicknesses/`,
  sicknessesDetails: (id) => `${host}/sicknesses/${id}/`,
  commonDoctorCategories: `${host}/common/doctor-categories/`,
  doctorCategories: `${host}/doctor-categories/`,
  doctorList: `${host}/doctors/`,
  doctorDetails: (id) => `${host}/doctors/${id}/`,
  doctorAvailabilityVerify: (id) => `${host}/doctors/${id}/verify-schedule/`,
  doctorConsultFee: (id) => `${host}/doctors/${id}/get-consult-fee/`,
  drugs: (sickness_id) => `${host}/sicknesses/${sickness_id}/drugs/`,
  drugDetails: (drugId) => `${host}/drugs/${drugId}/`,
  drugAlternatives: (drugId) => `${host}/drugs/${drugId}/alternatives/`,
  scheduleAppointment: `${host}/book-consult/`,
  cart: (id) => `${host}/cart/${id}/`,
  addToCart: `${host}/cart/add/`,
  removeFromCart: `${host}/cart/remove/`,
  cartQuantityIncrease: `${host}/cart/increase-quantity/`,
  cartQuantityDecrease: `${host}/cart/decrease-quantity/`,
  checkout: `${host}/checkout/`,
  orderVerify: `${host}/order-verify/`,
  // auth
  login: `${host}/login/`,
  googleSignIn: `${host}/login/google/`,
  register: `${host}/register/`,
  googleSignUp: `${host}/register/google/`,
  registerDoctor: `${host}/register-doctor/`,
  refreshToken: `${host}/token/refresh/`,
  changePassword: `${host}/change-password/`,
  forgotPassword: `${host}/forgot-password/`,
  resetPassword: `${host}/reset-password/`,
  //auth user
  userDashboard: `${host}/dashboard/`,
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
  consultationDetails: (id) => `${host}/doctor/consults/${id}/`,
  consultationAccept: `${host}/doctor/consults/accept/`,
  consultationReschedule: `${host}/doctor/consults/reschedule/`,
  consultationReject: `${host}/doctor/consults/reject/`,
  schedules: `${host}/doctor/schedules/`,
  scheduleCreate: `${host}/doctor/schedules/create/`,
}
