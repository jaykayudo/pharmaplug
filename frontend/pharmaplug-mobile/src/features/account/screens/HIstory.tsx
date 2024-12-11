import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Container, MainContainer } from '../../../components/container'
import { ThemeMode, ThemeType } from '../../../../types'
import { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../../../contexts/ThemeContext'
import { AltAppText, AppText } from '../../../components/text'
import { AuthContext } from '../../../contexts/AuthContext'
import { MiniAccordion } from '../../../components/accordion'
import ProductSummaryBox from '../../cart/components/ProductSummaryBox'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useGetAPI } from '../../../services/serviceHooks'
import { endpoints } from '../../../services/constants'
import {
  CONSULTATION_STATUS_ALT,
  ORDER_STATUS,
  ORDER_STATUS_ALT,
} from '../../../services/serviceEnums'

const History = () => {
  const themeContext = useContext(ThemeContext)
  const authContext = useContext(AuthContext)
  const styles = getStyles(themeContext.theme, themeContext.currentMode)
  const [activePage, setActivePage] = useState(1)

  const [orders, setOrders] = useState([])
  const [consults, setConsults] = useState([])

  const fetchOrders = (data) => {
    setOrders(data)
  }
  const fetchConsults = (data) => {
    setConsults(data)
  }
  const orderListAPI = useGetAPI(endpoints.orderHistory, null, fetchOrders)
  const consultsListAPI = useGetAPI(
    endpoints.consultationHistory,
    null,
    fetchConsults,
  )
  const loadData = () => {
    orderListAPI.sendRequest()
    consultsListAPI.sendRequest()
  }
  useEffect(() => {
    loadData()
  }, [])

  return (
    <MainContainer title="History" back onRefresh={loadData}>
      <Container>
        <View>
          <View style={styles.tabButtonCover}>
            <TouchableOpacity
              style={[
                styles.tabButtons,
                activePage === 1 ? styles.activeTabButton : {},
              ]}
              onPress={() => setActivePage(1)}
            >
              <AppText>Orders</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButtons,
                activePage === 2 ? styles.activeTabButton : {},
              ]}
              onPress={() => setActivePage(2)}
            >
              <AppText>Consultation</AppText>
            </TouchableOpacity>
          </View>
          <View>
            {activePage === 1 && (
              <View style={{ marginVertical: 20 }}>
                {orders.map((value, idx) => (
                  <View style={styles.itemCover} key={idx}>
                    <AppText style={styles.itemHeader}>
                      Order #{value.order_id}
                    </AppText>
                    <View style={styles.itemDetailCover}>
                      <AppText>Address:</AppText>
                      <AppText style={{ fontWeight: 600, fontSize: 14 }}>
                        {value.address}
                      </AppText>
                    </View>
                    <View style={styles.itemDetailCover}>
                      <AppText>Email:</AppText>
                      <AppText style={{ fontWeight: 600, fontSize: 14 }}>
                        {value.email}
                      </AppText>
                    </View>
                    <View style={styles.itemDetailCover}>
                      <AppText>Payment Type:</AppText>
                      <AppText style={{ fontWeight: 600, fontSize: 14 }}>
                        {value.payment_method == 1 && 'CARD'}
                        {value.payment_method == 2 && 'DELIVERY'}
                      </AppText>
                    </View>
                    <View style={styles.itemDetailCover}>
                      <AppText>Status:</AppText>
                      <AppText
                        style={{
                          fontWeight: 600,
                          fontSize: 14,
                          textTransform: 'uppercase',
                        }}
                      >
                        {ORDER_STATUS[value.status]}
                      </AppText>
                    </View>
                    {value.status === ORDER_STATUS_ALT.NEW && (
                      <View
                        style={{ marginVertical: 10, flexDirection: 'row' }}
                      >
                        <TouchableOpacity style={[styles.normButton]}>
                          <AltAppText>Pay</AltAppText>
                        </TouchableOpacity>
                      </View>
                    )}
                    <View>
                      <MiniAccordion title="Items">
                        <View>
                          {value.order_items.map((val, id) => (
                            <ProductSummaryBox
                              key={id}
                              image={val.product.image}
                              title={val.product.name}
                              quantity={val.quantity}
                              price={val.total_price}
                            />
                          ))}
                        </View>
                      </MiniAccordion>
                    </View>
                  </View>
                ))}
              </View>
            )}
            {activePage === 2 && (
              <View style={{ marginVertical: 20 }}>
                {consults.map((value, idx) => (
                  <View style={styles.consultCover}>
                    <View style={styles.consultCoverContent}>
                      <View style={{ marginVertical: 10 }}>
                        <AppText
                          style={{
                            marginBottom: 10,
                            fontWeight: 'bold',
                            fontSize: 17,
                          }}
                        >
                          {new Date(value.day).toDateString()}
                        </AppText>
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: 10,
                            alignItems: 'center',
                          }}
                        >
                          <MaterialIcons
                            name="access-time"
                            size={24}
                            color="black"
                          />
                          <AppText style={{ fontSize: 13 }}>
                            {value.start_time} - {value.end_time}
                          </AppText>
                        </View>
                      </View>
                      <View style={{ marginVertical: 10 }}>
                        <AppText style={{ lineHeight: 20 }}>
                          {value.note}
                        </AppText>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 10,
                          marginVertical: 10,
                        }}
                      >
                        <Image
                          source={{ uri: value.doctor.image }}
                          style={styles.consultProfilePicture}
                        />
                        <View>
                          <AppText style={{ fontWeight: 700, marginBottom: 5 }}>
                            {value.doctor.user.first_name}{' '}
                            {value.doctor.user.last_name}
                          </AppText>
                          <AppText style={{ fontSize: 13 }}>
                            {value.doctor.field.name}
                          </AppText>
                        </View>
                      </View>
                    </View>
                    <View style={styles.consultCoverFooter}>
                      <TouchableOpacity
                        style={{ padding: 5, backgroundColor: '#F0F2F5' }}
                        disabled
                      >
                        <AppText style={{ fontSize: 12 }}>
                          # {value.cost}
                        </AppText>
                      </TouchableOpacity>
                      {value.status == CONSULTATION_STATUS_ALT.PENDING && (
                        <TouchableOpacity
                          style={[styles.normButton, styles.disabledButton]}
                          disabled
                        >
                          <AppText style={{ fontSize: 13 }}>
                            Awaiting doctor confirmation
                          </AppText>
                        </TouchableOpacity>
                      )}
                      {value.status == CONSULTATION_STATUS_ALT.REJECTED && (
                        <TouchableOpacity
                          style={[styles.normButton, styles.disabledButton]}
                          disabled
                        >
                          <AppText>Rejected</AppText>
                        </TouchableOpacity>
                      )}
                      {value.status == CONSULTATION_STATUS_ALT.ACCEPTED && (
                        <TouchableOpacity style={[styles.normButton]}>
                          <AltAppText>Pay</AltAppText>
                        </TouchableOpacity>
                      )}
                      {value.status == CONSULTATION_STATUS_ALT.ONGOING && (
                        <TouchableOpacity style={[styles.normButton]} disabled>
                          <AltAppText>Ongoing</AltAppText>
                        </TouchableOpacity>
                      )}
                      {value.status == CONSULTATION_STATUS_ALT.FINISHED && (
                        <TouchableOpacity style={[styles.normButton]} disabled>
                          <AltAppText>Completed</AltAppText>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Container>
    </MainContainer>
  )
}

export default History

const getStyles = (theme: ThemeType, mode: ThemeMode) =>
  StyleSheet.create({
    tabButtonCover: {
      borderRadius: 10,
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: '#E4E7EC',
      overflowX: 'hidden',
    },
    tabButtons: {
      flexGrow: 1,
      padding: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    activeTabButton: {
      backgroundColor: '#F0F2F5',
    },
    headerText: {
      marginBottom: 5,
    },
    smallText: {
      color: '#667185',
    },
    formGroup: {
      marginBottom: 10,
    },
    itemCover: {
      borderWidth: 1,
      borderColor: '#F0F2F5',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    },
    itemHeader: {
      fontWeight: 'bold',
      marginBottom: 15,
      backgroundColor: '#F0F2F5',
      paddingVertical: 5,
      paddingHorizontal: 2,
      borderRadius: 5,
    },
    itemDetailCover: {
      flexDirection: 'row',
      marginVertical: 10,
      gap: 10,
    },
    consultCover: {
      marginBottom: 15,
      borderWidth: 1,
      borderColor: '#E4E7EC',
      borderRadius: 5,
      overflowX: 'hidden',
    },
    consultCoverContent: {
      padding: 10,
    },
    consultCoverFooter: {
      padding: 10,
      borderTopColor: '#E4E7EC',
      borderTopWidth: 1,
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
      justifyContent: 'flex-end',
      overflowX: 'hidden',
    },
    consultProfilePicture: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#F0F2F5',
    },
    normButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      backgroundColor: '#145B7A',
    },
    disabledButton: {
      backgroundColor: '#F0F2F5',
    },
  })
