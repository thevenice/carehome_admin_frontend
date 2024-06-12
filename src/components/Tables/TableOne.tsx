import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ProductOne from '../../images/product/product-01.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFilter,
  faEye,
  faArrowAltCircleDown,
  faArrowAltCircleRight,
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axios'

const TableOne = () => {
  const navigate = useNavigate()
  // const history = useHistory();
  const [careHomes, setCareHomes] = useState([])
  const [pagination, setPagination] = useState({
    total_care_homes: 0,
    limit: 1,
    total_pages: 0,
    current_page: 1,
  })

  const fetchCareHomes = async () => {
    try {
      const response = await axiosInstance.get(`/super/care-homes`, {
        params: {
          page: pagination.current_page,
          limit: pagination.limit,
        },
      })
      if (response.data.success) {
        setCareHomes(response.data.data)
        setPagination(response.data.pagination)
      } else {
        console.error('Failed to fetch care homes')
      }
    } catch (error) {
      console.error('Error fetching care homes:', error)
    }
  }

  useEffect(() => {
    fetchCareHomes()
  }, [pagination.current_page, pagination.limit])

  const handlePreviousPage = () => {
    setPagination((prev) => ({
      ...prev,
      current_page: Math.max(prev.current_page - 1, 1),
    }))
  }

  const handleNextPage = () => {
    setPagination((prev) => ({
      ...prev,
      current_page: Math.min(prev.current_page + 1, prev.total_pages),
    }))
  }

  const handleLimitChange = (event: any) => {
    const newLimit = Math.max(0, Math.min(50, parseInt(event.target.value, 10)))
    setPagination((prev) => ({
      ...prev,
      limit: isNaN(newLimit) ? prev.limit : newLimit,
      current_page: 1,
    }))
  }

  const handleViewCareHome = (careHomeId: string) => {
    navigate(`/carehome-profile/${careHomeId}`)
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          All Care Homes
        </h4>
        <div className="flex items-center space-x-2">
          <FontAwesomeIcon icon={faFilter} className="text-gray-500" />
          <input
            type="number"
            min="0"
            max="50"
            value={pagination.limit}
            onChange={handleLimitChange}
            className="w-20 px-2 py-1 border border-gray-300 rounded"
            placeholder="Limit"
          />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Name
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Staff Size
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Registration Date
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Actions
            </h5>
          </div>
        </div>

        {careHomes.map((careHome: any, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${
              key === careHomes.length - 1
                ? ''
                : 'border-b border-stroke dark:border-strokedark'
            }`}
            key={careHome._id}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <div className="flex-shrink-0">
                <img
                  // src={`${baseURL}/${careHome.settings.logo_link}`}
                  src={ProductOne}
                  alt="Care Home Logo"
                  className="h-10 w-10 rounded-full"
                />
              </div>
              <p className="hidden text-black dark:text-white sm:block">
                {careHome.name}
              </p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black dark:text-white">
                {careHome.staff_size}
              </p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-meta-5">{careHome.registration_date}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 sm:p-5">
              <button
                onClick={() => handleViewCareHome(careHome._id)}
                className="text-blue-500 hover:text-blue-600"
              >
                <FontAwesomeIcon icon={faArrowAltCircleRight} />
              </button>
            </div>
          </div>
        ))}

        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={handlePreviousPage}
            disabled={pagination.current_page === 1}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            Previous
          </button>

          {pagination.current_page > 1 && (
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  current_page: pagination.current_page - 1,
                }))
              }
              className="px-4 py-2 text-sm font-medium text-black bg-white border border-stroke rounded hover:bg-gray-100"
            >
              {pagination.current_page - 1}
            </button>
          )}

          <button
            disabled
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded"
          >
            {pagination.current_page}
          </button>

          {pagination.current_page < pagination.total_pages && (
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  current_page: pagination.current_page + 1,
                }))
              }
              className="px-4 py-2 text-sm font-medium text-black bg-white border border-stroke rounded hover:bg-gray-100"
            >
              {pagination.current_page + 1}
            </button>
          )}

          <button
            onClick={handleNextPage}
            disabled={pagination.current_page === pagination.total_pages}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default TableOne
