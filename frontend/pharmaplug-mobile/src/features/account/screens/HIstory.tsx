import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Container, MainContainer } from '../../../components/container'
import { ThemeMode, ThemeType } from '../../../../types'
import { useContext, useState } from 'react'
import { ThemeContext } from '../../../contexts/ThemeContext'
import { AppText } from '../../../components/text'
import { NormalInput } from '../../../components/input'
import { NormalButtton } from '../../../components/button'
import { AuthContext } from '../../../contexts/AuthContext'

const History = () => {
  const themeContext = useContext(ThemeContext)
  const authContext = useContext(AuthContext)
  const styles = getStyles(themeContext.theme, themeContext.currentMode)
  const [activePage, setActivePage] = useState(1)

  return (
    <MainContainer title="History" back>
      <Container>
        <View>
          <View style={styles.tabButtonCover}>
            <TouchableOpacity
              style={[
                styles.tabButtons,
                activePage === 1 ? styles.activeTabButton : {},
              ]}
              onPress={() => setActivePage(1)}
            >
              <AppText>Orders</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButtons,
                activePage === 2 ? styles.activeTabButton : {},
              ]}
              onPress={() => setActivePage(2)}
            >
              <AppText>Consultation</AppText>
            </TouchableOpacity>
          </View>
          <View>
            {activePage === 1 && <View style={{ marginVertical: 20 }}></View>}
            {activePage === 2 && <View style={{ marginVertical: 20 }}></View>}
          </View>
        </View>
      </Container>
    </MainContainer>
  )
}

export default History

const getStyles = (theme: ThemeType, mode: ThemeMode) =>
  StyleSheet.create({
    tabButtonCover: {
      borderRadius: 10,
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: '#E4E7EC',
      overflow: 'hidden',
    },
    tabButtons: {
      flexGrow: 1,
      padding: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    activeTabButton: {
      backgroundColor: '#F0F2F5',
    },
    headerText: {
      marginBottom: 5,
    },
    smallText: {
      color: '#667185',
    },
    formGroup: {
      marginBottom: 10,
    },
  })
