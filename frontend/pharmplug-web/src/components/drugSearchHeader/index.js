import { useState, useEffect, useDeferredValue } from 'react'

import './style.scss'
import assets from '../../assets/index.js'
import { SearchInput } from '../input/index.js'
import { FaSearch } from 'react-icons/fa'
import { useGetAPI } from '../../services/serviceHooks.js'
import { endpoints } from '../../services/constants.js'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import Path from '../../navigations/constants.js'

const DrugSearchHeader = ({
  onSearch,
  showSearchInput = true,
  header = 'Drug Store',
  description = `Browse a wide range of over-the-counter medications. Order prescription medications easily and safely online.`,
}) => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()

  const [searchValue, setSearchValue] = useState(searchParams.get('q') || '')
  const mainSearchValue = useDeferredValue(searchValue)
  const [showSearch, setShowSeaerch] = useState(false)

  const [categoryValue, setCategoryValue] = useState(
    searchParams.get('category') || '',
  )
  const [categoryData, setCategoryData] = useState([])

  const truncateText = (text) => {
    const maxLength = 10
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...'
    }
    return text
  }

  const fetchSicknesses = (data) => {
    setCategoryData(
      data.map((value) => ({
        value: value.id,
        label: truncateText(value.name),
      })),
    )
  }
  const getSicknessAPI = useGetAPI(endpoints.sicknesses, null, fetchSicknesses)
  // useEffect(() => {
  //   if (mainSearchValue.length > 3) {
  //     onSearch(searchValue)
  //   }
  // }, [mainSearchValue])
  useEffect(() => {
    getSicknessAPI.sendRequest()
  }, [])
  useEffect(() => {
    if (mainSearchValue.length > 3) {
      let replace = false
      if (location.pathname === Path.search) {
        replace = true
      }
      navigate(
        `${Path.search}?q=${mainSearchValue}&category=${categoryValue}`,
        { replace },
      )
    }
  }, [categoryValue, mainSearchValue])
  return (
    <div
      className="drug-search-container"
      style={{ backgroundImage: `url(${assets.drugSearchBg})` }}
    >
      <div className="container flex-between">
        <div className="content-side">
          <h3>{header}</h3>
          <p>{description}</p>
          {showSearchInput && (
            <button
              className="search-alt"
              onClick={() => setShowSeaerch((prevState) => !prevState)}
            >
              <FaSearch />
            </button>
          )}
        </div>
        {showSearchInput && (
          <div className={`search-side${showSearch ? ' show' : ''}`}>
            <SearchInput
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onCategoryChange={(e) => setCategoryValue(e.target.value)}
              categoryData={categoryData}
              categoryDefaultValue={categoryValue}
              categoryPlaceholderText="All Sicknesses"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default DrugSearchHeader
