import { message } from 'antd'
import { useState, useRef } from 'react'
import assets from '../../../../assets/index.js'
import './style.scss'
import { FaInstagram, FaTelegram } from 'react-icons/fa'

const DoctorReferral = () => {
  const [referralLink, setReferralLink] = useState(
    'https://pharmplug.com/referral/u/Dr.chidinma001',
  )
  const initiateCopy = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      message.success({
        content: 'Referral link Copied',
        duration: 1,
      })
    })
  }
  return (
    <div className="referral-cover">
      <div className="w-60">
        <h1>Get 10% bonus on every signup</h1>
        <p className="mb-3em font-14">
          Get 10% bonus from your clients when they sign up
        </p>
        <div className="flex gap-10 align-center">
          <div className="copy-area-input" style={{ flexGrow: 1 }}>
            <input value={referralLink} contentEditable={false} />
            <button onClick={initiateCopy}>copy</button>
          </div>
          <div className="small-icon-box">
            <FaTelegram size={18} color="#145B7A" />
          </div>
          <div className="small-icon-box">
            <FaInstagram size={18} color="#145B7A" />
          </div>
        </div>
      </div>
      <div className="w-30">
        <img src={assets.pana} style={{ width: '100%', height: 'auro' }} />
      </div>
    </div>
  )
}

export default DoctorReferral
