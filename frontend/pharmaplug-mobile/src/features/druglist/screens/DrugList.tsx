import { Alert, StyleSheet, View } from 'react-native'
import { Container, MainContainer } from '../../../components/container'
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import { AppText } from '../../../components/text'
import { useContext, useEffect, useState } from 'react'
import { useGetAPI } from '../../../services/serviceHooks'
import { endpoints } from '../../../services/constants'
import { ThemeMode, ThemeType } from '../../../../types'
import { ThemeContext } from '../../../contexts/ThemeContext'
import { DrugCard } from '../../../components/card'
import { CartContext } from '../../../contexts/CartContext'

const DrugList = () => {
  const navigation = useNavigation()
  const route = useRoute()

  const id = route.params?.id
  if (!id) {
    return (
      <View>
        <AppText>Improper Configuration</AppText>
      </View>
    )
  }
  const [data, setData] = useState<object[]>([])
  const { theme, currentMode } = useContext(ThemeContext)
  const cartContext = useContext(CartContext)
  const styles = getStyles(theme, currentMode)

  const onCartAdd = (id: string) => {
    cartContext.addToCart(id)
    Alert.alert('Cart Add', 'Added to cart')
  }
  const navigateToDetails = (id: string) => {
    navigation.navigate('DrugDetails', { id: id })
  }
  const fetchData = (data: object[]) => {
    setData(data)
  }

  const drugsAPI = useGetAPI(endpoints.drugs(id), null, fetchData)
  const loadData = () => {
    drugsAPI.sendRequest()
  }
  useEffect(() => {
    loadData()
  }, [])
  return (
    <MainContainer title="Drug List" back refreshing={drugsAPI.loading}>
      <Container>
        <View style={styles.drugsCover}>
          {data.map((value, idx) => (
            <View style={styles.unitDrug} key={idx}>
              <DrugCard
                name={value.name}
                price={value.price}
                image={value.image}
                onCartAdd={() => onCartAdd(value.id)}
                onCardPress={() => navigateToDetails(value.id)}
              />
            </View>
          ))}
        </View>
      </Container>
    </MainContainer>
  )
}

export default DrugList

const getStyles = (theme: ThemeType, mode: ThemeMode) =>
  StyleSheet.create({
    drugsCover: {
      flexWrap: 'wrap',
      flexDirection: 'row',
      gap: 10,
    },
    unitDrug: {
      width: '45%',
    },
  })
