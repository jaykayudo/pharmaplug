import { View } from 'react-native'
import { RadioButton } from 'react-native-paper'
import { AppText } from '../../../components/text'

type Props = {
  value: string
  title: string
  description: string
  checked: boolean
  onChecked: () => void
}

const RadioBox = ({ value, title, description, checked, onChecked }: Props) => {
  return (
    <View style={{ flexDirection: 'row', overflow: 'hidden' }}>
      <View style={{ width: '20%' }}>
        <RadioButton
          value={value}
          onPress={onChecked}
          status={checked ? 'checked' : 'unchecked'}
          uncheckedColor="black"
        />
      </View>
      <View style={{ flexGrow: 1 }}>
        <AppText style={{ marginBottom: 10, fontWeight: 700, fontSize: 14 }}>
          {title}
        </AppText>
        <AppText
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: '#676868',
            flexWrap: 'wrap',
            maxWidth: '100%',
          }}
        >
          {description}
        </AppText>
      </View>
    </View>
  )
}

export default RadioBox
