import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native'
import { Container, MainContainer } from '../../../components/container'
import { AltAppText, AppText } from '../../../components/text'
import { useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { ThemeContext } from '../../../contexts/ThemeContext'
import { ThemeMode, ThemeType } from '../../../../types'
import Ionicons from '@expo/vector-icons/Ionicons'
import { SearchInput } from '../../../components/input'
import { useGetAPI } from '../../../services/serviceHooks'
import { endpoints } from '../../../services/constants'

const Consultation = () => {
  const { theme, currentMode } = useContext(ThemeContext)
  const navigation = useNavigation()
  const [data, setData] = useState<object[]>([])

  const styles = getStyles(theme, currentMode)
  const navigateToDoctorList = (id: string) => {
    navigation.navigate('DoctorList', { id: id })
  }
  const navigateToCategory = () => {
    navigation.navigate('ConsultCategory')
  }
  const fetchDoctors = (data: object[]) => {
    setData(data)
  }
  const doctorCategoriesAPI = useGetAPI(
    endpoints.commonDoctorCategories,
    null,
    fetchDoctors,
  )
  useEffect(() => {
    doctorCategoriesAPI.sendRequest()
  }, [])
  return (
    <MainContainer title="Consultation">
      <View style={styles.filterContainer}>
        <AppText style={{ width: '50%', textAlign: 'left', fontWeight: 700 }}>
          Sort Doctor Category
        </AppText>
        <View style={styles.sortButtonCover}>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={navigateToCategory}
          >
            <Ionicons name="filter" size={24} color="black" />
            <AppText>Select Type</AppText>
          </TouchableOpacity>
        </View>
      </View>
      <Container>
        <View style={{ marginBottom: 10 }}>
          <SearchInput alt placeholder="Search Doctor" />
        </View>
        <AppText style={{ marginBottom: 10 }}>
          Find specialized doctors for all your healthcare needs
        </AppText>
        <View>
          {data.map((value, idx) => (
            <TouchableOpacity
              key={idx}
              style={{ marginBottom: 10 }}
              onPress={() => navigateToDoctorList(value.id)}
            >
              <ImageBackground
                source={{ uri: value.image }}
                style={styles.imageContainer}
              >
                <AltAppText style={{ fontSize: 18 }}>{value.name}</AltAppText>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>
      </Container>
    </MainContainer>
  )
}

export default Consultation

const getStyles = (theme: ThemeType, mode: ThemeMode) =>
  StyleSheet.create({
    filterContainer: {
      padding: theme.size.spacing.md,
      backgroundColor: theme.color[mode].bg.tet,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    },
    sortButton: {
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.color[mode].ui.light,
      padding: 10,
      borderRadius: 10,
    },
    sortButtonCover: {
      width: '40%',
    },
    imageContainer: {
      height: 180,
      width: '100%',
      backgroundBlendMode: 'overlay',
      backgroundColor: '#00000080',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      overflow: 'hidden',
    },
  })
