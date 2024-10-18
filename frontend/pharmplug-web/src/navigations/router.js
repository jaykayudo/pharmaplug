import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import FullLayout from '../components/fullLayout/index.js'
import DoctorRoute from '../pages/authPages/doctorPages/doctorRoute.js'
import Path from './constants.js'
import UserRoute from '../pages/authPages/userPages/userRoute.js'
import NotFound from '../pages/notFound/index.js'
import SiteLoader from '../components/loader/index.js'

const Home = lazy(() => import('../pages/home/index.js'))
const DrugStore = lazy(() => import('../pages/drugStore/index.js'))
const DrugStoreFull = lazy(() => import('../pages/drugStoreFull/index.js'))
const DrugsList = lazy(() => import('../pages/drugList/index.js'))
const DrugsDetails = lazy(() => import('../pages/drugDetails/index.js'))
const Cart = lazy(() => import('../pages/cart/index.js'))
const Checkout = lazy(() => import('../pages/checkout/index.js'))
const DoctorPortal = lazy(() => import('../pages/doctorPortal/index.js'))
const DoctorPortalCategory = lazy(
  () => import('../pages/doctorPortalCategory/index.js'),
)
const ScheduleConsultation = lazy(
  () => import('../pages/scheduleConsultation/index.js'),
)

const Login = lazy(() => import('../pages/login/index.js'))
const Register = lazy(() => import('../pages/register/index.js'))
const DoctorRegister = lazy(() => import('../pages/doctorRegister/index.js'))
const RegisterPreview = lazy(() => import('../pages/registerPreview/index.js'))
const ForgotPassword = lazy(() => import('../pages/forgotPassword/index.js'))
const VerifyForgotPasswordCode = lazy(
  () => import('../pages/forgotPassword/verify.js'),
)
const ResetPassword = lazy(() => import('../pages/forgotPassword/reset.js'))

// Doctor pages
const DoctorDashboard = lazy(
  () => import('../pages/authPages/doctorPages/home/index.js'),
)
const DoctorWallet = lazy(
  () => import('../pages/authPages/doctorPages/wallet/index.js'),
)
const DoctorConsultation = lazy(
  () => import('../pages/authPages/doctorPages/consultation/index.js'),
)
const DoctorSettings = lazy(
  () => import('../pages/authPages/doctorPages/settings/index.js'),
)
const DoctorReferral = lazy(
  () => import('../pages/authPages/doctorPages/referral/index.js'),
)

//User Pages
const UserDashboard = lazy(
  () => import('../pages/authPages/userPages/home/index.js'),
)
const UserHistory = lazy(
  () => import('../pages/authPages/userPages/history/index.js'),
)
const UserSettings = lazy(
  () => import('../pages/authPages/userPages/settings/index.js'),
)

const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<SiteLoader />}>
        <Routes>
          <Route
            path={Path.home}
            element={<FullLayout children={<Home />} />}
          />
          <Route
            path={Path.drugStore}
            element={<FullLayout children={<DrugStore />} />}
          />
          <Route
            path={Path.drugStoreFull}
            element={<FullLayout children={<DrugStoreFull />} />}
          />
          <Route
            path={Path.drugs(':id')}
            element={<FullLayout children={<DrugsList />} />}
          />
          <Route
            path={Path.drugDetails(':id')}
            element={<FullLayout children={<DrugsDetails />} />}
          />
          <Route
            path={Path.cart}
            element={<FullLayout children={<Cart />} />}
          />
          <Route
            path={Path.checkout}
            element={<FullLayout children={<Checkout />} />}
          />
          <Route
            path={Path.doctorPortal}
            element={<FullLayout children={<DoctorPortal />} />}
          />
          <Route
            path={Path.allDoctors}
            element={<FullLayout children={<DoctorPortalCategory />} />}
          />
          <Route
            path={Path.scheduleConsultation(':id')}
            element={<FullLayout children={<ScheduleConsultation />} />}
          />

          <Route
            path={Path.login}
            element={<FullLayout children={<Login />} />}
          />
          <Route
            path={Path.register}
            element={<FullLayout children={<Register />} />}
          />
          <Route
            path={Path.registerPreview}
            element={<FullLayout children={<RegisterPreview />} />}
          />
          <Route
            path={Path.doctorRegister}
            element={<FullLayout children={<DoctorRegister />} />}
          />
          <Route
            path={Path.forgotPassword}
            element={<FullLayout children={<ForgotPassword />} />}
          />
          <Route
            path={Path.forgotPasswordVerify}
            element={<FullLayout children={<VerifyForgotPasswordCode />} />}
          />
          <Route
            path={Path.resetPassword}
            element={<FullLayout children={<ResetPassword />} />}
          />

          {/* Doctor routes */}
          <Route
            path={Path.doctorDashboard}
            element={<DoctorRoute children={<DoctorDashboard />} />}
          />
          <Route
            path={Path.doctorWallet}
            element={<DoctorRoute children={<DoctorWallet />} />}
          />
          <Route
            path={Path.doctorConsultations}
            element={<DoctorRoute children={<DoctorConsultation />} />}
          />
          <Route
            path={Path.doctorSettings}
            element={<DoctorRoute children={<DoctorSettings />} />}
          />
          <Route
            path={Path.doctorReferral}
            element={<DoctorRoute children={<DoctorReferral />} />}
          />

          {/* User routes */}
          <Route
            path={Path.userDashboard}
            element={<UserRoute children={<UserDashboard />} />}
          />
          <Route
            path={Path.userHistory}
            element={<UserRoute children={<UserHistory />} />}
          />
          <Route
            path={Path.userSettings}
            element={<UserRoute children={<UserSettings />} />}
          />

          <Route path="*" element={<FullLayout children={<NotFound />} />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
export default Router
