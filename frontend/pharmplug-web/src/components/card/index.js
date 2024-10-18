import { FaCartPlus } from 'react-icons/fa'
import { LinkButton } from '../button/index.js'
import './style.scss'

import { Link } from 'react-router-dom'

export const HealthCard = ({ image, description, date }) => {
  return (
    <div className="health-card">
      <div className="img-div">
        <img src={image} alt={`${description} image`} />
      </div>
      <div className="content-div">
        <h3>
          {description.length > 60
            ? description.slice(0, 60) + '...'
            : description}
        </h3>
        <p>{date}</p>
      </div>
    </div>
  )
}

export const ItemCard = ({ image, name, price, link, buyLink }) => {
  return (
    <div className="item-card">
      <div className="detail-cover">
        <div className="image-div">
          <img src={image} alt={name} />
        </div>
        <div className="content-div">
          <h3>{name}</h3>
          <p>₦{price}</p>
        </div>
      </div>
      <LinkButton to={buyLink} full>
        Buy now
      </LinkButton>
      <Link className="link text-center more-link" to={link}>
        Learn more
      </Link>
    </div>
  )
}

export const MiniItemCard = ({ name, price, image, onCartAdd }) => {
  return (
    <div className="mini-item-card">
      <div className="image-div">
        <img src={image} />
        <button onClick={onCartAdd}>
          <FaCartPlus size={15} color="white" />
        </button>
      </div>
      <div className="content-div">
        <p>{name}</p>
        <h3>₦{price}</h3>
      </div>
    </div>
  )
}
