import { IoWalletOutline } from 'react-icons/io5'
import { Space, Table, Tag } from 'antd'
import { doctorEndpoints } from '../../../../services/constants.js'
import { useGetAPI } from '../../../../services/serviceHooks.js'
import { useEffect, useState } from 'react'

const Wallet = () => {
  const [wallet, setWallet] = useState({})
  const [walletEarnedAmount, setWalletEarnedAmount] = useState(0)
  const [data, setData] = useState([])
  const fetchWalletData = (data) => {
    setWallet(data)
  }
  const fetctWalletTransactions = (data) => {
    setData(data)
  }
  const fetchWalletEarnedAmount = (data) => {
    setWalletEarnedAmount(data ?? 0)
  }
  const walletTransactionAPI = useGetAPI(
    doctorEndpoints.walletTransactions,
    null,
    fetctWalletTransactions,
  )
  const walletAPI = useGetAPI(doctorEndpoints.wallet, null, fetchWalletData)
  const walletEarnedAmountAPI = useGetAPI(
    doctorEndpoints.walletEarnedAmounts,
    null,
    fetchWalletEarnedAmount,
  )
  useEffect(() => {
    walletAPI.sendRequest()
    walletTransactionAPI.sendRequest()
    walletEarnedAmountAPI.sendRequest()
  }, [])
  return (
    <div>
      <div className="flex-between mb-2em">
        <div>
          <h2>Wallet</h2>
          <p style={{ fontSize: 14 }}>
            Check and filter all your medical transactions
          </p>
        </div>
        <div></div>
      </div>
      <div className="flex gap-20 align-center mb-2em">
        <div className="data-box w-40 sm-w-100">
          <div className="mb-2em flex-between">
            <h2>Wallet Balance</h2>
          </div>
          <div className="flex gap-20">
            <div className="data-box-icon">
              <IoWalletOutline size={25} color="#145B7A" />
            </div>
            <div>
              <p>Total Amount</p>
              <h3 className="text-bold">NGN {wallet.amount ?? 0}</h3>
            </div>
          </div>
        </div>
        <div className="data-box w-40 sm-w-100">
          <div className="mb-2em flex-between">
            <h2>All Transactions</h2>
          </div>
          <div className="flex gap-20">
            <div className="data-box-icon">
              <IoWalletOutline size={25} color="#145B7A" />
            </div>
            <div>
              <p>Total Amount</p>
              <h3 className="text-bold">NGN {walletEarnedAmount}</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="table-box w-100 overflow-x-auto">
        <Table
          columns={columns}
          dataSource={data}
          loading={walletTransactionAPI.loading}
        />
      </div>
    </div>
  )
}

export default Wallet

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
