import SideLayoutAlt from '../../../components/sideLayout/alt.js'
import { AuthContext } from '../../../context/authContext.js'
import { useContext } from 'react'
import NotFound from '../../notFound/index.js'

const UserRoute = ({ children }) => {
  const authContext = useContext(AuthContext)
  if (!authContext.isLoggedIn || authContext.user.is_doctor) {
    return <NotFound />
  }

  return <SideLayoutAlt>{children}</SideLayoutAlt>
}

export default UserRoute
