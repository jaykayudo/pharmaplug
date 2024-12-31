import { Alert, StyleSheet, View } from 'react-native'
import { MainContainer, Container } from '../../../components/container'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useGetAPI } from '../../../services/serviceHooks'
import { endpoints } from '../../../services/constants'
import { useContext, useDeferredValue, useEffect, useState } from 'react'
import { LoaderContext } from '../../../contexts/LoaderContext'
import { SearchInput } from '../../../components/input'
import { DrugCard } from '../../../components/card'
import { ThemeContext } from '../../../contexts/ThemeContext'
import { CartContext } from '../../../contexts/CartContext'
import { ThemeMode, ThemeType } from '../../../../types'
const DrugSearch = () => {
  const loaderContext = useContext(LoaderContext)
  const navigation = useNavigation()
  const route = useRoute()
  const [searchVal, setSearchVal] = useState(route.params?.q ?? '')
  const mainSearchVal = useDeferredValue(searchVal)
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
  const { sendRequest } = useGetAPI(
    endpoints.drugSearch,
    loaderContext.setLoading,
    fetchData,
  )
  useEffect(() => {
    if (mainSearchVal.length > 2) {
      sendRequest({
        name: mainSearchVal,
      })
    }
  }, [mainSearchVal])
  return (
    <MainContainer title="Drug Search" back>
      <Container>
        <View style={{ marginBottom: 15 }}>
          <SearchInput alt value={searchVal} onChangeText={setSearchVal} />
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
        </View>
      </Container>
    </MainContainer>
  )
}

export default DrugSearch

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
