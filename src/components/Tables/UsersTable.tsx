import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFilter,
  faArrowAltCircleRight,
  faAdd,
} from '@fortawesome/free-solid-svg-icons'
import axiosInstance from '../../utils/axios'

const UserTable = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState({
    totalUsers: 0,
    limit: 10,
    totalPages: 1,
    currentPage: 1,
  })

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(`/admin/user`, {
        params: {
          page: pagination.currentPage,
          limit: pagination.limit,
        },
      })
      if (response.data.success) {
        setUsers(response.data.data)
        setPagination({
          ...pagination,
          totalPages: response.data.totalPages,
          totalUsers: response.data.totalUsers,
          currentPage: response.data.currentPage,
        })
      } else {
        console.error('Failed to fetch users')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [pagination.currentPage, pagination.limit])

  const handlePreviousPage = () => {
    setPagination((prev) => ({
      ...prev,
      currentPage: Math.max(prev.currentPage - 1, 1),
    }))
  }

  const handleNextPage = () => {
    setPagination((prev) => ({
      ...prev,
      currentPage: Math.min(prev.currentPage + 1, prev.totalPages),
    }))
  }

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = Math.max(1, Math.min(50, parseInt(event.target.value, 10)))
    setPagination((prev) => ({
      ...prev,
      limit: isNaN(newLimit) ? prev.limit : newLimit,
      currentPage: 1,
    }))
  }

  const handleCreateClick = () => {
    navigate(`/users/create`)
  }

  const handleViewUser = (userId: string) => {
    navigate(`/users/${userId}`)
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          All Users
        </h4>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleCreateClick()}
            className="flex items-center gap-1 text-sm font-medium text-white bg-blue-500 border border-blue-500 rounded px-3 py-1.5 hover:bg-blue-600"
          >
            <FontAwesomeIcon icon={faAdd} />
            Create User
          </button>
          <FontAwesomeIcon icon={faFilter} className="text-gray-500" />
          <input
            type="number"
            min="1"
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
              Email
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Role
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Status
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Created At
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Actions
            </h5>
          </div>
        </div>

        {users.map((user: any, key: number) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${
              key === users.length - 1
                ? ''
                : 'border-b border-stroke dark:border-strokedark'
            }`}
            key={user._id}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{user.email}</p>
            </div>
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black dark:text-white">{user.role}</p>
            </div>
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black dark:text-white">
                {user.active ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-meta-5">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center justify-center p-2.5 sm:p-5">
              <button
                onClick={() => handleViewUser(user._id)}
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
            disabled={pagination.currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            Previous
          </button>

          {pagination.currentPage > 1 && (
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: pagination.currentPage - 1,
                }))
              }
              className="px-4 py-2 text-sm font-medium text-black bg-white border border-stroke rounded hover:bg-gray-100"
            >
              {pagination.currentPage - 1}
            </button>
          )}

          <button
            disabled
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded"
          >
            {pagination.currentPage}
          </button>

          {pagination.currentPage < pagination.totalPages && (
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: pagination.currentPage + 1,
                }))
              }
              className="px-4 py-2 text-sm font-medium text-black bg-white border border-stroke rounded hover:bg-gray-100"
            >
              {pagination.currentPage + 1}
            </button>
          )}

          <button
            onClick={handleNextPage}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserTable
