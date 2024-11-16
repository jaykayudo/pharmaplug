import './style.scss'
import { RxCaretLeft } from 'react-icons/rx'
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import assets from '../../assets/index.js'
import { IoLocationOutline } from 'react-icons/io5'
import { NormalInput, NormalSelect, NormalTextArea } from '../../components/input/index.js'
import { LinkButton, NormalButton } from '../../components/button/index.js'
import { useGetAPI, usePostAPI } from '../../services/serviceHooks.js'
import { endpoints } from '../../services/constants.js'
import { useNavigate, useParams } from 'react-router-dom'
import { useContext, useEffect, useRef, useState } from 'react'
import NotFound from '../notFound/index.js'
import { Loader, MiniLoader } from '../../components/loader/index.js'
import Path from '../../navigations/constants.js'
import { AuthContext } from '../../context/authContext.js'
import { message } from 'antd'

const ScheduleConsultation = () => {
  const doctorId = useParams().id
  const authContext = useContext(AuthContext)
  const navigate = useNavigate()
  const [doctor, setDoctor] = useState(null)
  const [dateMin, setDateMin] = useState("1970-01-01")
  const [timeMin, setTimeMin] = useState(undefined)
  const [duration, setDuration] = useState(null)
  const [isVerified, setIsVerified] = useState(false)
  const [consultFee, setConsultFee] = useState("0.00")

  const dateRef = useRef()
  const timeRef = useRef()
  const [note, setNote] = useState('')
  const [date, setDate] = useState('')
  const fetchDoctor = (data) => {
    setDoctor(data)
  }
  const setDateTimeValidation = ()=>{
    const today = new Date();
    const formattedDateTime = today.toISOString().split('T');
    setDateMin(formattedDateTime[0])
  }
  const successCallback = (data) => {
    message.success({
      content: "Consultation booked.. waiting for doctor to accept before proceeding to payment",
      duration: 2
    })
    navigate(`${Path.userHistory}?active=2`)
  }
  const onDateChange = (e)=>{
    if(timeRef.current?.value && dateRef.current?.value && duration){
      verifyDoctorAvailabilityAPI.sendRequest({
        "date": dateRef.current.value,
        "time": timeRef.current.value,
        "duration": duration
      })
    }else{
      setIsVerified(false)
      setConsultFee("0.00")
    }
  }
  const onTimeChange = (e) =>{
    if(timeRef.current?.value && dateRef.current?.value && duration){
      verifyDoctorAvailabilityAPI.sendRequest({
        "date": dateRef.current.value,
        "time": timeRef.current.value,
        "duration": duration
      })
    }else{
      setIsVerified(false)
      setConsultFee("0.00")
    }
  }
  const validateTime = () =>{
    const today = new Date()
    const formattedDateTime = today.toISOString().split("T")
    const formattedTime = formattedDateTime[1].split(":", 2).join(":")
    if(formattedDateTime[0] == dateRef.current.value){
      if(timeRef.current.value <= formattedTime){
        return false
      }
    }
    return true
    
  }
  const submitForm = () => {
    
    if (!note || !dateRef.current?.value || !timeRef.current?.value  || !duration) {
      message.error({
        content: 'Date, Time, Duration and Note fields are required',
        duration: 2,
      })
      return
    }
    if(!validateTime()){
      message.error({
        content: 'Time value is invalid',
        duration: 2,
      })
      return
    }
    const data = {
      note: note,
      start_time: timeRef.current.value,
      day: dateRef.current.value,
      duration: duration,
      doctor: doctorId,
    }
    scheduleConsultationAPI.sendRequest(data)
  }
  const verifySchedule = (data) => {
    setIsVerified(data)
  }
  const getConsultFee = (data) =>{
    setConsultFee(data)
  }
  const { sendRequest, loading } = useGetAPI(
    endpoints.doctorDetails(doctorId),
    null,
    fetchDoctor,
  )
  const scheduleConsultationAPI = usePostAPI(
    endpoints.scheduleAppointment,
    null,
    successCallback,
  )
  const verifyDoctorAvailabilityAPI = useGetAPI(
    endpoints.doctorAvailabilityVerify(doctorId),
    null,
    verifySchedule
  )
  const consultFeeAPI = useGetAPI(
    endpoints.doctorConsultFee(doctorId),
    null,
    getConsultFee
  )
  useEffect(()=>{
    if(timeRef.current?.value && dateRef.current?.value && duration){
      verifyDoctorAvailabilityAPI.sendRequest({
        "date": dateRef.current.value,
        "time": timeRef.current.value,
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
        date: dateRef.current?.value ?? null,
        time: timeRef.current?.value ?? null,
        duration: duration
      })
    }else{
      setConsultFee("0.00")
    }
  },[isVerified, duration])
  useEffect(() => {
    sendRequest()
    setDateTimeValidation()
  }, [])
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {!doctor ? (
            <NotFound />
          ) : (
            <div className="container" style={{ paddingTop: '1em' }}>
              <div className="flex mb-3em">
                <button style={{ background: 'none' }}>
                  <RxCaretLeft fontSize={30} style={{ marginRight: '1em' }} />
                </button>

                <div>
                  <h3 className="mb-05em">Book appointment</h3>
                  <p className="text-gray font-14">
                    fill up the details to schedule an appointment
                  </p>
                </div>
              </div>
              <h1 className="text-green">Schedule Online Consultation</h1>
              <div className="w-50 sm-w-100 p-3">
                <div className="flex-between mb-2em">
                  <div className="flex">
                    <img
                      className="little-rounded-image"
                      src={assets.doctor2}
                      style={{ marginRight: '1em' }}
                    />
                    <div>
                      <h4>Dr. {doctor.user.first_name} {doctor.user.last_name}</h4>
                      <h4>{doctor.field.name}</h4>
                      <p className="text-gray font-14">
                        <IoLocationOutline size={14} /> Lagos, Nigeria
                      </p>
                    </div>
                  </div>
                  <button
                    className="blue-button"
                    onClick={() => navigate(Path.allDoctors)}
                  >
                    Change
                  </button>
                </div>
                {authContext.isLoggedIn ? (
                  <>
                    <div>
                      <h3 className='mb-05em'>Select the Date and Time</h3>
                      <div className='flex-between'>
                      <div className='w-90'>
                        <NormalInput label={'Date'} type='date' ref={dateRef} min={dateMin} onChange={onDateChange}  />
                        <NormalInput label={'Time'} type='time' ref={timeRef} onChange={onTimeChange} />
                        <NormalSelect headerLabel={'Duration (in hours)'} onChange={(e)=>setDuration(e.target.value)}>
                          <option value={"1"}> 
                            1
                          </option>
                          <option value={"2"}> 
                            2
                          </option>
                          <option value={"3"}> 
                            3
                          </option>
                          <option value={"4"}> 
                            4
                          </option>
                          <option value={"5"}> 
                            5
                          </option>
                          <option value={"6"}> 
                            6
                          </option>
                          <option value={"7"}> 
                            7
                          </option>
                        </NormalSelect>

                      </div>
                      <div className='w-10'>
                        {verifyDoctorAvailabilityAPI.loading ? (
                          <MiniLoader />
                        ):(
                          <>
                            {!isVerified ? (
                              <FiAlertTriangle color='red' size={20} title='Doctor not available' />
                            ):(
                              <FiCheckCircle color='green' size={20} title='Doctor available' />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    </div>
                    
                    <div className="mb-2em">
                      <h3 className="mb-1em">
                        Have you consulted this doctor before on Pharmplug?
                      </h3>
                      <label>
                        <input type="radio" /> Yes
                      </label>
                      &nbsp;
                      <label>
                        <input type="radio" /> No
                      </label>
                    </div>
                    <div className="mb-1em">
                      <NormalTextArea
                        label={'Leave a note for the Doctor '}
                        placeholder="leave a note for the doctor"
                        onChange={(e) => setNote(e.target.value)}
                        value={note}
                      />
                    </div>
                    <div>
                      <button className="p-2 curved-box flex-between mb-2em bg-gray gap-20">
                        <span>Amount:</span>
                        <h3>NGN {consultFee}</h3>
                      </button>
                      <NormalButton
                        onClick={submitForm}
                        disabled={scheduleConsultationAPI.loading || !isVerified}
                      >
                        book appointment
                      </NormalButton>
                    </div>
                  </>
                ) : (
                  <div className="flex-center">
                    <LinkButton to={Path.login}>
                      Login to Book Appointment
                    </LinkButton>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default ScheduleConsultation
