import './style.scss'
import React, { useContext, useState } from 'react'

import { useGetAPI, usePostAPI } from '../../../../services/serviceHooks.js'
import { endpoints } from '../../../../services/constants.js'

import { AuthContext } from '../../../../context/authContext.js'
import { useSearchParams } from 'react-router-dom'
import { LargeAccordion } from '../../../../components/accordion/index.js'
import { MiniItemCard } from '../../../../components/card/index.js'
import { Loader } from '../../../../components/loader/index.js'
import EmptyData from '../../../../components/empty/index.js'

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
                        header2={`Price: ${value.price}  Status: ${value.status}`}
                      >
                        {value.order_items.map((item, item_idx) => (
                          <MiniItemCard
                            key={item_idx}
                            name={item.name}
                            image={item.image}
                          />
                        ))}
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
                    {consultationList.map((value, idx) => (
                      <LargeAccordion
                        header1={`Consultation with Dr. ${value.doctor.user.first_name}`}
                      >
                        <div>
                          <h3>Date: {value.date}</h3>
                          <h3>Start Time: {value.start_time}</h3>
                          <h3>End Time: {value.end_time}</h3>
                          <div>
                            <h3>Note</h3>
                            <p>{value.note}</p>
                          </div>
                        </div>
                      </LargeAccordion>
                    ))}
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
