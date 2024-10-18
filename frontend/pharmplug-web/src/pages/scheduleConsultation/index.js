import './style.scss'
import { RxCaretLeft } from 'react-icons/rx'
import assets from '../../assets/index.js'
import { IoLocationOutline } from 'react-icons/io5'
import { NormalInput, NormalTextArea } from '../../components/input/index.js'
import { LinkButton, NormalButton } from '../../components/button/index.js'
import { useGetAPI, usePostAPI } from '../../services/serviceHooks.js'
import { endpoints } from '../../services/constants.js'
import { useNavigate, useParams } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import NotFound from '../notFound/index.js'
import { Loader } from '../../components/loader/index.js'
import Path from '../../navigations/constants.js'
import { AuthContext } from '../../context/authContext.js'
import { message } from 'antd'

const ScheduleConsultation = () => {
  const doctorId = useParams().id
  const authContext = useContext(AuthContext)
  const navigate = useNavigate()
  const [doctor, setDoctor] = useState(null)
  const [note, setNote] = useState('')
  const [date, setDate] = useState('')
  const fetchDoctor = (data) => {
    setDoctor(data)
  }
  const successCallback = (data) => {}
  const submitForm = () => {
    if (!note || !date) {
      message.error({
        content: 'Date, Time and Note fields are required',
        duration: 2,
      })
      return
    }
    const data = {
      note: note,
      date: date,
      doctor: doctorId,
    }
    scheduleConsultationAPI.sendRequest(data)
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
  useEffect(() => {
    sendRequest()
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
                      <h4>Dr. {doctor.name}</h4>
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
                      <NormalInput label={'Select Date and Time'} />
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
                        <h3>NGN {doctor.rate}</h3>
                      </button>
                      <NormalButton
                        onClick={submitForm}
                        disabled={scheduleConsultationAPI.loading}
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
