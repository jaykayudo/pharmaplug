import { useNavigation, useRoute } from '@react-navigation/native'
import { Container, MainContainer } from '../../../components/container'
import { AltAppText, AppText } from '../../../components/text'
import { Alert, View, StyleSheet, Image } from 'react-native'
import { useContext, useEffect, useState } from 'react'
import { useGetAPI, usePostAPI } from '../../../services/serviceHooks'
import { endpoints } from '../../../services/constants'
import { ThemeMode, ThemeType } from '../../../../types'
import { ThemeContext } from '../../../contexts/ThemeContext'
import { NormalButtton } from '../../../components/button'
import { NormalInput } from '../../../components/input'
import {
  DatePicker,
  DurationPicker,
  TimePicker,
} from '../../../components/picker'

const DoctorDetails = () => {
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const styles = getStyles(themeContext.theme, themeContext.currentMode)
  const route = useRoute()
  const id = route.params?.id

  if (!id) {
    return (
      <View>
        <AppText>Improper Configuration</AppText>
      </View>
    )
  }
  const [doctor, setDoctor] = useState({})
  const [isVerified, setIsVerified] = useState(false)
  const [consultFee, setConsultFee] = useState('0.00')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [note, setNote] = useState('')
  const [duration, setDuration] = useState('')
  const fetchDoctor = (data) => {
    setDoctor(data)
  }
  const successCallback = (data) => {
    Alert.alert('Success', 'Consultation Scheduled')
    setDate('')
    setTime('')
    setNote('')
    setDuration('')
  }
  const verifySchedule = (data) => {
    setIsVerified(data)
  }
  const getConsultFee = (data) => {
    setConsultFee(data)
  }
  const onTimeChange = (data: string) => {
    setTime(data)
  }
  const onDateChange = (data: string) => {
    setDate(data)
  }
  const onDurationChange = (data: string) => {
    setDuration(data)
  }
  const modifyDate = (data: string | null) => {
    if (!data) return null
    return data.split('/').reverse().join('-')
  }
  const submitForm = () => {
    if (!note || !date || !time || !duration) {
      Alert.alert(
        'Validation Error',
        'Date, Time, Duration and Note fields are required',
      )
      return
    }
    const data = {
      note: note,
      start_time: time,
      day: modifyDate(date),
      duration: duration,
      doctor: id,
    }
    scheduleConsultationAPI.sendRequest(data)
  }
  const { sendRequest, loading } = useGetAPI(
    endpoints.doctorDetails(id),
    null,
    fetchDoctor,
  )
  const scheduleConsultationAPI = usePostAPI(
    endpoints.scheduleAppointment,
    null,
    successCallback,
  )
  const verifyDoctorAvailabilityAPI = useGetAPI(
    endpoints.doctorAvailabilityVerify(id),
    null,
    verifySchedule,
  )
  const consultFeeAPI = useGetAPI(
    endpoints.doctorConsultFee(id),
    null,
    getConsultFee,
  )

  useEffect(() => {
    if (time && date && duration) {
      verifyDoctorAvailabilityAPI.sendRequest({
        date: modifyDate(date),
        time: time,
        duration: duration,
      })
    } else {
      setIsVerified(false)
      setConsultFee('0.00')
    }
  }, [duration, date, time])
  useEffect(() => {
    if (isVerified) {
      consultFeeAPI.sendRequest({
        date: modifyDate(date),
        time: time ?? null,
        duration: duration,
      })
    } else {
      setConsultFee('0.00')
    }
  }, [isVerified, duration])
  useEffect(() => {
    sendRequest()
  }, [])
  return (
    <MainContainer title="Doctor Details" back>
      {loading ? (
        <View></View>
      ) : (
        <Container>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: doctor.image }}
              style={styles.cardImage}
              resizeMode="cover"
            />
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View>
              <AppText style={{ fontWeight: 700, fontSize: 18 }}>
                Dr. {doctor.user?.first_name} {doctor.user?.last_name}
              </AppText>
              <AppText style={{ fontWeight: 500, fontSize: 14, marginTop: 10 }}>
                {doctor.field?.name}
              </AppText>
            </View>
            <View style={styles.rateButton}>
              <AltAppText style={{ fontSize: 16, fontWeight: 700 }}>
                ₦ {doctor.rate}
              </AltAppText>
              <AltAppText>
                /{doctor.per_rate === 0 && 'hr'}
                {doctor.per_rate === 1 && 'consult'}
              </AltAppText>
            </View>
          </View>
          <View style={{ marginTop: 30 }}>
            <AppText style={{ fontSize: 13 }}>Select Day</AppText>
            <View>
              <DatePicker value={date} onChange={onDateChange} />
            </View>
          </View>
          <View style={{ marginTop: 30 }}>
            <AppText style={{ fontSize: 13 }}>Select Time</AppText>
            <View>
              <TimePicker
                value={time}
                isToday={date === new Date().toLocaleDateString()}
                onChange={onTimeChange}
              />
            </View>
          </View>
          <View style={{ marginTop: 30 }}>
            <AppText style={{ fontSize: 13 }}>Select Duration</AppText>
            <View>
              <DurationPicker value={duration} onChange={onDurationChange} />
            </View>
          </View>
          <View style={{ marginTop: 30 }}>
            <NormalInput
              label="Note"
              placeholder="Note for the doctor"
              value={note}
              onChangeText={setNote}
            />
          </View>
          <View
            style={{
              marginTop: 30,
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <AppText>Consult Fee:</AppText>
            <AppText style={{ fontWeight: 700 }}>₦ {consultFee}</AppText>
          </View>
          <View style={{ marginVertical: 20 }}>
            <NormalButtton
              onPress={submitForm}
              style={
                isVerified
                  ? {}
                  : {
                      backgroundColor:
                        themeContext.theme.color[themeContext.currentMode].text
                          .main,
                    }
              }
              disabled={!isVerified}
            >
              {isVerified ? 'Proceed to book schedule' : 'Not available'}
            </NormalButtton>
          </View>
        </Container>
      )}
    </MainContainer>
  )
}

export default DoctorDetails

const getStyles = (theme: ThemeType, mode: ThemeMode) =>
  StyleSheet.create({
    imageContainer: {
      height: 311,
      width: '100%',
      marginBottom: 10,
      borderRadius: 5,
    },
    cardImage: {
      height: '100%',
      borderRadius: 10,
      overflow: 'hidden',
      width: '100%',
      marginBottom: 10,
      // backgroundColor:"#D9D9D9",
    },
    rateButton: {
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1e1e1e',
      borderRadius: 20,
      flexDirection: 'row',
    },
  })
