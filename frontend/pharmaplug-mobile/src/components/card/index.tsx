import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { Image as ExpoImage } from 'expo-image'
import { AltAppText, AppText } from '../text'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { ThemeMode, ThemeType } from '../../../types'
import { useContext } from 'react'
import { ThemeContext } from '../../contexts/ThemeContext'
import Ionicons from '@expo/vector-icons/Ionicons'

type Props = {
  data: {
    image: string
    name: string
    field: string
    date: string
    time: string
  }
}
export const ConsultCard = ({ data }: Props) => {
  const { theme, currentMode } = useContext(ThemeContext)
  const styles = getStyles(theme, currentMode)
  return (
    <View style={styles.consultCardCover}>
      <View
        style={{ marginBottom: 20, flexDirection: 'row', alignItems: 'center' }}
      >
        <Image />
        <View style={{ marginLeft: 10 }}>
          <AltAppText
            style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}
          >
            {data.name}
          </AltAppText>
          <AltAppText>{data.field}</AltAppText>
        </View>
      </View>
      <View style={styles.consultCardDateCover}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcons
            name="calendar-month"
            size={24}
            color={theme.color[currentMode].text.secondary}
          />
          <AppText
            style={{
              color: theme.color[currentMode].text.secondary,
              fontSize: 12,
              marginLeft: 5,
            }}
          >
            {data.date}
          </AppText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcons
            name="access-time"
            size={24}
            color={theme.color[currentMode].text.secondary}
          />
          <AppText
            style={{
              color: theme.color[currentMode].text.secondary,
              fontSize: 12,
              marginLeft: 5,
            }}
          >
            {data.time}
          </AppText>
        </View>
      </View>
    </View>
  )
}

type AdCardProps = {
  data: {
    title: string
    description: string
    image: any
    onViewMore?: () => void
  }
}
export const AdCard = ({ data }: AdCardProps) => {
  const { theme, currentMode } = useContext(ThemeContext)
  const styles = getStyles(theme, currentMode)
  return (
    <View style={styles.adCardCover}>
      <View style={{ justifyContent: 'space-between', width: '50%' }}>
        <View>
          <AppText
            style={{
              fontSize: 20,
              color: theme.color[currentMode].text.secondary,
              fontWeight: 700,
            }}
          >
            {data.title}
          </AppText>
          <AppText>{data.description}</AppText>
        </View>
        <View>
          <TouchableOpacity onPress={data.onViewMore} style={styles.seeMoreBtn}>
            <AppText style={{ color: theme.color[currentMode].text.secondary }}>
              See More
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ width: '50%' }}>
        <Image source={data.image} />
      </View>
    </View>
  )
}

export const AltAdCard = ({ data }: AdCardProps) => {
  const { theme, currentMode } = useContext(ThemeContext)
  const styles = getStyles(theme, currentMode)
  return (
    <View style={[styles.altAdCardCover]}>
      <View
        style={{
          justifyContent: 'space-between',
          paddingVertical: 30,
          width: '50%',
        }}
      >
        <View>
          <AppText
            style={{
              fontSize: 18,
              color: theme.color[currentMode].text.white,
              fontWeight: 700,
              marginBottom: 5,
            }}
          >
            {data.title}
          </AppText>
          <AltAppText style={{ fontSize: 13 }}>{data.description}</AltAppText>
        </View>
        <View>
          <TouchableOpacity
            onPress={data.onViewMore}
            style={[styles.seeMoreBtn, { backgroundColor: '#CCCCCC40' }]}
          >
            <AltAppText>See More</AltAppText>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <Image source={data.image} />
      </View>
    </View>
  )
}

type HealthCardProps = {
  data: {
    title: string
    doctor: {
      name: string
      image: string
    }
    date: string
    image?: any
  }
}

export const HealthCard = ({ data }: HealthCardProps) => {
  const { theme, currentMode } = useContext(ThemeContext)
  const styles = getStyles(theme, currentMode)
  return (
    <ImageBackground
      source={{ uri: data.image }}
      style={styles.healthCardCover}
    >
      <View>
        <AltAppText style={{ marginBottom: 20, fontSize: 18 }}>
          {data.title}
        </AltAppText>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row' }}>
            <AltAppText>{data.doctor.name}</AltAppText>
          </View>
          <AltAppText>{data.date}</AltAppText>
        </View>
      </View>
    </ImageBackground>
  )
}

type DrugCardProps = {
  image: string
  name: string
  price: string
  onCartAdd: () => void,
  onCardPress: () => void
}

export const DrugCard = ({ image, name, price, onCartAdd, onCardPress }: DrugCardProps) => {
  const { theme, currentMode } = useContext(ThemeContext)
  const styles = getStyles(theme, currentMode)
  return (
    <TouchableOpacity style={styles.drugCardCover} onPress={onCardPress}>
      <View style={styles.drugImageContainer}>
        <ExpoImage source={image} style={{height: "auto", width:"100%"}}  contentFit='cover' />
        <TouchableOpacity style={styles.drugCartButton} onPress={onCartAdd}>
          <Ionicons name="cart-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <View>
        <AppText style={{ marginBottom: 5 }}>{name}</AppText>
        <AppText style={{ fontWeight: 700 }}>₦ {price}</AppText>
      </View>
    </TouchableOpacity>
  )
}

type CartCardProps = {
    image: string,
    name: string,
    price: string
}

export const CartCard = ({image, name, price}: CartCardProps) =>{
    return (
        <View>
            
        </View>
    )
}

const getStyles = (theme: ThemeType, mode: ThemeMode = 'light') =>
  StyleSheet.create({
    consultCardCover: {
      backgroundColor: theme.color[mode].bg.blue,
      paddingHorizontal: 30,
      paddingVertical: 20,
      borderRadius: 20,
    },
    consultCardDateCover: {
      backgroundColor: '#D9E7EDE3',
      borderRadius: 16,
      padding: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    adCardCover: {
      backgroundColor: '#F0F2F5',
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderRadius: 20,
      height: 180,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    altAdCardCover: {
      borderRadius: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#2DAA5F',
      height: 180,
      paddingHorizontal: 20,
    },
    seeMoreBtn: {
      backgroundColor: '#0678B438',
      borderRadius: 20,
      padding: 10,
      width: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    healthCardCover: {
      height: 205,
      padding: 10,
      justifyContent: 'flex-end',
      borderRadius: 20,
      overflow: 'hidden',
    },
    dp: {
      width: 30,
      height: 30,
      borderRadius: 15,
    },
    drugCardCover: {
      height: 260,
      padding: theme.size.spacing.sm

    },
    drugImageContainer: {
      height: 180,
      backgroundColor: '#CCCCCC80',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      marginBottom: 10,
    },
    drugCartButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.color[mode].ui.button,
      position: 'absolute',
      right: 2,
      bottom: 2,
      zIndex: 10
    },
  })
