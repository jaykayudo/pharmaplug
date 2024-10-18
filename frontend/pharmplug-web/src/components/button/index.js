import { Link } from 'react-router-dom'
import './style.scss'

export const HomeButton = ({ children, onClick, ...props }) => {
  return (
    <button className="home-button" onClick={onClick} {...props}>
      {children}
    </button>
  )
}

export const LinkButton = ({ children, to, full = false, ...props }) => {
  return (
    <Link to={to} className={`link-button${full ? ' full' : ''}`} {...props}>
      {children}
    </Link>
  )
}

export const NormalButton = ({ children, onClick, full = false, ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`link-button${full ? ' full' : ''}`}
      {...props}
    >
      {children}
    </button>
  )
}

export const WhiteButton = ({ children, onClick, full = false, ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`white-button${full ? ' full' : ''}`}
      {...props}
    >
      {children}
    </button>
  )
}
