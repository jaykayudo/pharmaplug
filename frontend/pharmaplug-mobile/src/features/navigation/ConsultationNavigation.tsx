import { createStackNavigator } from '@react-navigation/stack'
import Consultation from '../consultation/screens/Consultation'
import DoctorList from '../consultation/screens/DoctorList'
import DoctorDetails from '../consultation/screens/DoctorDetails'

const ConsultationStack = createStackNavigator()
const ConsultationNavigator = () => {
  return (
    <ConsultationStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ConsultationStack.Screen
        name="ConsultationMain"
        component={Consultation}
      />
      <ConsultationStack.Screen name="DoctorList" component={DoctorList} />
      <ConsultationStack.Screen
        name="DoctorDetails"
        component={DoctorDetails}
      />
    </ConsultationStack.Navigator>
  )
}
export default ConsultationNavigator
