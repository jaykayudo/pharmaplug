import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Container, MainContainer } from '../../../components/container'
import { AppText } from '../../../components/text'
import RNPickerSelect from 'react-native-picker-select'
import { useContext, useState, useEffect } from 'react'
import { ThemeContext } from '../../../contexts/ThemeContext'
import { ThemeMode, ThemeType } from '../../../../types'
import { SearchInput } from '../../../components/input'
import { useGetAPI } from '../../../services/serviceHooks'
import { endpoints } from '../../../services/constants'
import { useNavigation } from '@react-navigation/native'

const DrugStore = () => {
  const { theme, currentMode } = useContext(ThemeContext)
  const navigation = useNavigation()
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState(data)

  const styles = getStyles(theme, currentMode)
  const selectChoices =
    'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z'.split(',')
  const [currentSelection, setCurrentSelection] = useState(selectChoices[0])
  const choicesItems = selectChoices.map((value) => ({
    label: value,
    value: value,
  }))
  const onPick = (value: string) => {
    if (selectChoices.includes(value)) setCurrentSelection(value)
  }
  const headerChecker = (idx: number, value) => {
    if (idx == 0) {
      return true
    } else if (filteredData.length === 0) {
      return false
    } else if (
      filteredData[idx - 1].name.toLowerCase().slice(0, 2) !=
      value.name.toLowerCase().slice(0, 2)
    ) {
      return true
    }
    return false
  }
  const filterData = (text: string) => {
    setFilteredData(
      data.filter((value) =>
        value.name.toLowerCase().startsWith(text.toLowerCase()),
      ),
    )
  }
  const fetchData = (data: any) => {
    setData(data)
  }
  const navigateToDrugList = (id: string, name: string) => {
    navigation.navigate('DrugList', { id: id, name: name })
  }
  const { sendRequest, loading } = useGetAPI(
    endpoints.sicknesses,
    null,
    fetchData,
  )
  useEffect(() => {
    sendRequest()
  }, [])
  useEffect(() => {
    filterData(currentSelection)
  }, [data, currentSelection])

  return (
    <MainContainer title="Drug Store">
      <View style={styles.filterContainer}>
        <AppText style={{ width: '45%', textAlign: 'left', fontWeight: 700 }}>
          Sort sickness name
        </AppText>
        <View style={styles.sortButton}>
          <AppText style={{ fontWeight: 700 }}>
            Begins with {currentSelection}
          </AppText>
          <RNPickerSelect
            items={choicesItems}
            onValueChange={onPick}
            // useNativeAndroidPickerStyle={false}
            style={{
              inputAndroid: styles.selectAndroid,
              inputIOS: styles.selectIOS
            }}
            placeholder={choicesItems[0]}
          />
        </View>
      </View>
      <Container>
        <View style={{ marginBottom: 15 }}>
          <SearchInput alt />
        </View>
        <View>
          {filteredData.map((value, idx) => (
            <View key={idx}>
              {headerChecker(idx, value) && (
                <View style={styles.listCover}>
                  <AppText style={styles.listHeader}>
                    {value.name.slice(0, 2)}
                  </AppText>
                </View>
              )}
              <View style={styles.listCover}>
                <TouchableOpacity
                  onPress={() => navigateToDrugList(value.id, value.name)}
                >
                  <AppText>{value.name}</AppText>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </Container>
    </MainContainer>
  )
}

export default DrugStore

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
    selectAndroid: {
      width: 30,
      height: 20,
      color: 'black',
    },
    selectIOS:{
        backgroundColor:"black"
    },
    sortButton: {
      flexDirection: 'row',
      width: '45%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.color[mode].ui.light,
      padding: 10,
      borderRadius: 10,
    },
    listHeader: {
      fontSize: 25,
      fontWeight: 700,
    },
    listCover: {
      paddingVertical: 15,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.color[mode].text.main,
    },
  })
