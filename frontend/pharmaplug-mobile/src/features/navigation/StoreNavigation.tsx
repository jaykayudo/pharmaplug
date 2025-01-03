import { createStackNavigator } from '@react-navigation/stack'
import DrugStore from '../drugstore/screens/DrugStore'
import DrugList from '../druglist/screens/DrugList'
import DrugDetails from '../druglist/screens/DrugDetails'
import DrugSearch from '../drugstore/screens/DrugSearch'

const StoreStack = createStackNavigator()
const StoreNavigator = () => {
  return (
    <StoreStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <StoreStack.Screen name="DrugStoreMain" component={DrugStore} />
      <StoreStack.Screen name="DrugList" component={DrugList} />
      <StoreStack.Screen name="DrugSearch" component={DrugSearch} />
      <StoreStack.Screen name="DrugDetails" component={DrugDetails} />
    </StoreStack.Navigator>
  )
}
export default StoreNavigator
