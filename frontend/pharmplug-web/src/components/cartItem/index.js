import './style.scss'
import { useEffect, useRef } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa'

const CartItem = ({
  data,
  quantity,
  onQuantityIncrease,
  onQuantityDecrease,
  onCheckClick,
  checkedDeleteList,
}) => {
  const checkBoxRef = useRef()
  const analyseCheckBox = () => {
    onCheckClick(checkBoxRef.current.checked, data.id)
  }
  useEffect(() => {
    if (checkedDeleteList.includes(data.id)) {
      checkBoxRef.current.checked = true
    } else {
      checkBoxRef.current.checked = false
    }
  }, [checkedDeleteList])
  return (
    <div className="cart-item-cover">
      <div className="check-box-cover">
        <input
          className="custom-check"
          type="checkbox"
          ref={checkBoxRef}
          onChange={analyseCheckBox}
        />
      </div>
      <div className="item-detail-cover">
        <div className="image">
          <img src={data.image} />
        </div>
        <div className="details">
          <h3>{data.name}</h3>
          <p>
            Size: <span></span> &nbsp; Type: <span></span>
          </p>
        </div>
      </div>
      <div className="item-price-cover">
        <h3>₦ {data.price}</h3>
        <div className="counter">
          <button onClick={onQuantityDecrease}>
            <FaPlus size={15} />
          </button>
          <p>{quantity}</p>
          <button onClick={onQuantityIncrease}>
            <FaMinus size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartItem

export const MiniCartItem = ({ data, quantity }) => {
  return (
    <div className="mini-cart-item-cover">
      <div className="flex" style={{ width: '85%' }}>
        <div className="image-div">
          <img src={data.image} />
        </div>
        <div>
          <h3>{data.name}</h3>
          <p>Qty: {quantity}</p>
        </div>
      </div>
      <div style={{ width: '15%' }}>
        <h3 style={{ textAlign: 'right' }}>₦ {data.price}</h3>
      </div>
    </div>
  )
}
