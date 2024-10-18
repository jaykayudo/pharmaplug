import './style.scss'
import { HealthCard } from '../card/index.js'
import EmptyData from '../empty/index.js'

const HealthTipContainer = ({
  header1 = 'Health Tips',
  header2 = 'Featured stories',
  data,
}) => {
  return (
    <div>
      <div className="health-container-header">
        <p>{header1}</p>
        <h2>{header2}</h2>
      </div>
      {data.length > 0 ? (
        <div className="health-container-content">
          {data.map((value, idx) => (
            <div key={idx} className="health-card-cover">
              <HealthCard
                image={value.image}
                description={value.title}
                date={value.date}
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyData />
      )}
    </div>
  )
}

export default HealthTipContainer
