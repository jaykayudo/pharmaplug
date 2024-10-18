import SideLayout from '../../../components/sideLayout/index.js'
import { AuthContext } from '../../../context/authContext.js'
import { useContext } from 'react'
import NotFound from '../../notFound/index.js'

const DoctorRoute = ({ children }) => {
  const authContext = useContext(AuthContext)
  if (authContext.isLoggedIn && authContext.user.is_doctor) {
    return <SideLayout>{children}</SideLayout>
  }
  return <NotFound />
}

export default DoctorRoute
