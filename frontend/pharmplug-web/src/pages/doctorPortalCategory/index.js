import './style.scss'
import DrugSearchHeader from '../../components/drugSearchHeader/index.js'
import assets from '../../assets/index.js'
import Path from '../../navigations/constants.js'
import { LinkButton, NormalButton } from '../../components/button/index.js'
import { FaSearch } from 'react-icons/fa'
import { useSearchParams } from 'react-router-dom'
import { useGetAPI } from '../../services/serviceHooks.js'
import { endpoints } from '../../services/constants.js'
import { useEffect, useState } from 'react'
import { Loader } from '../../components/loader/index.js'
import EmptyData from '../../components/empty/index.js'

const DoctorPortalCategory = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [data, setData] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const category = searchParams.get('category')
  const [type, setType] = useState(category ?? '')
  const [categoryName, setCategoryName] = useState('doctors')

  const selectType = (e) => {
    setType(e.target.value)
  }
  const searchWithType = () => {
    if (!type) return
    setSearchParams({ category: type })
  }

  const fetchDoctors = (data) => {
    setData(data)
  }
  const fetchCategories = (data) => {
    setCategoryList(data)
  }
  const categoryListAPI = useGetAPI(
    endpoints.doctorCategories,
    null,
    fetchCategories,
  )
  const { sendRequest, loading } = useGetAPI(
    endpoints.doctorList,
    null,
    fetchDoctors,
  )
  useEffect(() => {
    let data = undefined
    if (category) {
      data = {
        category: category,
      }
      const newCategory = categoryList.find((value) => value.id == category)
      setCategoryName(newCategory?.name ?? 'doctors')
    }
    sendRequest(data)
  }, [category])
  useEffect(() => {
    categoryListAPI.sendRequest()
  }, [])
  return (
    <div>
      <DrugSearchHeader header="Doctor Portal" showSearchInput={false} />
      <div className="container">
        <div
          className="doctor-search-area mb-1em"
          style={{ paddingRight: '1em' }}
        >
          <div className="single-filter">
            <h3>Select Type</h3>
            <select onChange={selectType}>
              <option value={''} selected={type === ''}>
                Select a Type
              </option>
              {categoryList.map((value, idx) => (
                <option value={value.id} key={idx} selected={type === value.id}>
                  {value.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <NormalButton onClick={searchWithType}>
              <FaSearch size={22} color="white" />
            </NormalButton>
          </div>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="mb-1em">
              <h3 className="mb-05em">
                Search related to{' '}
                <span>
                  {categoryList.find((value) => value.id == type)?.name ??
                    'doctors'}
                </span>
              </h3>
              <p className="text-gray font-14">
                <span>{data.length}</span>{' '}
                {categoryList.find((value) => value.id == type)?.name ??
                  'doctors'}{' '}
                available at your current location.
              </p>
            </div>
            {data.length === 0 && <EmptyData />}
            <div className="flex doctor-cover">
              {data.map((value, index) => (
                <div
                  key={index}
                  className="w-30 sm-w-45 doctor-details-box"
                  style={{ backgroundImage: `url("${value.image}")` }}
                >
                  <div>
                    <h3 className="flex-between">
                      <span>
                        {value.user.first_name} {value.user.last_name}
                      </span>
                      <span>{value.rate}</span>
                    </h3>
                    <p className="text-gray mb-05em">{value.description}</p>
                    <LinkButton full to={Path.scheduleConsultation(value.id)}>
                      Book appointment
                    </LinkButton>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default DoctorPortalCategory
