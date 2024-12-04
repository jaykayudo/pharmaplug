import { View } from 'react-native'
import { RadioButton } from 'react-native-paper'
import { AppText } from '../../../components/text'
import { Image } from 'expo-image'

type Props = {
  image: string
  title: string
  quantity: number
  price: number
}

const ProductSummaryBox = ({ image, title, quantity, price }: Props) => {
  return (
    <View style={{ flexDirection: 'row', padding: 10, gap: 10 }}>
      <View style={{ width: 50, height: 'auto', backgroundColor: '#F5F7F8' }}>
        <Image source={image} contentFit="contain" />
      </View>
      <View style={{ flexGrow: 1 }}>
        <AppText style={{ marginBottom: 10 }}>{title}</AppText>
        <AppText style={{ color: '#1E1E1E80', fontSize: 12 }}>
          QTY: {quantity}
        </AppText>
      </View>
      <View>
        <AppText>₦ {quantity * price}</AppText>
      </View>
    </View>
  )
}

export default ProductSummaryBox
