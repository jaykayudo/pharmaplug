import { GiEmptyHourglass } from 'react-icons/gi'

const EmptyData = ({ content = 'No data' }) => {
  return (
    <div
      style={{
        padding: '1em',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <GiEmptyHourglass size={30} />
      <p
        style={{
          fontSize: 20,
          fontWeight: 500,
        }}
      >
        {content}
      </p>
    </div>
  )
}

export default EmptyData
