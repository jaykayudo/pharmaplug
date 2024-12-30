import { TouchableOpacity, View, ScrollView } from 'react-native'
import { DashboardContainer } from '../../../components/container'
import { AppText } from '../../../components/text'
import {
  AdCard,
  AltAdCard,
  ConsultCard,
  HealthCard,
} from '../../../components/card'
import { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../../../contexts/ThemeContext'
import { SmallButton } from '../../../components/button'
import assets from '../../../../assets'
import { AuthContext } from '../../../contexts/AuthContext'
import { useGetAPI } from '../../../services/serviceHooks'
import { endpoints } from '../../../services/constants'
import { useNavigation } from '@react-navigation/native'

const Dashboard = () => {
  const authContext = useContext(AuthContext)
  const navigation = useNavigation()
  const [sicknessList, setSicknessList] = useState([])
  const [healthData, setHealthData] = useState([])
  const [doctorCategories, setDoctorCategories] = useState([])
  const [upcomingConsultation, setUpcomingConsultation] = useState<any>(null)
  const [refreshing, setRefreshing] = useState(false)
  const user = {
    name: authContext.user.first_name,
  }
  const navigateToNotifcations = () => {
    navigation.navigate('Notifications')
  }
  const fetchHealthData = (data: any) => {
    setHealthData(
      data.map((value) => ({
        title: value.title,
        image: value.image,
        date: new Date(value.updated_at).toDateString(),
        doctor: {
          name: 'Dr Obi',
          image: 'string',
        },
      })),
    )
  }
  const fetchSicknesses = (data: any) => {
    setSicknessList(data.map((value) => ({ name: value.name, id: value.id })))
  }
  const fetchDoctorCategories = (data: any) => {
    setDoctorCategories(
      data.map((value) => ({ name: value.name, id: value.id })),
    )
  }
  const fetchDashboardData = (data: any) => {
    if (data.upcoming_consultation) {
      const mapped_consult = {
        name: data.upcoming_consultation.doctor.user.first_name,
        field: data.upcoming_consulation.doctor.field.name,
        image: data.upcoming_consulation.doctor.image,
        date: new Date(data.upcoming_consulation.date).toLocaleDateString(),
        time: `${new Date(data.upcoming_consulation.start_time).toLocaleTimeString()} - 
            ${new Date(data.upcoming_consulation.end_time).toLocaleTimeString()}`,
      }
      setUpcomingConsultation(mapped_consult)
    }
  }
  const { theme, currentMode } = useContext(ThemeContext)

  const healthDataAPI = useGetAPI(endpoints.stories, null, fetchHealthData)
  const sicknessesAPI = useGetAPI(
    endpoints.commonSicknesses,
    null,
    fetchSicknesses,
  )
  const doctorCategoriesAPI = useGetAPI(
    endpoints.doctorCategories,
    null,
    fetchDoctorCategories,
  )
  const dashboardAPI = useGetAPI(
    endpoints.userDashboard,
    null,
    fetchDashboardData,
  )
  const loadDashboardData = () => {
    setRefreshing(true)
    dashboardAPI.sendRequest()
    healthDataAPI.sendRequest()
    sicknessesAPI.sendRequest()
    doctorCategoriesAPI.sendRequest()
    setRefreshing(false)
  }
  useEffect(() => {
    loadDashboardData()
  }, [])
  return (
    <DashboardContainer
      user={user}
      onRefresh={loadDashboardData}
      refreshing={refreshing}
      onNotificationPress={navigateToNotifcations}
    >
      {upcomingConsultation && (
        <>
          <AppText
            style={{ fontWeight: 600, textAlign: 'center', marginBottom: 10 }}
          >
            You have an upcoming consultation
          </AppText>
          <View style={{ marginVertical: 15 }}>
            <ConsultCard data={consultData} />
          </View>
        </>
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <AppText style={{ fontSize: 14, fontWeight: 600 }}>
          Medication for common sickness
        </AppText>
        <TouchableOpacity>
          <AppText
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: theme.color[currentMode].text.secondary,
            }}
          >
            See all
          </AppText>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        style={{ marginVertical: 20 }}
        showsHorizontalScrollIndicator={false}
      >
        {sicknessList.map((value, idx) => (
          <SmallButton key={idx} onPress={() => {}} style={{ marginLeft: 10 }}>
            {value.name}
          </SmallButton>
        ))}
      </ScrollView>
      <View>
        <AdCard data={adCard} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 15,
        }}
      >
        <AppText style={{ fontSize: 14, fontWeight: 600 }}>
          Doctor categories
        </AppText>
        <TouchableOpacity>
          <AppText
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: theme.color[currentMode].text.secondary,
            }}
          >
            See all
          </AppText>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        style={{ marginVertical: 20 }}
        showsHorizontalScrollIndicator={false}
      >
        {doctorCategories.map((value, idx) => (
          <SmallButton key={idx} onPress={() => {}} style={{ marginLeft: 10 }}>
            {value.name}
          </SmallButton>
        ))}
      </ScrollView>
      <View>
        <AltAdCard data={altAdCard} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 15,
        }}
      >
        <AppText style={{ fontSize: 14, fontWeight: 600 }}>
          Featured articles
        </AppText>
        <TouchableOpacity>
          <AppText
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: theme.color[currentMode].text.secondary,
            }}
          >
            See all
          </AppText>
        </TouchableOpacity>
      </View>
      <View style={{ marginVertical: 20 }}>
        {healthData.map((value, idx) => (
          <View style={{ marginBottom: 10 }} key={idx}>
            <HealthCard data={value} />
          </View>
        ))}
      </View>
    </DashboardContainer>
  )
}

export default Dashboard

const consultData = {
  image: '',
  name: 'Dr Fred',
  field: 'Oncologist',
  date: 'June 20, 2024',
  time: '11:00 am - 2:00pm',
}

const adCard = {
  title: 'Drug store',
  description: 'view drug store to buy drugs',
  image: assets.drug,
  onViewMore: () => {},
}
const altAdCard = {
  title: 'Consult a doctor',
  description: 'Quick access to a team of highly trained doctors',
  image: assets.doc,
  onViewMore: () => {},
}

const sicknessList = [
  'Headache',
  'Fever',
  'Sleep paralysis',
  'Cough',
  'Air borne',
]

const healthData = [
  {
    title:
      'The Best and Worst States for Women’s Healthcare In Sub-Saharan Africa',
    doctor: {
      name: 'Dr Obi',
      image: 'string',
    },
    date: 'June 20, 2024',
    image: assets.healthImage,
  },
]
