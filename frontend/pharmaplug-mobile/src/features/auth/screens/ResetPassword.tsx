import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, TouchableOpacity, Platform } from "react-native";
import SafeArea from "../../../components/safearea";
import { ThemeType } from "../../../../types";
import { NormalInput } from "../../../components/input";
import { NormalButtton } from "../../../components/button";
import { useContext } from "react";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { useNavigation } from "@react-navigation/native";


const ResetPassword = () => {
    
    const navigation = useNavigation();
    const themeContext = useContext(ThemeContext);
    const styles = getStyles(themeContext.theme);
    const navigateToLogin = () =>{
        
    }
    const submitForm = () =>{
        navigation.popToTop();
    }
    return (
        <SafeArea>
            <KeyboardAvoidingView 
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>Create Password</Text>
                        <Text style={styles.smallText}>Enter new password</Text>
                    </View>
                    <View>
                        <View style={{marginBottom: 10}}>
                            <NormalInput label="Enter new password" secureTextEntry  placeholder="Enter Password" placeholderTextColor={"#D9DDE7"}/>
                        </View>
                        <View>
                            <Text></Text>
                            <Text></Text>
                            <Text></Text>
                        </View>
                        <View style={{marginBottom: 10}}>
                            <NormalInput label="Confirm password" secureTextEntry  placeholder="Enter Password" placeholderTextColor={"#D9DDE7"}/>
                        </View>
                        <View  style={{marginVertical: 15}}>
                            <NormalButtton onPress={submitForm}>
                                Reset password
                            </NormalButtton>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeArea>
     );
}
 
export default ResetPassword;

const getStyles = (theme: ThemeType, mode: "light" | "dark" = "light") => StyleSheet.create({
    container: {
        paddingHorizontal: theme.size.spacing.xl,
        paddingVertical: theme.size.spacing.md,
        backgroundColor:"#FFFFFF"
    },
    headerContainer: {
        marginBottom: 15
    },
    headerText: {
        color: theme.color[mode].text.main,
        fontWeight: 800,
        fontSize: theme.font.size.header1,
        marginBottom: 5
    },
    normalText: {
        color: theme.color[mode].text.main,
        fontWeight: 400,
        fontSize: theme.font.size.body,
        marginBottom: 5
    },
    altText: {
        color:"#145B7A"
    },
    smallText: {
        color: theme.color[mode].text.main,
        fontWeight: 400,
        fontSize: theme.font.size.small,
        marginBottom: 5
    },
    underLinedText: {
        textDecorationLine: "underline"
    }
})