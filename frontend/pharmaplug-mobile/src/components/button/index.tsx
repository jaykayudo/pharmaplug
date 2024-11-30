import { TouchableOpacity, StyleSheet, TextInput, TextInputProps, View, Text, TouchableOpacityProps } from "react-native";
import { GetStylesType, ThemeType } from "../../../types";
import React, { useContext, ReactNode } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";

interface ButtonProps extends TouchableOpacityProps {
    children: ReactNode,
    onPress: () => void;
}

export const NormalButtton: React.FC<ButtonProps> = ({children, ...props}) => {
    const themeContext = useContext(ThemeContext)
    const styles = getStyles(themeContext.theme)
    return (  
        <TouchableOpacity style={styles.button} {...props}>
            <Text style={styles.buttonText}>
              {children}  
            </Text>
        </TouchableOpacity>
    );
}


const getStyles = (theme: ThemeType, mode: "light" | "dark" = "light") => StyleSheet.create({
    button:{
        backgroundColor: theme.color[mode].ui.button,
        padding: theme.size.spacing.sm,
        borderRadius: theme.size.radius.xxlarge
    },
    buttonText:{
        color: theme.color[mode].text.button,
        fontSize: theme.font.size.body,
        textAlign:"center",
    }
})
 
