import './style.scss'
import { useState } from 'react'

const LetterFilter = ({ onFilterClick, current = null }) => {
  const letterList = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('')
  const [currentButton, setCurrentButton] = useState(current || letterList[0])
  const onButtonClick = (text) => {
    onFilterClick(text)
    setCurrentButton(text)
  }
  return (
    <div className="letter-filter-cover">
      {letterList.map((value, idx) => (
        <button
          key={idx}
          className={`letter-filter-button${currentButton.toUpperCase() == value ? ' active' : ''}`}
          onClick={() => onButtonClick(value)}
        >
          {value}
        </button>
      ))}
    </div>
  )
}

export default LetterFilter
