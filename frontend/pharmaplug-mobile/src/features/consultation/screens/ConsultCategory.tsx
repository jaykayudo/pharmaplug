import { View } from 'react-native'
import {
  Container,
  MainContainer,
  MainContainerScrolless,
} from '../../../components/container'
import { AppText } from '../../../components/text'
import DropDownPicker from 'react-native-dropdown-picker'
import { useState, useEffect } from 'react'
import { useGetAPI } from '../../../services/serviceHooks'
import { endpoints } from '../../../services/constants'
import { ScrollView, Dimensions } from 'react-native'
import { NormalButtton } from '../../../components/button'
import { useNavigation } from '@react-navigation/native'

const { width } = Dimensions.get('window')

const ConsultCategory = () => {
  const navigation = useNavigation()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [items, setItems] = useState<object[]>([])
  const fetchCategory = (data: object[]) => {
    setItems(data.map((value) => ({ label: value.name, value: value.id })))
  }
  const { sendRequest } = useGetAPI(
    endpoints.doctorCategories,
    null,
    fetchCategory,
  )
  const submitForm = () => {
    if (!value) return
    navigateToDoctorList(value)
  }
  const navigateToDoctorList = (id: string) => {
    navigation.navigate('DoctorList', { id: id })
  }
  useEffect(() => {
    sendRequest()
  }, [])
  return (
    <MainContainerScrolless title="Choose Category" back>
      <Container>
        <View style={{ marginVertical: 10 }}>
          <AppText>Choose a category</AppText>
        </View>
        <View style={{ marginVertical: 10 }}>
          <View>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              placeholder="Select a category"
            />
          </View>
        </View>
        <View>
          <NormalButtton onPress={submitForm}>Filter</NormalButtton>
        </View>
      </Container>
    </MainContainerScrolless>
  )
}

export default ConsultCategory
