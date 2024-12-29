import './style.scss'
import { ItemCard } from '../../components/card/index.js'
import DrugSearchHeader from '../../components/drugSearchHeader/index.js'
import assets from '../../assets/index.js'
import { Link, useParams } from 'react-router-dom'
import HealthTipContainer from '../../components/healthTipsContainer/index.js'
import Path from '../../navigations/constants.js'

import { Loader } from '../../components/loader/index.js'
import { useGetAPI } from '../../services/serviceHooks.js'
import EmptyData from '../../components/empty/index.js'
import { useEffect, useState } from 'react'
import { endpoints } from '../../services/constants.js'

const DrugsList = () => {
  const sicknessId = useParams().id
  const [data, setData] = useState([])
  const [healthData, setHealthData] = useState([])
  const [sicknessData, setSicknessData] = useState({})
  const onSearch = (searchtext) => {}
  const fetchData = (data) => {
    setData(data)
  }
  const fetchHealthData = (data) => {
    setHealthData(data)
  }
  const fetchSicknessData = (data) => {
    setSicknessData(data)
  }
  const healthDataAPI = useGetAPI(endpoints.stories, null, fetchHealthData)
  const drugsAPI = useGetAPI(endpoints.drugs(sicknessId), null, fetchData)
  const sicknessDataAPI = useGetAPI(
    endpoints.sicknessesDetails(sicknessId),
    null,
    fetchSicknessData,
  )
  useEffect(() => {
    drugsAPI.sendRequest()
    healthDataAPI.sendRequest()
    sicknessDataAPI.sendRequest()
  }, [])
  return (
    <div className="drug-list-page-content">
      <DrugSearchHeader onSearch={onSearch} />
      <div className="container">
        <div className="header-div">
          <p>
            &lt; <Link>Drug store</Link>
            <Link> / Sickness</Link>
            <span> / {sicknessData.name ?? 'Loading...'}</span>
          </p>
          <h3>{sicknessData.name ?? 'Loading...'}</h3>
          <p>{sicknessData.description ?? 'Loading...'}</p>
        </div>
        {drugsAPI.loading ? (
          <Loader />
        ) : (
          <>
            {data.length === 0 && <EmptyData content="No Drugs" />}
            <div className="drugs-div">
              {data.map((value, idx) => (
                <div key={idx} className="item-card-cover">
                  <ItemCard
                    name={value.name}
                    image={value.image}
                    price={value.price}
                    link={Path.drugDetails(value.id)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
        {healthDataAPI.loading ? (
          <Loader />
        ) : (
          <div>
            <HealthTipContainer data={healthData} />
          </div>
        )}
      </div>
    </div>
  )
}

export default DrugsList

const tempData = [
  {
    id: 1,
    name: 'NatraBio expectorant',
    price: '1000000.00',
    image: assets.drug1,
  },
  {
    id: 1,
    name: 'Paracetamol',
    price: '300.00',
    image: assets.drug2,
  },
  {
    id: 1,
    name: 'Honitus Cough remedy',
    price: '20000.00',
    image: assets.drug3,
  },
  {
    id: 1,
    name: 'DayQuil syrup',
    price: '12000.00',
    image: assets.drug4,
  },
  {
    id: 1,
    name: 'DayQuil Honey',
    price: '5000.00',
    image: assets.drug5,
  },
  {
    id: 1,
    name: 'Amoxillin',
    price: '10000.00',
    image: assets.drug5,
  },
]
const tempHealthData = [
  {
    title: 'Health tip: with the main photo and the headline ...',
    date: '20th June 2024',
    image: assets.tip1,
  },
  {
    title: 'Health tip: with the main photo and the headline ...',
    date: '20th June 2024',
    image: assets.tip2,
  },
  {
    title: 'Health tip: with the main photo and the headline ...',
    date: '20th June 2024',
    image: assets.tip3,
  },
  {
    title: 'Health tip: with the main photo and the headline ...',
    date: '20th June 2024',
    image: assets.tip4,
  },
]
