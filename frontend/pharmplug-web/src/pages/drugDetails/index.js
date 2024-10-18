import DrugSearchHeader from '../../components/drugSearchHeader/index.js'
import './style.scss'
import assets from '../../assets/index.js'
import { Accordion } from '../../components/accordion/index.js'
import { NormalButton } from '../../components/button/index.js'
import Path from '../../navigations/constants.js'

import { Link, useParams } from 'react-router-dom'
import { FaCartPlus } from 'react-icons/fa'
import { ItemCard } from '../../components/card/index.js'
import HealthTipContainer from '../../components/healthTipsContainer/index.js'
import NotFound from '../notFound/index.js'
import { useContext, useEffect, useState } from 'react'
import { useGetAPI } from '../../services/serviceHooks.js'
import { endpoints } from '../../services/constants.js'
import { Loader } from '../../components/loader/index.js'
import EmptyData from '../../components/empty/index.js'
import { CartContext } from '../../context/cartContext.js'
import { message } from 'antd'

const drugDetails = () => {
  const cartContext = useContext(CartContext)
  const drugId = useParams().id
  const [notFound, setNotFound] = useState(false)
  const [data, setData] = useState({})
  const [altData, setAltData] = useState([])
  const [healthData, setHealthData] = useState([])
  const onSearch = () => {}
  const fetchData = (data) => {
    setData(data)
  }
  const fetchAltData = (data) => {
    setAltData(data)
  }
  const errorCallback = (err) => {
    if (err.status == 404) {
      setNotFound(true)
    }
  }
  const fetchHealthData = (data) => {
    setHealthData(data)
  }
  const addToCart = () =>{
    cartContext.addToCart(drugId)
    message.success(
      {
        content:"Added to Cart",
        duration: 5
      }
    )
  }
  const drugDataAPI = useGetAPI(
    endpoints.drugDetails(drugId),
    null,
    fetchData,
    errorCallback,
  )
  const altDrugDataAPI = useGetAPI(
    endpoints.drugAlternatives(drugId),
    null,
    fetchAltData,
  )
  const healthDataAPI = useGetAPI(endpoints.stories, null, fetchHealthData)
  useEffect(() => {
    drugDataAPI.sendRequest()
    healthDataAPI.sendRequest()
  }, [])
  useEffect(() => {
    if (data.id) {
      altDrugDataAPI.sendRequest()
    }
  }, [data])
  if (notFound) {
    return <NotFound />
  }
  return (
    <div className="drug-details-page-cover">
      {drugDataAPI.loading ? (
        <Loader />
      ) : (
        <>
          <DrugSearchHeader onSearch={onSearch} />
          <div className="container">
            <div className="nav-header-div">
              <p>
                &lt; <Link>Drug store</Link>
                <Link> / Sickness</Link>
                <span> / Headache</span>
              </p>
            </div>
            <div className="detail-content">
              <div className="image-div">
                <img src={data.image} alt={`${data.name} Image`} />
              </div>
              <div className="description-div">
                <h3>{data.name}</h3>
                <p className="price-text">
                  Our Price: <span>₦ {data.price}</span>
                </p>
                <p>{data.description}</p>
              </div>
              <div className="extra-div">
                <Accordion header={'Medication'}>
                  <p>Medication</p>
                </Accordion>
                <Accordion header={'Pharmacy'}>
                  <p>Medication</p>
                </Accordion>
                <Accordion header={'Talk to Doctor'}>
                  <p>Medication</p>
                </Accordion>
                <NormalButton full onClick={addToCart}>
                  Add to Cart &nbsp; <FaCartPlus size={20} color="white" />
                </NormalButton>
              </div>
            </div>

            <div className="alt-medicine">
              <h3>Altenative medications</h3>
              {altDrugDataAPI.loading ? (
                <Loader />
              ) : (
                <>
                  {altData.length === 0 && (
                    <EmptyData content="No alternative available" />
                  )}
                  <div className="drugs-div">
                    {altData.map((value, idx) => (
                      <div key={idx} className="item-card-cover">
                        <ItemCard
                          name={value.name}
                          price={value.price}
                          image={value.image}
                          link={Path.drugDetails(value.id)}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="health-section">
              <HealthTipContainer
                header2={`Read more about ${data.name}`}
                data={healthData}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default drugDetails

const tempAltData = [
  {
    id: 1,
    name: 'NatraBio expectorant',
    price: '1000000.00',
    image: assets.drug1,
  },
  {
    id: 1,
    name: 'Paracetamol',
    price: '300.00',
    image: assets.drug2,
  },
  {
    id: 1,
    name: 'Honitus Cough remedy',
    price: '20000.00',
    image: assets.drug3,
  },
]
const tempHealthData = [
  {
    title: 'Health tip: with the main photo and the headline ...',
    date: '20th June 2024',
    image: assets.tip1,
  },
  {
    title: 'Health tip: with the main photo and the headline ...',
    date: '20th June 2024',
    image: assets.tip2,
  },
  {
    title: 'Health tip: with the main photo and the headline ...',
    date: '20th June 2024',
    image: assets.tip3,
  },
  {
    title: 'Health tip: with the main photo and the headline ...',
    date: '20th June 2024',
    image: assets.tip4,
  },
]

const tempData = {
  name: 'Aloe Vera',
  price: '1000000.00',
  description: `For most adults and children, it’s uncomfortable but not
concerning. However, in infants, even low fever may
signal a serious infection Symptoms can include
sweating, chills, headache, muscle aches, and loss of 
appetite. For most adults and children, it’s uncomfortable
but not concerning. However, in infants, even a low fever
may signal a serious infection Symptoms can include 
sweating, chills, headache, muscle aches, and loss of 
appetite. `,
  image: assets.drug1,
}
