import { Image, View, StyleSheet } from 'react-native'
import { Container, MainContainer } from '../../../components/container'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useGetAPI } from '../../../services/serviceHooks'
import { endpoints } from '../../../services/constants'
import { useContext, useDeferredValue, useEffect, useState } from 'react'
import { SearchInput } from '../../../components/input'
import { AppText } from '../../../components/text'
import { NormalButtton } from '../../../components/button'
import { ThemeContext } from '../../../contexts/ThemeContext'
import { ThemeType, ThemeMode } from '../../../../types'

const DoctorList = () => {
  const navigation = useNavigation()
  const { theme, currentMode } = useContext(ThemeContext)
  const styles = getStyles(theme, currentMode)
  const route = useRoute()
  const [data, setData] = useState<object[]>([])
  const [categoryList, setCategoryList] = useState([])
  const category_id: string = route.params?.id
  const doctor_name: string = route.params?.name
  const [doctorNameSearch, setDoctorNameSearch] = useState(doctor_name ?? "")
  const mainSearchVal = useDeferredValue(doctorNameSearch)
  const fetchDoctors = (data: object[]) => {
    setData(data)
  }

  const loadData = () => {
    let data = {}
    if (category_id) {
      data.category = category_id
    }
    if(doctorNameSearch){
      data.name = doctorNameSearch
    }
    
    sendRequest(data)
  }
  const navigateToDoctorDetails = (id: string) => {
    navigation.navigate('DoctorDetails', { id: id })
  }
  const fetchCategories = (data) => {
    setCategoryList(data)
  }
  const { sendRequest, loading } = useGetAPI(
    endpoints.doctorList,
    null,
    fetchDoctors,
  )
  const categoryListAPI = useGetAPI(
    endpoints.doctorCategories,
    null,
    fetchCategories,
  )
  useEffect(() => {
    loadData()
    categoryListAPI.sendRequest()
  }, [])
  useEffect(()=>{
    if(mainSearchVal.length > 3){
      loadData()
    } 
  },[mainSearchVal])
  return (
    <MainContainer title="Doctor List" back>
      <Container>
        <View>
          <SearchInput alt placeholder="Search Doctors" value={doctorNameSearch} onChangeText={setDoctorNameSearch} />
        </View>
        <View style={{ paddingVertical: 20 }}>
          <AppText style={{ marginBottom: 5, fontSize: 17 }}>
            Search related to{' '}
            {categoryList.find((value) => value.id == category_id)?.name ??
              'doctors'}
          </AppText>
          <AppText style={{ fontSize: 14, color: '#1E1E1E80' }}>
            {data.length}{' '}
            {categoryList.find((value) => value.id == category_id)?.name ??
              'doctors'}{' '}
            available.
          </AppText>
        </View>
        <View style={styles.listCover}>
          {data.map((value, idx) => (
            <View style={styles.card} key={idx}>
              <Image
                source={{ uri: value.image }}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.cardContent}>
                <AppText
                  style={{ marginBottom: 5 }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Dr. {value.user.first_name} {value.user.last_name}
                </AppText>
                <AppText>
                  ₦ {value.rate}/{value.per_rate === 0 && 'hr'}
                  {value.per_rate === 1 && 'consult'}
                </AppText>
              </View>
              <NormalButtton
                onPress={() => {
                  navigateToDoctorDetails(value.id)
                }}
              >
                View Details
              </NormalButtton>
            </View>
          ))}
        </View>
      </Container>
    </MainContainer>
  )
}

export default DoctorList

const getStyles = (theme: ThemeType, mode: ThemeMode) =>
  StyleSheet.create({
    listCover: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    card: {
      width: '50%',
      padding: 15,
      marginBottom: 10,
    },
    cardImage: {
      height: 130,
      borderRadius: 10,
      overflow: 'hidden',
      width: '100%',
      marginBottom: 10,
      // backgroundColor:"#D9D9D9",
    },
    cardContent: {
      justifyContent: 'space-between',
      marginBottom: 10,
    },
  })
