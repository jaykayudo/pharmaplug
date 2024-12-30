import { Link, NavLink, useNavigate } from 'react-router-dom'
import './style.scss'
import { FaCog, FaHome, FaSignOutAlt, FaRegFileAlt } from 'react-icons/fa'
import { GrHomeRounded } from 'react-icons/gr'
import { IoGiftOutline, IoWalletOutline } from 'react-icons/io5'
import { TbSettings2 } from 'react-icons/tb'
import { WhiteButton } from '../button/index.js'
import Logo from '../logo/index.js'
import { PiHeadset } from 'react-icons/pi'
import Path from '../../navigations/constants.js'
import { SearchInput } from '../input/index.js'
import { FaBell, FaBars } from 'react-icons/fa6'
import { FaTimes } from 'react-icons/fa'
import assets from '../../assets/index.js'
import { useContext, useState } from 'react'
import { AuthContext } from '../../context/authContext.js'
import { message, Modal } from 'antd'
import { googleLogout } from '@react-oauth/google'
const SideLayoutAlt = ({ children }) => {
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()
  const authContext = useContext(AuthContext)
  const logout = () => {
    authContext.logUserOut(() => {
      googleLogout()
      navigate(Path.home)
    })
  }
  const [sideShow, setSideShow] = useState(false)
  const closeSideBar = () => {
    setSideShow(false)
  }
  return (
    <div className="side-layout-cover">
      <div
        className={`side-bar alt${sideShow ? ' show' : ''}`}
        onBlur={closeSideBar}
      >
        <div className="top-nav">
          <div className="mb-2em side-bar-brand">
            <NavLink
              style={{
                display: 'block',
                textDecoration: 'none',
              }}
              to={Path.home}
            >
              <Logo
                coverStyle={{ backgroundColor: 'transparent', color: 'white' }}
                altLogo
              />
            </NavLink>
            <button onClick={() => setSideShow(false)}>
              <FaTimes />
            </button>
          </div>
          <NavLink className="side-nav-link" to={Path.userDashboard}>
            <span>
              <GrHomeRounded />
            </span>
            <p>Dashboard</p>
          </NavLink>
          <NavLink className="side-nav-link" to={Path.userHistory}>
            <span>
              <FaRegFileAlt />
            </span>
            <p>History</p>
          </NavLink>
        </div>
        <div className="bottom-nav">
          <NavLink className="side-nav-link" to={Path.userSettings}>
            <span>
              <TbSettings2 />
            </span>
            <p>Settings</p>
          </NavLink>
          <NavLink className="side-nav-link" to={Path.userSupport}>
            <span>
              <PiHeadset />
            </span>
            <p>Help Center</p>
          </NavLink>
          <NavLink className="side-nav-link" to={Path.userReferral}>
            <span>
              <IoGiftOutline />
            </span>
            <p>Refer Family and Friends</p>
          </NavLink>
          <WhiteButton
            full
            style={{
              border: '1px solid white',
              background: 'transparent',
              color: 'white',
            }}
            onClick={() => setShowModal(true)}
          >
            <FaSignOutAlt />
            <p>Logout</p>
          </WhiteButton>
        </div>
      </div>
      <div className="side-layout-content">
        <div className="flex-between mb-2em">
          <div className="w-50 flex align-center">
            <button
              className="side-nav-toggle"
              style={{ marginRight: 10 }}
              onClick={() => setSideShow((prevState) => !prevState)}
            >
              <FaBars size={16} color="#1E1E1E" />
            </button>
          </div>
          <div className="w-50 flex-end gap-20">
            <Link className="rounded-icon" to={Path.userNotification}>
              <FaBell size={20} color="#1E1E1E" />
            </Link>
            <img src={assets.profile} className="little-rounded-image" />
          </div>
        </div>
        <Modal
          title="Logout"
          open={showModal}
          onOk={logout}
          okText="Yes"
          onCancel={() => setShowModal(false)}
        >
          Are you sure you want to Logout?
        </Modal>
        {children}
      </div>
    </div>
  )
}

export default SideLayoutAlt
