import "./style.scss"
import { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useGetAPI, usePostAPI } from "../../../../services/serviceHooks.js";
import { doctorEndpoints } from "../../../../services/constants.js";
import { Loader } from "../../../../components/loader/index.js";
import { Button, Tag, Modal, message } from "antd";
import NotFound from "../../../notFound/index.js";
import { consultationStatus } from "../../../../utils/enums.js";
import { FaClock } from "react-icons/fa";
import { NormalInput } from "../../../../components/input/index.js";
import { getDifferenceInHours, addHoursToTime, isLink } from "../../../../utils/helpers.js";
import { FaCalendar } from "react-icons/fa6";


const ConsultationDetails = () => {
    const Id = useParams().id
    const dateRef = useRef()
    const timeRef = useRef()
    const [dateMin, setDateMin] = useState("1970-01-01")
    const [data, setData] = useState({})
    const [notFound, setNotFound] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState(1);
    const [modalParams, setModalParams] = useState({
        title: "Accept Consultation",
        btnTitle: "Accept",
        action:()=>{}
    });
    const [details, setDetails] = useState("")
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const showAcceptModal = ()=>{
        showModal()
        setModalParams({
            title: "Accept Consultation",
            btnTitle: "Accept",
            action: ()=>{
                if(!details){
                    message.error({
                        content: "Details field is required",
                        duration: 2
                    })
                    return
                }
                acceptConsultAPI.sendRequest({
                    consultation: Id,
                    details: details
                })
                handleCancel()
            }
        })
        setModalState(1)
    }
    const showRescheduleModal = ()=>{
        showModal()
        setModalParams({
            title: "Reschedule Consultation",
            btnTitle: "Reschedule",
            action: ()=>{
                if(!dateRef.current?.value || !timeRef.current?.value){
                    message.error({
                        content: "Date and time fields are required",
                        duration: 2
                    })
                    return
                }
                let hours = getDifferenceInHours(data.start_time, data.end_time)
                let end_time = addHoursToTime(timeRef.current.value, hours)
                rescheduleConsultAPI.sendRequest({
                    consultation: Id,
                    day: dateRef.current.value,
                    start_time: timeRef.current.value,
                    end_time: end_time
                })
                handleCancel()
            }
        })
        setModalState(2)
    }
    const showRejectModal = ()=>{
        showModal()
        setModalParams({
            title: "Reject Consultation",
            btnTitle: "Reject",
            action: ()=>{
                if(!details){
                    message.error({
                        content: "Reason field is required",
                        duration: 2
                    })
                    return
                }
                rejectConsultAPI.sendRequest({
                    consultation: Id,
                    reason: details
                })
                handleCancel()
            }
        })
        setModalState(3)
    }
    
    const setDateTimeValidation = ()=>{
        const today = new Date();
        const formattedDateTime = today.toISOString().split('T');
        setDateMin(formattedDateTime[0])
      }
    const fetchConsultation = (data)=>{
        setData(data)
    }   
    const onErrorCallback = (err)=>{
        setNotFound(true)
    }
    const onRescheduleSuccess = (data) => {
        message.success({
            content: "Consultation Rescheduled",
            duration: 3
        })
        reloadConsultation()
    }
    const onRejectSuccess = (data) => {
        message.success({
            content: "Consultation Rejected",
            duration: 3
        })
        reloadConsultation()
    }
    const onAcceptSuccess = (data) => {
        message.success({
            content: "Consultation Accepted",
            duration: 3
        })
        reloadConsultation()
    }
    const {sendRequest} = useGetAPI(
        doctorEndpoints.consultationDetails(Id),
        setLoading,
        fetchConsultation,
        onErrorCallback
    )
    const rescheduleConsultAPI = usePostAPI(
        doctorEndpoints.consultationReschedule,
        setLoading,
        onRescheduleSuccess
    )
    const rejectConsultAPI = usePostAPI(
        doctorEndpoints.consultationReject,
        setLoading,
        onRejectSuccess
    )
    const acceptConsultAPI = usePostAPI(
        doctorEndpoints.consultationAccept,
        setLoading,
        onAcceptSuccess
    )
    const reloadConsultation = ()=>{
        sendRequest()
    }
    useEffect(()=>{
        sendRequest()
        setDateTimeValidation()
    },[])
    if(notFound){
        return (<NotFound />)
    }
    return (
        <>
            {loading?(
                <Loader />
            ):(
                <div className="container">
                    <h2 className="mb-2em">Consultation with {data.user?.first_name} {data.user?.last_name}</h2>
                    <div className="flex align-center" style={{padding: '15px 0'}}>
                        <h4 style={{marginRight: 20}}>Status:</h4>
                        <Tag color={data.status > 5 ? 'green' : 'geekblue'}>
                            {consultationStatus[data.status]}
                        </Tag>
                    </div>
                    <div className="flex align-center" style={{padding: '15px 0'}}>
                        <FaClock size={24} color="#475367" />
                        <h4 style={{color:"#475367", marginLeft: 15}}>
                            {data.start_time} - {data.end_time}&nbsp;
                            {new Date(data.day).toDateString()} 
                        </h4>
                    </div>
                    {data.details && (
                    <div className="flex align-center" style={{padding: '15px 0'}}>
                        <FaCalendar size={24} color="#475367" />
                        {isLink(data.details) ?(
                            <a href={data.details} className="link" style={{marginLeft: 15}}>
                                {data.details}
                            </a>
                        ):(
                            <p style={{color:"#475367", marginLeft: 15}}>
                                {data.details}
                            </p>
                        )}
                    </div>
                    )}
                    <div className="flex align-center" style={{padding: '30px 0'}}>
                        <h4  style={{marginRight: 20}}>Cost:</h4>
                        <span className="cost-box">
                            # {data.cost}
                        </span>
                    </div>
                    <div className="note-box">
                        <h3 className="note-header">Note</h3>
                        <p className="note-paragraph">
                            {data.note}
                        </p>
                    </div>
                    <div className="flex-between" style={{marginTop: 30}}>
                        <div>
                            {data.status === 1 && (
                                <Button 
                                style={{backgroundColor:"green", color:"white", marginRight:15}}
                                variant="solid"
                                onClick={showAcceptModal}
                            >
                                Accept
                            </Button>
                            )}
                            {data.status < 6 && data.status !== 3 && (
                                <Button color="primary" variant="solid" onClick={showRescheduleModal}>
                                    Reschedule
                                </Button>
                            )}
                        </div>
                        {data.status === 1 &&(
                            <div>
                                <Button color="danger" variant="solid" onClick={showRejectModal}>
                                    Reject
                                </Button>
                            </div>
                        )}
                        
                    </div>
                    <Modal title={modalParams.title} open={isModalOpen} onOk={modalParams.action} okText={modalParams.btnTitle} onCancel={handleCancel}>
                        {modalState === 1 && (
                            <div>
                                <h3 style={{marginBottom: 15}}>Enter the location for the consultation (virtual or physical)</h3>
                                <NormalInput label={'Details'} type='text' onChange={(e)=>setDetails(e.target.value)} value={details} />
                            </div>
                        )}
                        {modalState === 2 && (
                            <div>
                                <h3 style={{marginBottom: 15}}>Choose a new date and time</h3>
                                <NormalInput label={'Date'} type='date' ref={dateRef} min={dateMin}  />
                                <NormalInput label={'Start Time'} type='time' ref={timeRef}  />
                                <p style={{fontSize: 12, fontStyle:"italic", color:"#1e1e1e"}}>
                                    Note: The duration will be the same as the patient's initial selected duration
                                </p>
                            </div>
                        )}
                        {modalState === 3 && (
                            <div>
                                <h3 style={{marginBottom: 15}}>Enter a reason for canceling</h3>
                                <NormalInput label={'Reason'} type='text' onChange={(e)=>setDetails(e.target.value)} value={details} />    
                            </div>
                        )}
                    </Modal>
                </div>
            )}  
        </>
        
     );
}
 
export default ConsultationDetails;