export default {
  home: '/',
  drugStore: '/drug-store',
  drugStoreFull: '/drug-store-all',
  drugs: (id) => `/sickness/${id}/drugs`,
  drugDetails: (id) => `/drugs/${id}`,
  doctorPortal: '/doctor-portal',
  allDoctors: `/all-doctors`,
  scheduleConsultation: (id) => `/schedule-consultation/${id}`,
  login: '/login',
  doctorRegister: '/doctor/register',
  register: '/register',
  registerPreview: '/choose-user',
  cart: '/cart',
  checkout: '/checkout',
  blogs: '/blogs',
  partners: '/partners',
  forgotPassword: '/forgot-password',
  forgotPasswordVerify: '/forgot-password-verify',
  resetPassword: '/reset-password',

  // Doctors paths
  doctorDashboard: '/doctor/dashboard',
  doctorWallet: '/doctor/wallet',
  doctorSettings: '/doctor/settings',
  doctorConsultations: '/doctor/consultations',
  doctorConsultationsDetails: (id) => `/doctor/consultations/${id}`,
  doctorReferral: '/doctor/referral',
  doctorSupport: '/doctor/support',

  // User paths
  userDashboard: '/account/dashboard',
  userHistory: '/account/history',
  userSettings: '/account/settings',
  userReferral: '/account/referral',
  userSupport: '/account/support',
}
