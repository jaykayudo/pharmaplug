import { FaCaretLeft, FaRegFileAlt, FaRegClock } from 'react-icons/fa'
import { WhiteButton } from '../../../../components/button/index.js'
import { CiCalendar } from 'react-icons/ci'
import { RxCaretRight } from 'react-icons/rx'
import { LuShoppingCart } from 'react-icons/lu'
import { IoLocationOutline } from 'react-icons/io5'
import assets from '../../../../assets/index.js'
import './style.scss'
import { Link } from 'react-router-dom'
import Path from '../../../../navigations/constants.js'
import { useGetAPI } from '../../../../services/serviceHooks.js'
import { endpoints } from '../../../../services/constants.js'
import { useEffect, useState } from 'react'

const UserDashboard = () => {
  const [medications, setMedications] = useState(0)
  const [consultations, setConsultations] = useState(0)
  const [upcomingConsultation, setUpcomingConsultation] = useState(null)
  const fetchDashboardData = (data) => {
    setMedications(data.medications ?? 0)
    setConsultations(data.consultations ?? 0)
    setUpcomingConsultation(data.upcoming_consultation ?? null)
  }
  const { sendRequest } = useGetAPI(
    endpoints.userDashboard,
    null,
    fetchDashboardData,
  )
  useEffect(() => {
    sendRequest()
  }, [])
  return (
    <div>
      <div className="mb-3em">
        <h1 style={{ marginBottom: 0.5 }}>Welcome, David</h1>
        <p className="font-16 text-gray">
          We hope you’re taking good care of your health 😊
        </p>
      </div>
      <div className="flex gap-20">
        <div className="w-45 sm-w-100">
          <div className="flex-between mb-1em">
            <div className="w-45">
              <div className="flex-between curved-box p-1 light-border-gray">
                <div className="mb-05em">
                  <p className="mb-2em">Medications</p>
                  <h3 className="font-22">{medications}</h3>
                </div>
                <div className="rounded-icon light-border-gray bg-white">
                  <FaRegFileAlt size={20} />
                </div>
              </div>
            </div>
            <div className="w-45">
              <div className="flex-between curved-box p-1 light-border-gray">
                <div className="mb-05em">
                  <p className="mb-2em">Consultations</p>
                  <h3 className="font-22">{consultations}</h3>
                </div>
                <div className="rounded-icon light-border-gray bg-white">
                  <FaRegFileAlt size={20} />
                </div>
              </div>
            </div>
          </div>
          {upcomingConsultation && (
            <div className="light-border-gray curved-box">
              <div className="flex-between light-border-bottom-gray p-1">
                <h3>Upcoming Consultations</h3>
                <button className="blue-button">Reschedule</button>
              </div>
              <div className="p-1">
                <div className="flex gap-20">
                  <img src={assets.profile} className="little-rounded-image" />
                  <div>
                    <h3 className="mb-1em">
                      {upcomingConsultation.doctor.full_name}
                    </h3>
                    <p className="mb-05em">
                      {upcomingConsultation.doctor.field}
                    </p>
                    <p className="text-gray font-14 mb-05em">
                      <FaRegClock />{' '}
                      <span>11.30 - 12.00 (30 min) Friday, 6 July</span>
                    </p>
                    <p className="text-gray font-14 mb-05em">
                      <IoLocationOutline />{' '}
                      <span>
                        Cottage Medicare Hospital, 18 Iwaya Rd, Yaba 101245,
                        Lagos
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="w-45 sm-w-100 light-border-gray curved-box">
          <div className="flex-between light-border-bottom-gray p-1">
            <h3>Quick Actions</h3>
          </div>
          <div className="p-1">
            <div className="quick-action-box">
              <div className="quick-action-icon">
                <CiCalendar fontSize={22} color="#1E1E1E" />
              </div>
              <Link className="quick-action-link" to={Path.allDoctors}>
                <div>
                  <h3>Book an Appointment</h3>
                  <p>Find a doctor and specialization</p>
                </div>
                <span>
                  <RxCaretRight size={30} color="#1E1E1E" />
                </span>
              </Link>
            </div>
            <div className="quick-action-box">
              <div className="quick-action-icon">
                <IoLocationOutline fontSize={22} color="#1E1E1E" />
              </div>
              <Link className="quick-action-link" to={Path.allDoctors}>
                <div>
                  <h3>Locate a hospital near you</h3>
                  <p>Find closest hospitals</p>
                </div>
                <span>
                  <RxCaretRight size={30} color="#1E1E1E" />
                </span>
              </Link>
            </div>
            <div className="quick-action-box">
              <div className="quick-action-icon">
                <LuShoppingCart fontSize={22} color="#1E1E1E" />
              </div>
              <Link
                className="quick-action-link"
                style={{ borderBottom: 'none' }}
                to={Path.drugStoreFull}
              >
                <div>
                  <h3>Buy Medication</h3>
                  <p>Search and buy medications</p>
                </div>
                <span>
                  <RxCaretRight size={30} color="#1E1E1E" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
