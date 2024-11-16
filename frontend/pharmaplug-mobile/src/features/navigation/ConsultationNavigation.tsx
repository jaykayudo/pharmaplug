import { createStackNavigator } from '@react-navigation/stack'

const ConsultationStack = createStackNavigator()
const ConsultationNavigator = () => {
  return (
    <ConsultationStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <></>
    </ConsultationStack.Navigator>
  )
}
export default ConsultationNavigator
