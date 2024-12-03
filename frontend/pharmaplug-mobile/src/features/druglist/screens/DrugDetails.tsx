import { useRoute } from "@react-navigation/native";
import { Container, MainContainer } from "../../../components/container";
import { StyleSheet, View } from "react-native";
import { AppText } from "../../../components/text";
import { useContext, useEffect, useState } from "react";
import { useGetAPI } from "../../../services/serviceHooks";
import { endpoints } from "../../../services/constants";
import { AxiosResponse } from "axios";
import { Image } from "expo-image";
import { DrugCard } from "../../../components/card";
import { CartContext } from "../../../contexts/CartContext";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { ThemeMode, ThemeType } from "../../../../types";
import { NormalButtton } from "../../../components/button";

const DrugDetails = () => {
    const route = useRoute()
    const id = route.params?.id
    if (!id){
        return (<View>
            <AppText>Improper Configuration</AppText>
        </View>)
    }
    const [data, setData] = useState({});
    const [altDrugs, setAltDrugs] = useState<object[]>([]);
    const [notFound, setNotFound] = useState(false)
    const cartContext = useContext(CartContext);
    const {theme, currentMode} = useContext(ThemeContext);
    const styles = getStyles(theme, currentMode);

    const fetchAltData = (data: object[]) =>{
        setAltDrugs(data)
    }
    const fetchData = (data: object) =>{
        setData(data)
    }
    const errorCallback = (err: AxiosResponse) =>{
        if (err.status == 404) {
            setNotFound(true)
        }
    }
    const addToCart = (id: string) =>{
        cartContext.addToCart(id)
    }
    const drugDataAPI = useGetAPI(
        endpoints.drugDetails(id),
        null,
        fetchData,
        errorCallback,
      )
      const altDrugDataAPI = useGetAPI(
        endpoints.drugAlternatives(id),
        null,
        fetchAltData,
      )
    if(notFound){
        return (
            <View>
                <AppText>Not Found</AppText>
            </View>
        )
    }
    useEffect(()=>{
        drugDataAPI.sendRequest()
        altDrugDataAPI.sendRequest()
    },[])
    return ( 
        <MainContainer title="Drug Details" back>
            <Container>
                <View style={styles.imageCover}>
                    <Image source={{uri: data.image}} />
                </View>
                <AppText style={styles.headerText}>
                    {data.name}
                </AppText>
                <AppText style={styles.priceText}>
                    NGN {data.price}
                </AppText>
                <AppText style={{marginBottom: 5}}>
                    Description
                </AppText>
                <AppText style={{lineHeight: 19, fontSize: 14, fontWeight: 400}}>
                    {data.description}
                </AppText>
                {altDrugs.length > 0 && (
                    <>

                    <AppText>
                        Related Drugs
                    </AppText>
    
                    <View style={{flexDirection:"row", flexWrap:"wrap", gap: 10}}>
                        {altDrugs.map((value, idx)=>(
                            <View key={idx} style={{width: "45%"}}>
                                <DrugCard name={value.name} image={value.image} price={value.price} onCartAdd={()=>addToCart(value.id)} />
                            </View>
                        ))}
                    </View>
                    
                    </>
                )}
                <View style={{marginTop: 10}}>
                    <NormalButtton onPress={()=> addToCart(id)}>
                        Add to Cart
                    </NormalButtton>
                </View>
            </Container>
        </MainContainer>
     );
}
 
export default DrugDetails;

const getStyles = (theme: ThemeType, mode: ThemeMode) =>StyleSheet.create({
    imageCover:{
        backgroundColor: "#CCCCCC80",
        height: 350,
        width: "100%",
        borderRadius: 10,
        marginBottom: 10
    },
    headerText:{
        marginBottom: 10,
        fontSize: 18,
        fontWeight: 600,
        lineHeight: 24
    },
    priceText:{
        marginBottom: 10,
        fontSize: 18,
        fontWeight: 700,
        lineHeight: 24
    }   
})