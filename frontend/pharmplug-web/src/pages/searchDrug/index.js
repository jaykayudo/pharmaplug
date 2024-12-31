import './style.scss'
import { ItemCard } from '../../components/card/index.js'
import DrugSearchHeader from '../../components/drugSearchHeader/index.js'
import { useSearchParams } from 'react-router-dom'
import Path from '../../navigations/constants.js'

import { Loader } from '../../components/loader/index.js'
import { useGetAPI } from '../../services/serviceHooks.js'
import EmptyData from '../../components/empty/index.js'
import { useEffect, useState } from 'react'
import { endpoints } from '../../services/constants.js'

const SearchDrug = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const sicknessId = searchParams.get('category') || ''
  const query = searchParams.get('q') || ''
  const [data, setData] = useState([])
  const [sicknessData, setSicknessData] = useState({})
  const onSearch = (searchtext) => {}
  const fetchData = (data) => {
    setData(data)
  }
  const fetchSicknessData = (data) => {
    setSicknessData(data)
  }
  const drugsAPI = useGetAPI(endpoints.drugSearch, null, fetchData)
  const sicknessDataAPI = useGetAPI(
    endpoints.sicknessesDetails(sicknessId),
    null,
    fetchSicknessData,
  )
  useEffect(() => {
    if (query.length > 2) {
      drugsAPI.sendRequest({
        name: query,
        sickness: sicknessId || '',
      })
      if (sicknessId) {
        sicknessDataAPI.sendRequest()
      }
    }
  }, [query, sicknessId])
  return (
    <div className="drug-list-page-content">
      <DrugSearchHeader onSearch={onSearch} />
      <div className="container">
        <div className="header-div">
          <p>
            Search for Drug "{query}"{' '}
            {sicknessData.name &&
              `associated with sickness "${sicknessData.name}"`}
          </p>
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
      </div>
    </div>
  )
}

export default SearchDrug
