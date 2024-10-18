import './style.scss'
import LetterFilter from '../letterFilter/index.js'
import Path from '../../navigations/constants.js'

import { useState } from 'react'
import { Link } from 'react-router-dom'

const DrugStoreFilterIndex = ({ current = 'A', onFilterClick }) => {
  const [navCurrent, setNavCurrent] = useState(current)
  const onLocalFilterClick = (text) => {
    onFilterClick(text)
    setNavCurrent(text)
  }
  return (
    <div className="drug-store-filter-index">
      <div className="content-div">
        <p>
          &lt; <Link to={Path.home}>Home</Link> /
          <Link to={Path.drugStore}> Common Sickness </Link> /
          <span> Begins with "{navCurrent.toUpperCase()}"</span>
        </p>
        <h3>See Drugs</h3>
      </div>
      <div className="filter-div">
        <LetterFilter current={current} onFilterClick={onLocalFilterClick} />
      </div>
    </div>
  )
}

export default DrugStoreFilterIndex
