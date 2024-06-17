// src/components/UserProfile.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useStore from '../store/store'
import {
  faUser,
  faCalendarAlt,
  faEnvelope,
  faEdit,
} from '@fortawesome/free-solid-svg-icons'
import axiosInstance from '../utils/axios'
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb'
import CardCareHomeFields from '../components/CardCareHomeFields'
import DefaultLayout from '../layout/DefaultLayout'
import UserActions from '../components/UsersActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface UserData {
  success: boolean
  data: {
    _id: string
    profile_picture: string
    email: string
    name: string
    active: boolean
    role: string
    email_verification: string
    createdAt: string
    updatedAt: string
    __v: number
  }
}

const UserProfile: React.FC = () => {
  const [isActive, setIsActive] = useState<boolean>(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const { user_id } = useParams<{ user_id: string }>()
  const { token, userId } = useStore()
  const navigate = useNavigate()

  const user_id_data = user_id ? user_id : userId
  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get(`/admin/user?id=${user_id_data}`)
      if (response.data.success) {
        setUserData(response.data)
      } else {
        console.error('Error:', response.data)
      }
    } catch (error) {
      console.error('Error fetching user data', error)
    }
  }

  const handleEditClick = (user_id_data: string | null) => {
    if (user_id_data === null) {
      console.log(null)
    }
    navigate(`/users/update/${user_id_data}`)
  }

  const handleToggleClick = async () => {
    console.log('Toggle button clicked')
    setIsActive((prev) => !prev)
    try {
      const response = await fetch(
        `http://localhost:9091/api/admin/user/${user_id_data}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ active: !isActive }),
        },
      )

      fetchUserData()
      if (!response.ok) {
        console.error('Failed to update user status')
      } else {
        alert('User status updated successfully')
      }
    } catch (error) {
      console.error('Error updating user status', error)
    }
  }
  useEffect(() => {
    if (user_id_data) {
      fetchUserData()
    }
  }, [user_id_data])

  const handleCreateUpdateCaregiver = (userId: string) => {
    navigate(`/caregivers/create-update/${userId}`)
  }

  return (
    <>
      {userData ? (
        <DefaultLayout>
          <Breadcrumb pageName="Users Profile" />

          <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
              <div className="mt-4">
                <div className="flex flex-col items-center">
                  <img
                    src={userData.data.profile_picture}
                    alt={`${userData.data.email} main`}
                    className="w-32 h-32 rounded-full object-cover mb-4"
                  />
                </div>

                <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                  {userData.data.name}
                </h3>
                <UserActions
                  isEnabled={isActive}
                  onEditClick={() =>
                    handleEditClick(!!user_id_data ? user_id_data : null)
                  }
                  onToggleClick={handleToggleClick}
                />
                <div className="mt-6.5">
                  <h4 className="mb-3.5 font-medium text-black dark:text-white">
                    USER INFO:
                  </h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <CardCareHomeFields
                      icon={faUser}
                      title="User ID"
                      value={userData.data._id}
                    />
                    <CardCareHomeFields
                      icon={faUser}
                      title="User Name"
                      value={userData.data.name}
                    />
                    <CardCareHomeFields
                      icon={faEnvelope}
                      title="Email"
                      value={userData.data.email}
                    />
                    <CardCareHomeFields
                      icon={faUser}
                      title="Role"
                      value={userData.data.role}
                    />
                    <CardCareHomeFields
                      icon={faCalendarAlt}
                      title="Active"
                      value={userData.data.active ? 'True' : 'False'}
                    />
                    <CardCareHomeFields
                      icon={faCalendarAlt}
                      title="Email Verification"
                      value={userData.data.email_verification}
                    />
                    <CardCareHomeFields
                      icon={faCalendarAlt}
                      title="Created At"
                      value={new Date(
                        userData.data.createdAt,
                      ).toLocaleDateString()}
                    />
                    <CardCareHomeFields
                      icon={faCalendarAlt}
                      title="Updated At"
                      value={new Date(
                        userData.data.updatedAt,
                      ).toLocaleDateString()}
                    />
                  </div>
                  {/* Button to create/update caregiver profile */}
                  {userData.data.role === 'CAREGIVER' ? (
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() =>
                          handleCreateUpdateCaregiver(userData.data._id)
                        }
                        className="flex items-center gap-1 text-sm font-medium text-white bg-blue-500 border border-blue-500 rounded px-3 py-1.5 hover:bg-blue-600"
                      >
                        <FontAwesomeIcon icon={faEdit} />  
                        Create/Update Caregiver Profile
                      </button>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          </div>
        </DefaultLayout>
      ) : (
        <div>Loading...</div>
      )}
    </>
  )
}

export default UserProfile
