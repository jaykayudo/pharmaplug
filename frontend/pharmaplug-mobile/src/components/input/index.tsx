import { TouchableOpacity, StyleSheet, TextInput, TextInputProps, View, Text } from "react-native";
import { ThemeType } from "../../../types";
import React, { useContext, ReactNode } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";

interface InputProps extends TextInputProps {
    label?: string;
    error?: string
}

export const NormalInput: React.FC<InputProps> = ({label, error, ...props}) => {
    const themeContext = useContext(ThemeContext)
    const theme = themeContext.theme
    const styles = getStyles(theme)
    return (
        <View>
            {label && 
                <Text style={styles.label}>
                    {label}
                </Text>
            }
            <TextInput style={[styles.normalInput]} {...props} />
            {error && 
                <Text>
                    {error}
                </Text>
            }
        </View>
     );
}
 



const getStyles = (theme: ThemeType, mode: "light"|"dark" = "light") => StyleSheet.create(
{
    normalInput: {
        borderRadius: theme.size.radius.large,
        backgroundColor: theme.color[mode].ui.input,
        borderColor: theme.color[mode].ui.border,
        borderWidth: 1,
        borderStyle: "solid"
    },
    label:{
        marginBottom: 10,
        fontWeight: 500,
        color: theme.color[mode].text.black
    }
}
)