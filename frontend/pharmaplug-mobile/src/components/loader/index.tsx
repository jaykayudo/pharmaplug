import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native'

const { width, height } = Dimensions.get('window')

const Loader = () => {
  return (
    <View style={style.loaderCover}>
      <ActivityIndicator size="large" color={'#2DAA5F'} />
    </View>
  )
}

export default Loader

const style = StyleSheet.create({
  loaderCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10000,
    backgroundColor: '#1f1f1fc7',
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
