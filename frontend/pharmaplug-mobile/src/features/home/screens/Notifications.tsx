import { useContext, useEffect, useState } from 'react'
import { MainContainer, Container } from '../../../components/container'
import { TouchableOpacity, View } from 'react-native'
import { useGetAPI } from '../../../services/serviceHooks'
import { endpoints } from '../../../services/constants'
import { LoaderContext } from '../../../contexts/LoaderContext'
import { AppText } from '../../../components/text'
import { Modal, Portal, Provider } from 'react-native-paper'

type NotificationProps = {
  id: string
  title: string
  content: string
  read: boolean
  created_at: string
}

const Notifications = () => {
  const [data, setData] = useState<NotificationProps[]>([])
  const loaderContext = useContext(LoaderContext)
  const [readId, setReadId] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [activeData, setActiveData] = useState({
    id: '',
    title: '',
    content: '',
    read: false,
    created_at: new Date().toISOString(),
  })
  const readNotification = (val: NotificationProps) => {
    setReadId(val.id)
    setActiveData(val)
    setShowModal(true)
  }
  const handleClose = () => {
    setShowModal(false)
  }
  const fetchNotifications = (data: NotificationProps[]) => {
    setData(data)
  }
  const onReadSuccess = (data: any) => {}
  const { sendRequest } = useGetAPI(
    endpoints.notifications,
    loaderContext.setLoading,
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
      // readNotificationAPI.sendRequest()
    }
  }, [readId])
  return (
    <Provider>
      <MainContainer title="Notification" back>
        <Container>
          {data.length == 0 && (
            <AppText style={{ textAlign: 'center' }}>No Notifications</AppText>
          )}
          {data.map((value, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => readNotification(value)}
              style={{
                borderBottomColor: '#1E1E1E',
                borderBottomWidth: 0.3,
                padding: 10,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <AppText style={{ fontWeight: 700 }}>{value.title}</AppText>
                <AppText>{new Date(value.created_at).toLocaleString()}</AppText>
              </View>
              <View>
                <AppText numberOfLines={2} ellipsizeMode="tail">
                  {value.content}
                </AppText>
              </View>
            </TouchableOpacity>
          ))}
        </Container>
      </MainContainer>
      <Portal>
        <Modal
          visible={showModal}
          onDismiss={handleClose}
          contentContainerStyle={{
            backgroundColor: 'white',
            padding: 20,
            margin: 20,
            borderRadius: 10,
          }}
        >
          <View style={{ marginBottom: 10 }}>
            <AppText style={{ fontWeight: 700, marginBottom: 5 }}>
              {activeData.title}
            </AppText>
            <AppText>
              {new Date(activeData.created_at).toLocaleString()}
            </AppText>
          </View>
          <View>
            <AppText>{activeData.content}</AppText>
          </View>
        </Modal>
      </Portal>
    </Provider>
  )
}

export default Notifications

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
