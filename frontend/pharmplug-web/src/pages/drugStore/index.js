import './style.scss'
import DrugSearchHeader from '../../components/drugSearchHeader/index.js'
import assets from '../../assets/index.js'
import ShadowBox from '../../components/shadowBox/index.js'
import Path from '../../navigations/constants.js'
import HealthTipContainer from '../../components/healthTipsContainer/index.js'

import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useGetAPI } from '../../services/serviceHooks.js'
import { endpoints } from '../../services/constants.js'
import { Loader } from '../../components/loader/index.js'
import EmptyData from '../../components/empty/index.js'

const DrugStore = () => {
  const [sicknesses, setSicknesses] = useState([])
  const [healthData, setHealthData] = useState([])

  const fetchSicknesses = (data) => {
    setSicknesses(data)
  }
  const fetchHealthData = (data) => {
    setHealthData(data)
  }

  const onSearch = () => {}
  const healthDataAPI = useGetAPI(endpoints.stories, null, fetchHealthData)
  const sicknessesAPI = useGetAPI(endpoints.commonSicknesses, null, fetchSicknesses)
  useEffect(() => {
    sicknessesAPI.sendRequest()
    healthDataAPI.sendRequest()
  }, [])
  return (
    <div>
      <DrugSearchHeader onSearch={onSearch} />
      <div className="container">
        <div className="drug-top-header">
          <h3>Common Sicknesses</h3>
          <p>Click any sickness to see drugs</p>
        </div>
        {sicknessesAPI.loading ? (
          <Loader />
        ) : (
          <>
            {sicknesses.length > 0 ? (
              <div className="sickness-box">
                {sicknesses.map((value, idx) => (
                  <div className="sickness-div" key={idx}>
                    <ShadowBox
                      image={value.image}
                      title={value.name}
                      to={Path.drugs(value.id)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyData />
            )}
          </>
        )}

        <div
          className="flex-center"
          style={{ paddingTop: '1.5em', paddingBottom: '1.5em' }}
        >
          <Link
            to={Path.drugStoreFull}
            className="link"
            style={{ fontSize: 15 }}
          >
            See More &gt;
          </Link>
        </div>
        <div>
          <HealthTipContainer data={healthData} />
        </div>
      </div>
    </div>
  )
}

export default DrugStore

const tempSicknesses = [
  {
    name: 'Cough',
    image: assets.cougher,
  },
  {
    name: 'Headache',
    image: assets.cougher,
  },
  {
    name: 'Fever',
    image: assets.cougher,
  },
  {
    name: 'Tiredness',
    image: assets.cougher,
  },
  {
    name: 'Sleep Paralysis',
    image: assets.cougher,
  },
  {
    name: 'Fever',
    image: assets.cougher,
  },
  {
    name: 'Cough',
    image: assets.cougher,
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
