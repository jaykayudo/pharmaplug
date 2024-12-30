import { useState, useEffect, useDeferredValue } from 'react'

import './style.scss'
import assets from '../../assets/index.js'
import { SearchInput } from '../input/index.js'
import { FaSearch } from 'react-icons/fa'

const DrugSearchHeader = ({
  onSearch,
  showSearchInput = true,
  header = 'Drug Store',
  description = `Browse a wide range of over-the-counter medications. Order prescription medications easily and safely online.`,
}) => {
  const [searchValue, setSearchValue] = useState('')
  const mainSearchValue = useDeferredValue(searchValue)
  const [showSearch, setShowSeaerch] = useState(false)
  useEffect(() => {
    if (mainSearchValue.length > 3) {
      onSearch(searchValue)
    }
  }, [mainSearchValue])
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
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default DrugSearchHeader
