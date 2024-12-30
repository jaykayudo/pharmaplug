import {
  View,
  ImageBackground,
  SafeAreaView,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import SafeArea from '../../../components/safearea'
import assets from '../../../../assets'
import React, { useContext, useState } from 'react'
import { ThemeContext } from '../../../contexts/ThemeContext'
import { AuthStackParamList, ThemeType } from '../../../../types'
import { NormalButtton } from '../../../components/button'
import AntDesign from '@expo/vector-icons/AntDesign'
import { StackNavigationProp } from '@react-navigation/stack'

const { height, width } = Dimensions.get('window')

type LandingScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Landing'
>

interface Props {
  navigation: LandingScreenNavigationProp
}

const Landing: React.FC<Props> = ({ navigation }) => {
  const themeContext = useContext(ThemeContext)
  const styles = getStyles(themeContext.theme)
  const [currentPage, setCurrentPage] = useState(0)
  const moveToNextPage = () => {
    setCurrentPage((prevState) => {
      if (prevState == data.length - 1) {
        return prevState
      }
      return prevState + 1
    })
  }
  const navigateToSignUp = () => {
    navigation.navigate('SignUp')
  }
  const navigateToLogin = () => {
    navigation.navigate('Login')
  }
  return (
    <ImageBackground
      style={styles.imageBackground}
      source={data[currentPage].image}
      blurRadius={1}
    >
      <View style={styles.cover}>
        <SafeArea>
          <StatusBar />

          <View style={styles.container}>
            <View>
              <Text style={styles.titleText}>{data[currentPage].title}</Text>
              <Text style={styles.descriptionText}>
                {data[currentPage].content}
              </Text>
            </View>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 20,
                }}
              >
                <View></View>
                {currentPage !== data.length - 1 && (
                  <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={moveToNextPage}
                  >
                    <AntDesign
                      name="arrowright"
                      size={24}
                      color="white"
                      style={{ textAlign: 'center' }}
                    />
                  </TouchableOpacity>
                )}
              </View>
              {currentPage === data.length - 1 && (
                <View>
                  <NormalButtton onPress={navigateToSignUp}>
                    Get Started
                  </NormalButtton>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      marginTop: 5,
                    }}
                  >
                    <Text style={styles.captionText}>
                      Already have an account?
                    </Text>
                    <TouchableOpacity onPress={navigateToLogin}>
                      <Text style={styles.captionButtonText}>Log In</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        </SafeArea>
      </View>
    </ImageBackground>
  )
}

const data = [
  {
    image: assets.onboardingOne,
    title: 'Order prescription medications easily and safely online',
    content:
      'Browse a wide range of over-the-counter medications. Boost your health with essential vitamins and minerals.',
  },
  {
    image: assets.onboardingTwo,
    title: 'Find specialized doctors for all your healthcare needs',
    content:
      'We offer wide range of doctors for any situation that you might be dealing with',
  },
]

export default Landing

const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    imageBackground: {
      width: width,
      height: height,
      objectFit: 'fill',
    },
    cover: {
      height: height,
      paddingBottom: 20,
      flexDirection: 'row',
      alignItems: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    titleText: {
      fontSize: theme.font.size.xlarge,
      marginBottom: theme.size.spacing.lg,
      fontWeight: 700,
      color: theme.color.light.text.white,
    },
    descriptionText: {
      fontSize: theme.font.size.smallText,
      marginBottom: theme.size.spacing.md,
      fontWeight: 500,
      color: theme.color.light.text.white,
    },
    container: {
      height: '50%',
      paddingHorizontal: theme.size.spacing.md,
      justifyContent: 'space-between',
    },
    captionText: {
      color: theme.color.light.text.white,
      fontSize: theme.font.size.caption,
    },
    captionButtonText: {
      color: theme.color.light.text.white,
      fontSize: theme.font.size.caption,
      textDecorationLine: 'underline',
    },
    arrowButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.color.light.ui.button,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
  })
