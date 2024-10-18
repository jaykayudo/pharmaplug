import { Link } from 'react-router-dom'
import './style.scss'

const ShadowBox = ({ to, image, title }) => {
  return (
    <Link
      to={to}
      className="shadow-box"
      style={{ backgroundImage: `url("${image}")` }}
    >
      <h3>{title}</h3>
    </Link>
  )
}

export default ShadowBox
