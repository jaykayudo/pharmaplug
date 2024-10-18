import './style.scss'

const SiteLoader = () => {
  return (
    <div className="site-loader-cover">
      <div className="loader">
        <svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
          <rect
            className="pill"
            x="5"
            y="5"
            width="90"
            height="40"
            rx="20"
            ry="20"
          />
          <line className="line" x1="50" y1="5" x2="50" y2="45" />
        </svg>
      </div>
    </div>
  )
}

export const Loader = () => {
  return (
    <div className="loader-cover">
      <div className="loader">
        <svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
          <rect
            className="pill"
            x="5"
            y="5"
            width="90"
            height="40"
            rx="20"
            ry="20"
          />
          <line className="line" x1="50" y1="5" x2="50" y2="45" />
        </svg>
      </div>
    </div>
  )
}

export default SiteLoader
