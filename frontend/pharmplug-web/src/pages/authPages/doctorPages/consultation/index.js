import { act, useEffect, useState } from 'react'
import { Space, Table, Tag } from 'antd'
import { useSearchParams } from 'react-router-dom'
import { useGetAPI } from '../../../../services/serviceHooks.js'
import { doctorEndpoints } from '../../../../services/constants.js'

const Consultation = () => {
  const [data, setData] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const activeNumber = Number(searchParams.get('active'))
  const [currentActive, setCurrentActive] = useState(
    activeNumber > 0 ? activeNumber : 5,
  )
  const fetchConsultations = (data) => {
    setData(data)
  }
  const { sendRequest, loading } = useGetAPI(
    doctorEndpoints.consultations,
    null,
    fetchConsultations,
  )
  useEffect(() => {
    sendRequest({ status: currentActive })
  }, [currentActive])
  return (
    <div>
      <div className="flex-between mb-2em">
        <div className="w-40 sm-w-100 mb-1em">
          <h2 className="mb-1em">Consultation</h2>
          <p className="font-14 text-gray ">
            Check and filter all your medical appointments here
          </p>
        </div>
        <div className="w-40 sm-w-100 flex-end gap-20">
          <button
            className={`filter-button${currentActive == 5 ? ' active' : ''}`}
            onClick={() => {
              setCurrentActive(5)
              setSearchParams({ active: 5 })
            }}
          >
            Ongoing Consultation
          </button>
          <button
            className={`filter-button${currentActive == 6 ? ' active' : ''}`}
            onClick={() => {
              setCurrentActive(6)
              setSearchParams({ active: 6 })
            }}
          >
            completed Consultation
          </button>
        </div>
      </div>
      <div className="table-box w-100 overflow-x-auto">
        <Table columns={columns} dataSource={data} loading={loading} />
      </div>
    </div>
  )
}

export default Consultation

const columns = [
  {
    title: 'Transactions',
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
        <a>Invite {record.name}</a>
        <a>Delete</a>
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
