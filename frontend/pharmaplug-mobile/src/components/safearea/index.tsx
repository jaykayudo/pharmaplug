import React, { ReactNode } from "react";
import { SafeAreaView, StyleSheet, Platform, StatusBar as ReactStatusBar } from "react-native";

const isAndroid = Platform.OS !== 'ios'
interface SafeAreaType{
    children: ReactNode;
}

const SafeArea: React.FC<SafeAreaType> = ({children}) => {
    return ( 
        <SafeAreaView style={styles.safearea}>
            {children}
        </SafeAreaView>
    );
}
 
export default SafeArea;


const styles = StyleSheet.create({
    safearea: {
      marginTop: isAndroid ? ReactStatusBar.currentHeight : 0,
      flex: 1
    }
  })