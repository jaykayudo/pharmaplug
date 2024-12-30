import './style.scss'
import { endpoints } from '../../../../services/constants.js'
import { useGetAPI } from '../../../../services/serviceHooks.js'
import { useEffect, useState } from 'react'
import { Modal } from 'antd'
const Notification = () => {
  const [data, setData] = useState([])
  const [readId, setReadId] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [activeData, setActiveData] = useState({
    id: '',
    title: '',
    content: '',
    read: false,
    created_at: new Date().toISOString(),
  })
  const readNotification = (val) => {
    setReadId(val.id)
    setActiveData(val)
    setShowModal(true)
  }
  const handleClose = () => {
    setShowModal(false)
  }
  const fetchNotifications = (data) => {
    setData(data)
  }
  const onReadSuccess = (data) => {}
  const { sendRequest } = useGetAPI(
    endpoints.notifications,
    null,
    fetchNotifications,
  )
  const readNotificationAPI = useGetAPI(
    endpoints.notificationsRead(readId),
    null,
    onReadSuccess,
  )
  useEffect(() => {
    sendRequest()
  }, [])
  useEffect(() => {
    if (readId) {
      readNotificationAPI.sendRequest()
    }
  }, [readId])
  return (
    <div>
      <h2>Notifications</h2>
      <div style={{ marginTop: 10 }}>
        {data.map((value, idx) => (
          <div
            key={idx}
            className="notification-box"
            onClick={() => readNotification(value)}
          >
            <div className="top-area">
              <h4>{value.title}</h4>
              <span>{new Date(value.created_at).toLocaleString()}</span>
            </div>
            <p className="content-area">{value.content}</p>
          </div>
        ))}
      </div>
      <Modal
        title={activeData.title}
        open={showModal}
        onOk={handleClose}
        onCancel={handleClose}
      >
        <div className="notification-box" style={{ borderBottom: 'none' }}>
          <div className="top-area">
            <span>{new Date(activeData.created_at).toLocaleString()}</span>
          </div>
          <p className="content-area">{activeData.content}</p>
        </div>
      </Modal>
    </div>
  )
}

export default Notification

const tempData = [
  {
    id: '1',
    title: 'Login Notification',
    content: `Thank you for your order! We've received your purchase and are processing it now. 
          You'll receive another email shortly with your order shipping details and tracking information.`,
    read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Login Notification',
    content: `Thank you for your order! We've received your purchase and are processing it now. 
          You'll receive another email shortly with your order shipping details and tracking information.`,
    read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Login Notification',
    content: `Thank you for your order! We've received your purchase and are processing it now. 
          You'll receive another email shortly with your order shipping details and tracking information.`,
    read: false,
    created_at: new Date().toISOString(),
  },
]
