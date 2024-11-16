import './style.scss'
import Path from '../../navigations/constants.js'
import DrugSearchHeader from '../../components/drugSearchHeader/index.js'
import DrugStoreFilterIndex from '../../components/drugStoreFilterIndex/index.js'
import { LinkButton, NormalButton } from '../../components/button/index.js'

import { Link, useSearchParams } from 'react-router-dom'
import { Loader } from '../../components/loader/index.js'
import EmptyData from '../../components/empty/index.js'
import { useCallback, useEffect, useState } from 'react'
import { useGetAPI } from '../../services/serviceHooks.js'
import { endpoints } from '../../services/constants.js'

const DrugStoreFull = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState(data)
  const [searchParams, setSearchParams] = useSearchParams()

  const onFilterClick = (text) => {
    setSearchParams({ filter: text })
  }
  const onSearch = () => {}
  const handleNext = () => {}
  const headerChecker = (idx, value) => {
    if (idx == 0) {
      return true
    } else if (filteredData.length === 0) {
      return false
    } else if (
      filteredData[idx - 1].name.toLowerCase().slice(0, 2) !=
      value.name.toLowerCase().slice(0, 2)
    ) {
      return true
    }
    return false
  }
  const scrollToTop = useCallback((e) => {
    e.preventDefault()
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [])
  const filterData = (text) => {
    setFilteredData(
      data.filter((value) => value.name.toLowerCase().startsWith(text.toLowerCase())),
    )
  }
  const fetchData = (data) => {
    setData(data)
  }
  const { sendRequest, loading } = useGetAPI(
    endpoints.sicknesses,
    null,
    fetchData,
  )
  useEffect(() => {
    sendRequest()
  }, [])
  useEffect(() => {
    const filter = searchParams.get('filter') ?? 'A'
    if (filter && typeof filter == 'string') {
      filterData(filter)
    }
  }, [searchParams, data])
  return (
    <div>
      <DrugSearchHeader onSearch={onSearch} />
      <div className="container" style={{ paddingTop: '1em' }}>
        {loading ? (
          <Loader />
        ) : (
          <>
            <DrugStoreFilterIndex
              current={searchParams.get('filter') ?? 'A'}
              onFilterClick={onFilterClick}
            />
            <div style={{ paddingTop: '1em', paddingBottom: '1em' }}>
              {filteredData.length == 0 && <EmptyData />}
              {filteredData.map((value, idx) => (
                <div key={idx}>
                  {headerChecker(idx, value) && (
                    <div className="sickness-link-header">
                      <h2>{value.name.slice(0, 2)}</h2>
                    </div>
                  )}
                  <div className="sickness-link-cover">
                    <Link to={Path.drugs(value.id)} className="sickness-link">
                      {value.name}
                    </Link>
                  </div>
                </div>
              ))}
              {filteredData.length > 0 && (
                <div
                  className="flex-between"
                  style={{ paddingTop: '1.2em', paddingBottom: '1.2em' }}
                >
                  <Link className="green-link" to={'#'} onClick={scrollToTop}>
                    Back to top
                  </Link>
                  <NormalButton onClick={handleNext}>Next</NormalButton>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default DrugStoreFull

const tempData = [
  {
    id: 1,
    name: 'ab sickness',
  },
  {
    id: 1,
    name: 'ab sickness',
  },
  {
    id: 1,
    name: 'ac sickness',
  },
  {
    id: 1,
    name: 'ad sickness',
  },
  {
    id: 1,
    name: 'ae sickness',
  },
  {
    id: 1,
    name: 'af sickness',
  },
  {
    id: 1,
    name: 'ag sickness',
  },
]
