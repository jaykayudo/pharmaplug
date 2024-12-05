import { useNavigation, useRoute } from "@react-navigation/native";
import { Container, MainContainer } from "../../../components/container";
import { AltAppText, AppText } from "../../../components/text";
import { Alert, View, StyleSheet, Image } from "react-native";
import { useContext, useEffect, useState } from "react";
import { useGetAPI, usePostAPI } from "../../../services/serviceHooks";
import { endpoints } from "../../../services/constants";
import { ThemeMode, ThemeType } from "../../../../types";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { NormalButtton } from "../../../components/button";
import { NormalInput } from "../../../components/input";

const DoctorDetails = () => {
    const navigation = useNavigation()
    const themeContext = useContext(ThemeContext);
    const styles = getStyles(themeContext.theme, themeContext.currentMode)
    const route = useRoute()
    const id = route.params?.id;

    if (!id){
        return(
            <View>
                <AppText>
                    Improper Configuration
                </AppText>
            </View>
        )
    }
    const [doctor, setDoctor] = useState({})
    const [isVerified, setIsVerified] = useState(false)
    const [consultFee, setConsultFee] = useState("0.00")
    const [date, setDate] = useState(null)
    const [time, setTime] = useState(null)
    const [note, setNote] = useState("")
    const [duration, setDuration] = useState("")
    const fetchDoctor = (data) =>{
        console.log(data)
        setDoctor(data)
    }
    const successCallback = (data)  =>{
        Alert.alert(
            "Success",
            "Consultation Scheduled"
        )
    }
    const verifySchedule = (data) => {
        setIsVerified(data)
      }
      const getConsultFee = (data) =>{
        setConsultFee(data)
      }
      const validateTime = () =>{
        const today = new Date()
        const formattedDateTime = today.toISOString().split("T")
        const formattedTime = formattedDateTime[1].split(":", 2).join(":")
        if(formattedDateTime[0] == date){
          if(time.current.value <= formattedTime){
            return false
          }
        }
        return true
        
      }
      const submitForm = () => {
    
        if (!note || !date || !time  || !duration) {
          Alert.alert( "Validation Error",'Date, Time, Duration and Note fields are required')
          return
        }
        if(!validateTime()){
            Alert.alert( "Validation Error",'Time Value is invalid')
          return
        }
        const data = {
          note: note,
          start_time: time,
          day: date,
          duration: duration,
          doctor: id,
        }
        scheduleConsultationAPI.sendRequest(data)
      }
    const { sendRequest, loading } = useGetAPI(
        endpoints.doctorDetails(id),
        null,
        fetchDoctor,
      )
      const scheduleConsultationAPI = usePostAPI(
        endpoints.scheduleAppointment,
        null,
        successCallback,
      )
      const verifyDoctorAvailabilityAPI = useGetAPI(
        endpoints.doctorAvailabilityVerify(id),
        null,
        verifySchedule
      )
      const consultFeeAPI = useGetAPI(
        endpoints.doctorConsultFee(id),
        null,
        getConsultFee
    )
    useEffect(()=>{
        if(time && date && duration){
          verifyDoctorAvailabilityAPI.sendRequest({
            "date": date,
            "time": time,
            "duration": duration
          })
        }else{
          setIsVerified(false)
          setConsultFee("0.00")
        }
      },[duration])
      useEffect(()=>{
        if(isVerified){
          consultFeeAPI.sendRequest({
            date: date ?? null,
            time: time ?? null,
            duration: duration
          })
        }else{
          setConsultFee("0.00")
        }
      },[isVerified, duration])
    useEffect(()=>{
        sendRequest()
    },[])
    return ( 
        <MainContainer title="Doctor Details" back>
            {loading ? (
                <View>

                </View>
            ):(
                <Container>

                <View style={styles.imageContainer}>
                    <Image source={{uri: doctor.image}} style={styles.cardImage} resizeMode="cover" />
                </View>
                <View style={{justifyContent:"space-between", flexDirection:"row", alignItems:"center"}}>
                    <View>
                        <AppText style={{fontWeight: 700, fontSize: 18}}>
                            Dr. {doctor.user?.first_name} {doctor.user?.last_name}
                        </AppText>
                        <AppText style={{fontWeight: 500, fontSize: 14, marginTop: 10}}>
                            {doctor.field?.name}
                        </AppText>
                    </View>
                    <View style={styles.rateButton}>
                        <AltAppText style={{fontSize: 16, fontWeight: 700}}>
                            ₦ {doctor.rate}
                        </AltAppText>
                        <AltAppText>
                            /{doctor.per_rate === 0 && "hr"}{doctor.per_rate === 1 && "consult"}
                        </AltAppText>
                    </View>
                </View>
                <View style={{marginTop: 30}}>
                    <AppText style={{fontSize: 13}}>
                        Select Schedule
                    </AppText>
                </View>
                <View style={{marginTop: 30}}>
                    <AppText style={{fontSize: 13}}>
                        Select Time
                    </AppText>
                </View>
                <View style={{marginTop: 30}}>
                    <NormalInput label="Note" placeholder="Note for the doctor" value={note} onChangeText={setNote} />
                </View>
                <View style={{marginTop: 30, justifyContent:"space-between", alignItems:"center", flexDirection:"row"}}>
                    <AppText>
                        Consult Fee:
                    </AppText>
                    <AppText style={{fontWeight: 700}}>
                        ₦ {consultFee}
                    </AppText>
                </View>
                <View style={{marginVertical: 20}}>
                    <NormalButtton onPress={submitForm} disabled={!isVerified}>
                        Proceed to book schedule
                    </NormalButtton>
                </View>
                </Container>
            )}
            
        </MainContainer>
     );
}
 
export default DoctorDetails;


const getStyles = (theme: ThemeType, mode: ThemeMode) =>
    StyleSheet.create({
        imageContainer:{
            height: 311,
            width: "100%",
            marginBottom: 10,
            borderRadius: 5
        },
        cardImage:{
            height: "100%",
            borderRadius: 10,
            overflow:"hidden",
            width: "100%",
            marginBottom: 10,
            // backgroundColor:"#D9D9D9",
        },
        rateButton:{
            padding: 10,
            alignItems:"center",
            justifyContent:"center",
            backgroundColor: "#1e1e1e",
            borderRadius: 20,
            flexDirection:"row"
        }
    })