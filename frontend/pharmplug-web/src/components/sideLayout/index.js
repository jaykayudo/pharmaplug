import { Link, NavLink, useNavigate } from 'react-router-dom'
import './style.scss'
import {
  FaCog,
  FaHome,
  FaSignOutAlt,
  FaRegFileAlt,
  FaRegTimesCircle,
  FaTimes,
} from 'react-icons/fa'
import { GrHomeRounded } from 'react-icons/gr'
import { IoGiftOutline, IoWalletOutline } from 'react-icons/io5'
import { TbSettings2 } from 'react-icons/tb'
import { WhiteButton } from '../button/index.js'
import Logo from '../logo/index.js'
import { PiHeadset } from 'react-icons/pi'
import Path from '../../navigations/constants.js'
import { SearchInput } from '../input/index.js'
import { FaBars, FaBell } from 'react-icons/fa6'
import assets from '../../assets/index.js'
import { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../../context/authContext.js'
import Modal from 'antd/es/modal/Modal.js'
const SideLayout = ({ children }) => {
  const [showModal, setShowModal] = useState(false)
  const authContext = useContext(AuthContext)
  const navigate = useNavigate()
  const sideBarRef = useRef(null)
  const [sideShow, setSideShow] = useState(false)
  const closeSideBar = () => {
    setSideShow(false)
  }
  const logout = () => {
    authContext.logUserOut(() => {
      navigate(Path.home)
    })
  }
  // useEffect(()=>{

  // },[])
  return (
    <div className="side-layout-cover">
      <div
        className={`side-bar${sideShow ? ' show' : ''}`}
        onBlur={closeSideBar}
      >
        <div className="top-nav">
          <div className="mb-2em side-bar-brand">
            <Logo />
            <button onClick={() => setSideShow(false)}>
              <FaTimes />
            </button>
          </div>
          <NavLink className="side-nav-link" to={Path.doctorDashboard}>
            <span>
              <GrHomeRounded />
            </span>
            <p>Dashboard</p>
          </NavLink>
          <NavLink className="side-nav-link" to={Path.doctorWallet}>
            <span>
              <IoWalletOutline />
            </span>
            <p>Wallet</p>
          </NavLink>
          <NavLink className="side-nav-link" to={Path.doctorConsultations}>
            <span>
              <FaRegFileAlt />
            </span>
            <p>Consultation</p>
          </NavLink>
        </div>
        <div className="bottom-nav">
          <NavLink className="side-nav-link" to={Path.doctorSettings}>
            <span>
              <TbSettings2 />
            </span>
            <p>Settings</p>
          </NavLink>
          <NavLink className="side-nav-link" to={Path.doctorSupport}>
            <span>
              <PiHeadset />
            </span>
            <p>Help Center</p>
          </NavLink>
          <NavLink className="side-nav-link" to={Path.doctorReferral}>
            <span>
              <IoGiftOutline />
            </span>
            <p>Refer Family and Friends</p>
          </NavLink>
          <NavLink className="side-profile-nav-link">
            <img className="little-rounded-image" src={assets.profile} />
            <div>
              <h3 style={{ textTransform: 'capitalize' }}>
                {authContext.user.first_name} {authContext.user.last_name}
              </h3>
              <p>Certified</p>
            </div>
          </NavLink>
          <WhiteButton full onClick={() => setShowModal(true)}>
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
            <Link className="rounded-icon">
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

export default SideLayout
