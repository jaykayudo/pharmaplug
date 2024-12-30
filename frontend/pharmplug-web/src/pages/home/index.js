import './style.scss'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FaArrowAltCircleRight,
  FaArrowCircleLeft,
  FaArrowRight,
} from 'react-icons/fa'

import { HomeButton } from '../../components/button/index.js'
import HealthTipContainer from '../../components/healthTipsContainer/index.js'
import assets from '../../assets/index.js'
import Path from '../../navigations/constants.js'
import { useGetAPI } from '../../services/serviceHooks.js'
import { endpoints } from '../../services/constants.js'

const Home = () => {
  const [activeSlideContent, setActiveSlideContent] = useState(0)
  const [healthData, setHealthData] = useState([])
  const slideContent = [
    {
      header: 'Let us get well together',
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod 
            tempor incididunt ut labore et dolore magna aliqua. 
            Utenim ad minim veniam, quis nostrud exercitation ullamco laboris `,
      image: assets.homeImg1,
    },
    {
      header: 'You are not alone...',
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod 
            tempor incididunt ut labore et dolore magna aliqua. 
            Utenim ad minim veniam, quis nostrud exercitation ullamco laboris `,
      image: assets.homeImg2,
    },
    {
      header: '5 ways to prevent HIV/AIDs',
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod 
            tempor incididunt ut labore et dolore magna aliqua. 
            Utenim ad minim veniam, quis nostrud exercitation ullamco laboris `,
      image: assets.homeImg3,
    },
  ]
  const switchContent = () => {
    setActiveSlideContent((prevstate) =>
      prevstate < slideContent.length - 1 ? prevstate + 1 : 0,
    )
  }
  const fetchHealthData = (data) => {
    setHealthData(data)
  }
  const healthDataAPI = useGetAPI(endpoints.stories, null, fetchHealthData)
  useEffect(() => {
    healthDataAPI.sendRequest()
  }, [])
  return (
    <>
      <section className="first-section">
        <div className="slider-container">
          <div className="slider-div">
            <div>
              <h1>{slideContent[activeSlideContent].header}</h1>
              <p>{slideContent[activeSlideContent].content}</p>
              <HomeButton>Create an Account</HomeButton>
            </div>
          </div>
          <div className="image-div">
            <img
              src={slideContent[activeSlideContent].image}
              alt={`${slideContent[activeSlideContent].header} image`}
            />
          </div>
          <button className="slider-btn" onClick={switchContent}>
            <FaArrowRight size={20} color="#A3A3A3" />
          </button>
        </div>

        <div className="slider-nav">
          {slideContent.map((value, idx) => (
            <>
              <div
                className={`nav-content ${activeSlideContent == idx ? 'active' : ''}`}
              >
                <h3>{value.header}</h3>
                <p>
                  {value.content.length > 50
                    ? value.content.slice(0, 50) + '...'
                    : value.content}
                </p>
              </div>
              {idx < slideContent.length - 1 && <hr />}
            </>
          ))}
        </div>
        <div className="slider-nav-mobile">
          <button>
            <FaArrowCircleLeft
              size={10}
              style={{ color: 'var(--home-btn-bg)' }}
            />
          </button>
          <p>{activeSlideContent + 1}</p>
          <button>
            <FaArrowAltCircleRight
              size={10}
              style={{ color: 'var(--home-btn-bg)' }}
            />
          </button>
        </div>
      </section>
      <section className="second-section">
        <div className="image-div">
          <img src={assets.homeImg4} alt="Connect with a doctor today image" />
        </div>
        <div className="content-div">
          <div>
            <h1>Connect with a doctor today</h1>
            <p>
              Connect with a certified doctor online for convenient and confidential consultations. 
              Simply choose a time that suits you, discuss your symptoms, 
              receive a diagnosis, and get your prescription delivered to your door.
            </p>
            <HomeButton>Learn More</HomeButton>
          </div>
        </div>
      </section>
      <section className="third-section">
        <div className="section-content-container">
          <h1>
            The Solutions <span>We Provide</span>
          </h1>
          <div className="content-div">
            <div>
              <h3>Drug Store</h3>
              <p>
              We offer a wide range of prescription medications, over-the-counter drugs, health supplements, and personal care products. 
              Shop conveniently and securely, with fast delivery and dedicated customer support to ensure you receive the care you deserve
              </p>
              <Link className="link" to={Path.home}>
                Learn more &gt;
              </Link>
            </div>
            <div>
              <h3>Online doctor</h3>
              <p>
              Connect with a certified doctor online for convenient and confidential consultations. 
              Simply choose a time that suits you, discuss your symptoms, receive a diagnosis, and 
              get your prescription delivered to your door.
              </p>
              <Link className="link" to={Path.home}>
                Learn more &gt;
              </Link>
            </div>
            <div>
              <h3>Support community</h3>
              <p>
              Join us in supporting a community of health-challenged individuals. 
              Together, we provide resources, encouragement, and connections to ensure everyone has the support they need for a healthier life.
              </p>
              <Link className="link" to={Path.home}>
                Learn more &gt;
              </Link>
            </div>
          </div>
        </div>

        <div className="image-div">
          <img src={assets.homeImg4} alt="solutions we provide image" />
        </div>
      </section>
      <section className="fourth-section">
        <div className="container">
          <div className="content-div">
            <h1>We deliver your quality drugs at the perfect time</h1>
            <p>
              As a pharmaceutical leader, we are focused on providing you with
              high-quality drugs. That is why we have collaborated with partners
              who share our commitment to excellence and timely delivery.
            </p>
          </div>
          <div className="partner-div">
            <img src={assets.google} alt="google" />
            <img src={assets.ios} alt="ios" />
            <img src={assets.samsung} alt="samsung" /> <br />
            <img src={assets.ios} alt="ios" />
            <img src={assets.samsung} alt="samsung" />
            <img src={assets.google} alt="google" />
          </div>
        </div>
      </section>
      <section className="mb-1em">
        <div className="container">
          <HealthTipContainer data={healthData} />
        </div>
      </section>
    </>
  )
}

export default Home
