import './style.scss'
import React, { useContext, useEffect, useState } from 'react'

import { useGetAPI, usePostAPI } from '../../../../services/serviceHooks.js'
import { endpoints } from '../../../../services/constants.js'
import { FaRegClock } from 'react-icons/fa'
import { IoLocationOutline } from 'react-icons/io5'

import { AuthContext } from '../../../../context/authContext.js'
import { useSearchParams } from 'react-router-dom'
import { LargeAccordion } from '../../../../components/accordion/index.js'
import { MiniItemCard } from '../../../../components/card/index.js'
import { Loader } from '../../../../components/loader/index.js'
import EmptyData from '../../../../components/empty/index.js'
import { consultationStatus } from '../../../../utils/enums.js'
import { NormalButton } from '../../../../components/button/index.js'
import { MiniCartItem } from '../../../../components/cartItem/index.js'
import {
  CONSULTATION_STATUS_ALT,
  ORDER_STATUS,
  ORDER_STATUS_ALT,
} from '../../../../services/serviceEnums.js'

const History = () => {
  const authContext = useContext(AuthContext)
  const [searchParams, setSearchParams] = useSearchParams()
  const [activePage, setActivePage] = useState(searchParams.get('active') ?? 1)
  const [orderList, setOrderList] = useState([])
  const [consultationList, setConsultationList] = useState([])
  const fetchConsultations = (data) => {
    setConsultationList(data)
  }
  const fetchOrders = (data) => {
    setOrderList(data)
  }
  const consultationAPI = useGetAPI(
    endpoints.consultationHistory,
    null,
    fetchConsultations,
  )
  const orderAPI = useGetAPI(endpoints.orderHistory, null, fetchOrders)
  useEffect(() => {
    orderAPI.sendRequest()
    consultationAPI.sendRequest()
  }, [])
  return (
    <div className="history-cover">
      <div className="mb-3em">
        <h2 className="mb-1em">History</h2>
        <p>Take a look at your orders and conultations</p>
      </div>
      <div>
        <div className="tab-buttons mb-2em">
          <button
            className={`${activePage == 1 ? 'active' : ''}`}
            onClick={() => setActivePage(1)}
          >
            Order History
          </button>
          <button
            className={`${activePage == 2 ? 'active' : ''}`}
            onClick={() => setActivePage(2)}
          >
            Consulation History
          </button>
        </div>
        <div className="history-box">
          {activePage == 1 && (
            <>
              {orderAPI.loading ? (
                <Loader />
              ) : (
                <>
                  {orderList.length === 0 && <EmptyData />}
                  <div className="order-box">
                    {orderList.map((value, idx) => (
                      <LargeAccordion
                        key={idx}
                        header1={`Order - ${value.order_id}`}
                        header2={`Unique Items Count: ${value.order_items.length}`}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            marginBottom: '10px',
                          }}
                        >
                          <p>
                            Price: <b>{value.price}</b>
                          </p>
                          <p>
                            Status: <b>{ORDER_STATUS[value.status]}</b>
                          </p>
                          <p>
                            Payment Type:{' '}
                            {value.payment_method == 1 && <b>Card</b>}
                            {value.payment_method == 2 && <b>Delivery</b>}
                          </p>
                          <p>
                            Email: <b>{value.email}</b>
                          </p>
                          <p>
                            Address: <b>{value.address}</b>
                          </p>
                          {value.status === ORDER_STATUS_ALT.NEW && (
                            <div
                              style={{
                                marginVertical: 10,
                                flexDirection: 'row',
                              }}
                            >
                              <NormalButton>Pay</NormalButton>
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: 10,
                          }}
                        >
                          {value.order_items.map((item, item_idx) => (
                            <div key={item_idx} className="w-45 sm-w-45">
                              <MiniCartItem
                                data={item.product}
                                quantity={item.quantity}
                              />
                            </div>
                          ))}
                        </div>
                      </LargeAccordion>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
          {activePage == 2 && (
            <>
              {consultationAPI.loading ? (
                <Loader />
              ) : (
                <>
                  {consultationList.length === 0 && <EmptyData />}
                  <div className="consultation-box">
                    {consultationList.map((value, idx) => {
                      return (
                        <div className="light-border-gray curved-box mb-1em">
                          <div className="p-1">
                            <div className="flex gap-20">
                              <img
                                src={value.doctor.image}
                                className="little-rounded-image"
                              />
                              <div>
                                <h3 className="mb-1em">
                                  Dr. {value.doctor.user.first_name}{' '}
                                  {value.doctor.user.last_name}
                                </h3>
                                <p className="mb-05em">
                                  {value.doctor.field.name}
                                </p>
                                <p className="text-gray font-14 mb-05em">
                                  <FaRegClock />{' '}
                                  <span>
                                    {value.start_time} - {value.end_time} <br />
                                    {new Date(value.day).toDateString()}
                                  </span>
                                </p>
                                <p className="text-gray font-14 mb-05em">
                                  <IoLocationOutline />{' '}
                                  <span>
                                    {value.location
                                      ? value.location
                                      : 'Not set'}
                                  </span>
                                </p>
                                <h4 className="mb-05em">Note</h4>
                                <p className="mb-05em">{value.note}</p>
                              </div>
                              <div>
                                {value.status ==
                                  CONSULTATION_STATUS_ALT.PENDING && (
                                  <p className="font-14">
                                    Awaiting Doctor Confirmation
                                  </p>
                                )}
                                {value.status ==
                                  CONSULTATION_STATUS_ALT.ACCEPTED && (
                                  <NormalButton>Pay</NormalButton>
                                )}
                                {value.status > 2 && (
                                  <p className="font-14">
                                    {consultationStatus[value.status]}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default History
