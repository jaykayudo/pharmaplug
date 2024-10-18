import './style.scss'
import { useState } from 'react'
import { PiCaretDownBold, PiCaretUpBold } from 'react-icons/pi'

export const Accordion = ({ children, header }) => {
  const [show, setShow] = useState(false)
  return (
    <div className="accordion">
      <div className="accordion-header">
        <h3>{header}</h3>
        <button onClick={() => setShow((prevState) => !prevState)}>
          {show ? (
            <PiCaretUpBold size={15} color="black" />
          ) : (
            <PiCaretDownBold size={15} color="black" />
          )}
        </button>
      </div>
      <div className={`accordion-content${show ? ' accordion-show' : ''}`}>
        {children}
      </div>
    </div>
  )
}

export const MiniAccordion = ({ children, header }) => {
  const [show, setShow] = useState(false)
  return (
    <div className="mini-accordion">
      <div className="mini-accordion-header">
        <h3>{header}</h3>
        <button onClick={() => setShow((prevState) => !prevState)}>
          {show ? (
            <PiCaretUpBold size={15} color="black" />
          ) : (
            <PiCaretDownBold size={15} color="black" />
          )}
        </button>
      </div>
      <div className={`mini-accordion-content${show ? ' accordion-show' : ''}`}>
        {children}
      </div>
    </div>
  )
}

export const LargeAccordion = ({
  children,
  header1,
  header2,
  initialShow = true,
}) => {
  const [show, setShow] = useState(initialShow)
  return (
    <div className="large-accordion">
      <div className="large-accordion-header">
        <div>
          <h3>{header1}</h3>
          <p>{header2}</p>
        </div>
        <button onClick={() => setShow((prevState) => !prevState)}>
          {show ? (
            <PiCaretUpBold size={15} color="black" />
          ) : (
            <PiCaretDownBold size={15} color="black" />
          )}
        </button>
      </div>
      <div
        className={`large-accordion-content${show ? ' accordion-show' : ''}`}
      >
        {children}
      </div>
    </div>
  )
}
