import assets from '../../assets/index.js'
import './style.scss'

const Logo = ({ style = {}, coverStyle = {}, altLogo = false }) => {
  return (
    <>
      <div className="logo-div" style={coverStyle}>
        {altLogo ? (
          <img
            src={assets.logoBlueSvg}
            style={style}
            className="logo"
            alt="Pharmaplug logo"
          />
        ) : (
          <img
            src={assets.logoSvg}
            style={style}
            className="logo"
            alt="Pharmaplug logo"
          />
        )}
      </div>
    </>
  )
}

export default Logo
