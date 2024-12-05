import { StyleSheet, TouchableOpacity, View, Modal, Dimensions } from "react-native";
import { Container, MainContainer } from "../../../components/container";
import { AppText } from "../../../components/text";
import { AntDesign } from "@expo/vector-icons";
import { ThemeMode, ThemeType } from "../../../../types";
import { useContext, useState } from "react";
import { ThemeContext } from "../../../contexts/ThemeContext";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../../contexts/AuthContext";

const {height, width} = Dimensions.get("window")

const Account = () => {
    const themeContext = useContext(ThemeContext)
    const authContext = useContext(AuthContext);
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation()
    const styles = getStyles(themeContext.theme, themeContext.currentMode)
    const initiateLogout = ()=>{
        setModalVisible(true)
    }
    const LogUserOut = () =>{
        authContext.logUserOut()
    }
    return (
        <MainContainer title="Account">
            <Container>
                <View style={styles.navsContainer}>
                    <TouchableOpacity style={styles.navButton} onPress={()=> navigation.navigate("Profile")}>
                        <View style={{flexDirection:"row", alignItems:"center"}}>
                            <FontAwesome name="user-o" size={24} color="black" />
                        <AppText style={{marginLeft: 20, fontWeight: 600}}>
                            Profile
                        </AppText>
                        </View>
                        
                        <AntDesign size={20} name="right" color={"1E1E1E"} />
                    </TouchableOpacity>
                </View>
                <View style={styles.navsContainer}>
                    <TouchableOpacity style={styles.navButton} onPress={()=> navigation.navigate("History")}>
                        <View style={{flexDirection:"row", alignItems:"center"}}>
                            <Entypo name="back-in-time" size={24} color="black" />
                        <AppText style={{marginLeft: 20, fontWeight: 600}}>
                            History
                        </AppText>
                        </View>
                        
                        <AntDesign size={20} name="right" color={"1E1E1E"} />
                    </TouchableOpacity>
                </View>
                <View style={styles.navsContainer}>
                    <TouchableOpacity style={styles.navButton} onPress={initiateLogout}>
                        <View style={{flexDirection:"row", alignItems:"center"}}>
                            <Feather name="log-out" size={24} color="#FF0000" />
                        <AppText style={{marginLeft: 20, fontWeight: 600, color:"#FF0000"}}>
                            Logout
                        </AppText>
                        </View>
                    </TouchableOpacity>
                </View>
            </Container>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                    
                >
                    <View style={{height: height,justifyContent:"center",alignItems:"center"}}>
                    <View
                        style={{
                            backgroundColor:themeContext.theme.color[themeContext.currentMode].bg.tet,
                            width:"80%",
                            height:"30%",
                            padding: 10,

                            justifyContent:"space-around",
                            alignItems:"center",
                            borderRadius: 20,

                        }}
                    >
                        <AppText>
                            Are you sure you want to logout?
                        </AppText>
                        <View style={{justifyContent:"space-between", flexDirection:"row", marginTop: 10,width:"100%"}}>
                            <TouchableOpacity onPress={LogUserOut} style={styles.modalButton}>
                                <AppText>
                                    Yes
                                </AppText>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=> setModalVisible(false)} style={[styles.modalButton, {backgroundColor:"#FF0000"}]}>
                                <AppText>No</AppText>
                            </TouchableOpacity>
                        </View>
                    </View>
                    </View>
                </Modal>
        </MainContainer>
      );
}
 
export default Account;

const getStyles = (theme: ThemeType, mode: ThemeMode) => StyleSheet.create({
    navsContainer:{
        paddingHorizontal: theme.size.spacing.lg,
        paddingVertical: theme.size.spacing.sm
    },
    navButton:{
        flexDirection: "row",
        justifyContent:"space-between",
        paddingVertical: 10
    },
    modalButton:{
        backgroundColor: theme.color[mode].ui.button,
        width: 50,
        padding: 10,
        alignItems:"center",
        justifyContent:"center",
        borderRadius: 10
    }
})