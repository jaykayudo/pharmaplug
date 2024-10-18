import { Link } from 'react-router-dom'
import './style.scss'
import { FaHome } from 'react-icons/fa'
import assets from '../../assets/index.js'
import Path from '../../navigations/constants.js'

const NotFound = () => {
  return (
    <div className="not-found-cover">
      <img
        src={assets.notFound}
        alt="not found image"
        className="mb-1em"
        style={{ height: '40vh' }}
      />
      <h2>It seems you have lost your way !!!</h2>
      <p>
        No issues. let's help you go back{' '}
        <Link className="link" to={Path.home}>
          <FaHome />
          &nbsp;HOME
        </Link>
      </p>
    </div>
  )
}

export default NotFound
