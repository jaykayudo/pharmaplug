import React, { useEffect, useState } from 'react'
import { Space, Table, Tag } from 'antd'
import { FaRegFileAlt, FaUsers } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { IoWalletOutline } from 'react-icons/io5'
import { useGetAPI } from '../../../../services/serviceHooks.js'
import { doctorEndpoints } from '../../../../services/constants.js'
import Path from '../../../../navigations/constants.js'

const DoctorDashboard = () => {
  const [pendingConsultData, setPendingConsultData] = useState([])
  const [statData, setStatData] = useState({})
  const [wallet, setWallet] = useState({})
  const fetchDashboardStat = (data) => {
    setStatData(data)
  }
  const fetchPendingConsults = (data) => {
    setPendingConsultData(
      data.map((val) => ({
        id: val.id,
        name: `${val.user.first_name} ${val.user.last_name}`,
        message: val.note,
        date: new Date(val.day).toLocaleDateString(),
        status: val.status,
      })),
    )
  }
  const fetchWalletData = (data) => {
    setWallet(data)
  }
  const dashboardStatAPI = useGetAPI(
    doctorEndpoints.dashboardStat,
    null,
    fetchDashboardStat,
  )
  const walletAPI = useGetAPI(doctorEndpoints.wallet, null, fetchWalletData)
  const pendingConsultAPI = useGetAPI(
    doctorEndpoints.consultations,
    null,
    fetchPendingConsults,
  )
  useEffect(() => {
    dashboardStatAPI.sendRequest()
    walletAPI.sendRequest()
    pendingConsultAPI.sendRequest()
  }, [])
  return (
    <div>
      <h1 className="mb-2em">Welcome back, Joe</h1>
      <div className="flex-between">
        <div className="data-box w-40 sm-w-100">
          <div className="mb-2em">
            <h2>Patient</h2>
          </div>
          <div className="flex-between">
            <div className="w-45">
              <div className="flex gap-20">
                <div className="data-box-icon">
                  <FaUsers size={25} color="#145B7A" />
                </div>
                <div>
                  <h3 className="text-bold">{statData.patient_num || 0}</h3>
                  <p>Patient</p>
                </div>
              </div>
            </div>
            <div className="w-45">
              <div className="flex gap-20">
                <div className="data-box-icon">
                  <FaUsers size={25} color="#145B7A" />
                </div>
                <div>
                  <h3>{statData.all_consult_num || 0}</h3>
                  <p>Consultation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="data-box w-25 sm-w-100">
          <div className="mb-2em flex-between">
            <h2>Wallet</h2>
            <Link className="link" to={Path.doctorWallet}>
              view wallet
            </Link>
          </div>
          <div className="flex gap-20">
            <div className="data-box-icon">
              <IoWalletOutline size={25} color="#145B7A" />
            </div>
            <div>
              <p>Total Amount</p>
              <h3 className="text-bold">NGN {wallet.amount || 0}</h3>
            </div>
          </div>
        </div>
        <div className="data-box w-30 sm-w-100">
          <div className="mb-2em flex-between">
            <h2>Pending Consultations</h2>
          </div>
          <div className="flex gap-20" style={{ alignItems: 'center' }}>
            <div className="data-box-icon">
              <FaRegFileAlt size={25} color="#145B7A" />
            </div>
            <div>
              <p>
                You have {statData.pending_consult_num || 0}{' '}
                <Link
                  className="link"
                  to={`${Path.doctorConsultations}?active=1`}
                  style={{ textDecoration: 'underline' }}
                >
                  pending consultations
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="table-box w-60 sm-w-100 overflow-x-auto">
          <h3 className="mb-2em">Pending Consultations</h3>
          <Table columns={columns} dataSource={pendingConsultData} />
        </div>
        <div className="w-40 sm-w-100"></div>
      </div>
    </div>
  )
}

export default DoctorDashboard

const columns = [
  {
    title: 'Patient',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Message',
    dataIndex: 'message',
    key: 'message',
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    render: (_, { status }) => (
      <>
        <Tag color={status.length > 7 ? 'green' : 'geekblue'} key={status}>
          {status}
        </Tag>
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a href={Path.doctorConsultationsDetails(record.id)}>View</a>
      </Space>
    ),
  },
]
const tempData = [
  {
    key: '1',
    name: 'John Brown',
    date: 32,
    message: 'New York No. 1 Lake Park',
    status: 'pending',
  },
  {
    key: '2',
    name: 'Jim Green',
    date: 42,
    message: 'London No. 1 Lake Park',
    status: 'completed',
  },
  {
    key: '3',
    name: 'Joe Black',
    date: 32,
    message: 'Sydney No. 1 Lake Park',
    status: 'pending',
  },
]
